<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { generateSimpleLogin, generateSimplePassword } from '@/passwords/generator.svelte';
	import type { PasswordBase } from '@/state/passwordsState.svelte';
	import { userState } from '@/state/userState.svelte';
	import Icon from '@iconify/svelte';

	let { newPassword, isLoading }: { newPassword: PasswordBase; isLoading: boolean } = $props();

	let isPasswordRevealed: boolean = $state(false);
</script>

<div class="flex w-full flex-col gap-2 rounded-md border bg-white p-4 dark:bg-black">
	<div class="flex flex-col gap-1.5">
		<div class="grid w-full items-center gap-1">
			<Label for="new-password-login" class="text-start text-lg font-semibold">Login</Label>
			<Input
				bind:value={newPassword.login}
				disabled={isLoading}
				autofocus={false}
				type="email"
				id="new-password-login"
				placeholder="mail@example.com"
			/>
		</div>
		<div class="flex flex-row items-center gap-1">
			<Button
				disabled={isLoading}
				class="self-start"
				variant="link"
				onclick={() => (newPassword.login = generateSimpleLogin(userState.email, 6))}
			>
				<Icon icon="lucide:refresh-cw" font-size="18" />
				Generate
			</Button>
		</div>
	</div>

	<div class="flex flex-col gap-1">
		<div class="grid w-full items-center gap-1">
			<Label for="new-password-password" class="text-start text-lg font-semibold">Password</Label>
			<Input
				disabled={isLoading}
				bind:value={newPassword.password}
				autofocus={false}
				type={isPasswordRevealed ? 'text' : 'password'}
				id="new-password-password"
				placeholder="********"
			/>
		</div>
		<div class="flex flex-row items-center gap-1">
			<Button
				disabled={isLoading}
				class="self-start"
				variant="link"
				onclick={() => (newPassword.password = generateSimplePassword(24, 8, 4))}
			>
				<Icon icon="lucide:refresh-cw" font-size="18" />
				Generate
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
