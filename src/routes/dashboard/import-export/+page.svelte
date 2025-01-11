<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { BlurFade } from '@/animations/blurFade';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { decryptPassword } from '@/passwords/decryptPassword.svelte';
	import { passwordsState } from '@/state/passwordsState.svelte';
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

	let isLoading: boolean = $state(false);

	let masterPassword: string = $state('');
	let format: 'json' | 'csv' = $state('json');

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
			console.error(err);
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

	$effect(() => {
		if (!format) {
			format = 'json';
		}
	});
</script>

<BlurFade delay={0.1} once class="flex w-full flex-col gap-4 p-4 pb-20 xl:pb-0">
	<div class="flex w-full flex-col rounded-md border bg-white p-4 dark:bg-black">
		<h1 class="text-xl font-semibold">Import</h1>
	</div>

	<div class="flex w-full flex-col rounded-md border bg-white p-4 dark:bg-black">
		<h1 class="text-xl font-semibold">Export</h1>
		<!-- <p class="tracking-tight text-muted-foreground">Export your passwords to JSON or CSV file</p> -->
		<p class="mt-2 tracking-tight text-muted-foreground">
			To export passwords select the format, enter the master password and click the <span
				class="font-bold">export</span
			> button.
		</p>
		<p class="tracking-tight text-muted-foreground">
			This process could take a while depending on the number of passwords you have, and your
			hardware
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
