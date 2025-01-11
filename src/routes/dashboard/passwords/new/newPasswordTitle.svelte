<script lang="ts">
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import type { PasswordBase } from '@/state/passwordsState.svelte';

	let { newPassword, isLoading }: { newPassword: PasswordBase; isLoading: boolean } = $props();
</script>

<div class="flex w-full flex-col gap-2 rounded-md border bg-white p-4 dark:bg-black">
	<div class="flex flex-col gap-1.5">
		<div class="grid w-full items-center gap-1">
			<Label for="new-password-title" class="text-start text-lg font-semibold"
				>Title<span class="text-red-600">*</span></Label
			>
			<Input
				bind:value={newPassword.title}
				disabled={isLoading}
				autofocus={false}
				type="text"
				id="new-password-title"
				placeholder="My super secret password"
			/>
		</div>
	</div>
</div>
