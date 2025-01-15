<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { buttonVariants } from '@/components/ui/button';
	import { userState } from '@/state/userState.svelte';
	import Icon from '@iconify/svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
		<Icon icon="lucide:user-minus" font-size="20" />
		Delete Account
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Not implemented yet</Dialog.Title>
		</Dialog.Header>
		<Dialog.Footer class="gap-1.5"></Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
