<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import type { Password } from '@/state/passwordsState.svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';

	let { password, isLoading }: { password: Password; isLoading: boolean } = $props();
	let isPasswordRevealed: boolean = $state(false);
</script>

<div class="flex flex-col gap-2 rounded-md border bg-white p-4 dark:bg-black">
	<div class="flex flex-col gap-1.5">
		<div class="grid w-full items-center gap-1">
			<Label for="password-{password.id}-login" class="text-start text-lg font-semibold"
				>Login</Label
			>
			<Input
				bind:value={password.login}
				disabled={isLoading}
				autofocus={false}
				type="email"
				id="password-{password.id}-login"
				placeholder="mail@example.com"
			/>
		</div>
		<Button
			disabled={isLoading || !password.login}
			class="self-start"
			variant="link"
			onclick={async () => {
				if (password.login) {
					await navigator.clipboard.writeText(password.login);
					toast.success('Copied');
				}
			}}
		>
			<Icon icon="lucide:copy" font-size="18" />
			Copy
		</Button>
	</div>

	<div class="flex flex-col gap-1.5">
		<div class="grid w-full items-center gap-1">
			<Label for="password-{password.id}-password" class="text-start text-lg font-semibold"
				>Password</Label
			>
			<Input
				disabled={isLoading}
				bind:value={password.password}
				autofocus={false}
				type={isPasswordRevealed ? 'text' : 'password'}
				id="password-{password.id}-password"
				placeholder="********"
			/>
		</div>
		<div class="flex flex-row items-center gap-1">
			<Button
				disabled={isLoading || !password.password}
				class="self-start"
				variant="link"
				onclick={async () => {
					if (password.password) {
						await navigator.clipboard.writeText(password.password);
						toast.success('Copied');
					}
				}}
			>
				<Icon icon="lucide:copy" font-size="18" />
				Copy
			</Button>
			<Button
				disabled={isLoading}
				class="self-start"
				variant="link"
				onclick={() => (isPasswordRevealed = !isPasswordRevealed)}
			>
				<Icon icon={isPasswordRevealed ? 'lucide:eye-closed' : 'lucide:eye'} font-size="18" />
				{isPasswordRevealed ? 'Hide' : 'Show'}
			</Button>
		</div>
	</div>
</div>
