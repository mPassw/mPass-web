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
			Downloads
			<Icon icon="lucide:chevron-down" class="{isOpen ? 'rotate-180' : 'rotate-0'} duration-300" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<a
					href="/downloads/browser"
					class="flex select-none items-center gap-2 rounded-sm p-2 text-sm hover:bg-accent"
				>
					<Icon icon="lucide:globe" font-size="20px" />
					Browser Extension
				</a>
				<a
					href="/downloads/desktop"
					class="flex select-none items-center gap-2 rounded-sm p-2 text-sm hover:bg-accent"
				>
					<Icon icon="lucide:monitor" font-size="20px" />
					Destop App
				</a>
				<a
					href="/downloads/android"
					class="flex select-none items-center gap-2 rounded-sm p-2 text-sm hover:bg-accent"
				>
					<Icon icon="cib:android" font-size="20px" />
					Android App
				</a>
				<a
					href="/downloads/ios"
					class="flex select-none items-center gap-2 rounded-sm p-2 text-sm hover:bg-accent"
				>
					<Icon icon="cib:apple" font-size="20px" />
					iOS App
				</a>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
