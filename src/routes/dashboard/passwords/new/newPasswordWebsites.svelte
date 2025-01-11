<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import type { PasswordBase } from '@/state/passwordsState.svelte';
	import Icon from '@iconify/svelte';

	let { newPassword, isLoading }: { newPassword: PasswordBase; isLoading: boolean } = $props();
</script>

<div class="flex w-full flex-col gap-2 rounded-md border bg-white p-4 dark:bg-black">
	<div class="flex flex-col gap-1.5">
		<div class="grid w-full items-center gap-1">
			<h2 class="text-start text-lg font-semibold">Websites</h2>
			{#each newPassword.websites as website, index}
				<Input
					bind:value={newPassword.websites[index]}
					disabled={isLoading}
					autofocus={false}
					type="url"
					placeholder="https://example.com"
				/>
				<div class="flex w-full flex-row items-center justify-start gap-1">
					<Button
						disabled={isLoading || !website}
						href={website
							? website.startsWith('http://') || website.startsWith('https://')
								? website
								: `https://${website}`
							: undefined}
						variant="link"
						target="_blank"
					>
						<Icon icon="lucide:external-link" font-size="18" />
						Open
					</Button>
					<Button
						disabled={isLoading || newPassword.websites.length <= 1}
						variant="link"
						onclick={() => newPassword.websites.splice(index, 1)}
					>
						<Icon icon="lucide:trash" font-size="18" />
						Remove
					</Button>
				</div>
			{/each}
		</div>
		<Button
			class="self-start"
			variant="link"
			onclick={() => newPassword.websites.push('')}
			disabled={newPassword.websites.length >= 10 || isLoading}
		>
			<Icon icon="lucide:plus" font-size="18" />
			Add Website
		</Button>
	</div>
</div>
