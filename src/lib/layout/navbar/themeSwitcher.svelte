<script>
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { mode, toggleMode } from 'mode-watcher';
</script>

<div>
	<Button variant="link" size="icon" onclick={toggleMode}>
		<Icon icon={$mode === 'dark' ? 'lucide:moon' : 'lucide:sun'} font-size="20px" />
	</Button>
</div>
