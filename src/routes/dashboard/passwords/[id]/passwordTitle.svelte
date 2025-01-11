<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Password } from '@/state/passwordsState.svelte';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { toast } from 'svelte-sonner';

	let { password, isLoading }: { password: Password; isLoading: boolean } = $props();
</script>

<div class="rounded-md border bg-white p-4 dark:bg-black">
	<div class="flex flex-col gap-1.5">
		<div class="grid w-full items-center gap-1">
			<Label for="password-{password.id}-title" class="text-start text-lg font-semibold"
				>Title</Label
			>
			<Input
				bind:value={password.title}
				disabled={isLoading}
				autofocus={false}
				type="text"
				id="password-{password.id}-title"
				placeholder="My super secret password"
			/>
		</div>
		<Button
			disabled={isLoading || !password.title}
			class="self-start"
			variant="link"
			onclick={async () => {
				await navigator.clipboard.writeText(password.title);
				toast.success('Copied');
			}}
		>
			<Icon icon="lucide:copy" font-size="18" />
			Copy
		</Button>
	</div>
</div>
