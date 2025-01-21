<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { BlurFade } from '@/animations/blurFade';
	import { Badge } from '@/components/ui/badge';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { decryptPassword } from '@/passwords/decryptPassword.svelte';
	import { encryptPasswordBase } from '@/passwords/encryptPassword.svelte';
	import { bulkAddPasswords, type Bitwarden } from '@/passwords/import.svelte';
	import { passwordsState, type PasswordBase } from '@/state/passwordsState.svelte';
	import { userState } from '@/state/userState.svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';

	type PasswordToExport = {
		createdAt: string;
		updatedAt?: string;
		title: string;
		websites: string[];
		login?: string;
		password?: string;
		note?: string;
	};

	let fileToImport: string | null = $state(null);
	let passwordsToImport: PasswordBase[] = $state([]);
	let bitwardenData: Bitwarden | null = $state(null);

	let isLoading: boolean = $state(false);

	let masterPassword: string = $state('');
	let format: 'json' | 'csv' = $state('json');

	const allowedImportFrom: string[] = ['Bitwarden JSON'];
	let importFrom: 'Bitwarden JSON' = $state('Bitwarden JSON');

	const exportPasswords = async () => {
		if (masterPassword !== userState.password) {
			toast.error('Invalid master password');
			return;
		}

		try {
			isLoading = true;

			if (format === 'json') {
				const decryptedPasswords: PasswordToExport[] = [];

				for (const password of passwordsState.passwords) {
					if (!password.decrypted) {
						await decryptPassword(password);
					}

					const decryptedPassword: PasswordToExport = {
						createdAt: new Date(password.createdAt).toISOString(),
						updatedAt: password.updatedAt ? new Date(password.updatedAt).toISOString() : undefined,
						title: password.title,
						websites: password.websites,
						login: password.login,
						password: password.password,
						note: password.note
					};

					decryptedPasswords.push(decryptedPassword);
				}

				exportJson(decryptedPasswords);
			} else {
				toast.error('CSV export is not supported yet');
			}
		} catch (err) {
			toast.error('Failed to export passwords');
		} finally {
			isLoading = false;
		}
	};

	const exportJson = (decryptedPasswords: PasswordToExport[]) => {
		const jsonString = JSON.stringify(decryptedPasswords, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `mPass-export-${new Date().toISOString().split('T')[0]}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast.success('Passwords exported');
	};

	const handleFileChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (event) => {
				fileToImport = event.target?.result as string;

				try {
					if (importFrom === 'Bitwarden JSON') {
						const parsedData = JSON.parse(fileToImport);
						if (parsedData.folders !== undefined && parsedData.items !== undefined) {
							bitwardenData = parsedData;
							console.log(bitwardenData);
						} else {
							toast.error('Invalid Bitwarden JSON format');
						}
					} else {
						passwordsToImport = JSON.parse(fileToImport);
					}
				} catch (error) {
					toast.error('Failed to parse JSON file.');
					console.error('Error parsing JSON:', error);
				}
			};

			reader.onerror = () => {
				toast.error('Failed to read the file.');
			};

			reader.readAsText(file);
		}
	};

	const handleImport = async () => {
		try {
			isLoading = true;

			if (importFrom === 'Bitwarden JSON' && bitwardenData) {
				if (bitwardenData.encrypted) {
					toast.error('Encrypted Bitwarden JSON is not supported');
					return;
				}

				const encryptedPasswords: PasswordBase[] = [];
				const passwords: PasswordBase[] = [];
				for (const password of bitwardenData.items) {
					const websites: string[] = [];

					for (const website of password.login.uris) {
						websites.push(website.uri);
					}

					const decryptedPassword: PasswordBase = {
						createdAt: password.creationDate,
						title: password.name,
						websites: websites,
						login: password.login.username ?? '',
						password: password.login.password ?? '',
						note: password.notes ?? '',
						inTrash: false,
						salt: '',
						nonce: ''
					};

					passwords.push(decryptedPassword);
				}

				for (const password of passwords) {
					encryptedPasswords.push(await encryptPasswordBase(password));
				}

				await bulkAddPasswords(encryptedPasswords);

				toast.success('Passwords imported!');
			} else {
				toast.error('Invalid import format');
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to import passwords');
		} finally {
			isLoading = false;
		}
	};

	$effect(() => {
		if (!format) {
			format = 'json';
		}
		if (!importFrom) {
			importFrom = 'Bitwarden JSON';
		}
	});
</script>

<BlurFade delay={0.1} once class="flex w-full flex-col gap-4 p-4 pb-20 xl:pb-0">
	<div class="flex w-full cursor-default flex-col rounded-md border bg-white p-4 dark:bg-black">
		<div class="flex flex-row items-center gap-1.5">
			<h1 class="text-xl font-semibold">Import</h1>
			<Badge variant="outline">Beta</Badge>
		</div>

		<div class="grid w-full items-center gap-1.5">
			<Label for="service">From</Label>
			<Select.Root type="single" bind:value={importFrom} disabled={isLoading}>
				<Select.Trigger class="w-full">{importFrom}</Select.Trigger>
				<Select.Content>
					{#each allowedImportFrom as allowedImportValue}
						<Select.Item value={allowedImportValue}>{allowedImportValue}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="mt-2 grid w-full items-center gap-1.5">
			<Label for="file">File</Label>
			<Input
				id="file"
				type="file"
				accept=".json"
				onchange={handleFileChange}
				disabled={isLoading}
			/>
		</div>

		<Button class="mt-2 self-start" variant="secondary" onclick={handleImport} disabled={isLoading}>
			<Icon icon="lucide:import" font-size="20" />
			Import
		</Button>
		<p class="tracking-tight text-muted-foreground">
			This process could take a while depending on the number of passwords you have, and your
			hardware
		</p>
	</div>

	<div class="flex w-full flex-col rounded-md border bg-white p-4 dark:bg-black">
		<h1 class="text-xl font-semibold">Export</h1>
		<p class="mt-2 tracking-tight text-muted-foreground">
			To export passwords select the format, enter the master password and click the <span
				class="font-bold">export</span
			> button.
		</p>

		<div class="mt-2 flex w-full flex-col items-start gap-2">
			<div class="grid w-full items-center gap-1.5">
				<Label for="format">Format</Label>
				<Select.Root type="single" bind:value={format} disabled={isLoading}>
					<Select.Trigger class="w-full">{format === 'json' ? 'JSON' : 'CSV'}</Select.Trigger>
					<Select.Content>
						<Select.Item value="json">JSON</Select.Item>
						<Select.Item value="csv">CSV</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<div class="grid w-full items-center gap-1.5">
				<Label for="master-password">Master Password</Label>
				<Input
					bind:value={masterPassword}
					disabled={isLoading}
					type="password"
					id="master-password"
					placeholder="********"
				/>
			</div>

			<Button variant="secondary" class="self-start" onclick={exportPasswords} disabled={isLoading}>
				<Icon icon="lucide:file-key" font-size="20" />
				Export
			</Button>
		</div>
	</div>
</BlurFade>
