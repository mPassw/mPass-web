<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import Icon from '@iconify/svelte';

	let isOpen: boolean = $state(false);
</script>

<div>
	<DropdownMenu.Root bind:open={isOpen}>
		<DropdownMenu.Trigger
			class={buttonVariants({ variant: 'link', class: 'flex items-center gap-2' })}
		>
			Resources
			<Icon icon="lucide:chevron-down" class="{isOpen ? 'rotate-180' : 'rotate-0'} duration-300" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<a
					href="/docs"
					class="flex select-none items-center gap-2 rounded-sm p-2 text-sm hover:bg-accent"
				>
					<Icon icon="lucide:book-open-text" font-size="20px" />
					Documentation
				</a>
				<a
					href="https://github.com/mPassw/"
					target="_blank"
					class="flex select-none items-center gap-2 rounded-sm p-2 text-sm hover:bg-accent"
				>
					<Icon icon="lucide:github" font-size="20px" />
					GitHub
				</a>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
