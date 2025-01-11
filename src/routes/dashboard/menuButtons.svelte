<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '@/components/ui/button';
	import { userState } from '@/state/userState.svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
</script>

<Button
	href="/dashboard"
	variant="ghost"
	class="items-center justify-start {page.url.pathname === '/dashboard' ? 'bg-accent' : ''}"
>
	<Icon icon="material-symbols:password-rounded" font-size="20" />
	Passwords
</Button>
<Button
	href="/dashboard/trash"
	variant="ghost"
	class="items-center justify-start {page.url.pathname === '/dashboard/trash' ? 'bg-accent' : ''}"
>
	<Icon icon="lucide:trash" font-size="20" />
	Trash
</Button>
<Button
	href="/dashboard/import-export"
	variant="ghost"
	class="items-center justify-start {page.url.pathname === '/dashboard/import-export'
		? 'bg-accent'
		: ''}"
>
	<Icon icon="lucide:arrow-right-left" font-size="20" />
	Import/Export
</Button>
<Button
	href="/dashboard/account"
	variant="ghost"
	class="items-center justify-start {page.url.pathname === '/dashboard/account' ? 'bg-accent' : ''}"
>
	<Icon icon="lucide:user-round" font-size="20" />
	My account
</Button>
{#if userState.isAdmin}
	<Button
		href="/dashboard/admin"
		variant="ghost"
		class="items-center justify-start {page.url.pathname === '/dashboard/admin' ? 'bg-accent' : ''}"
	>
		<Icon icon="lucide:wrench" font-size="20" />
		Admin
	</Button>
{/if}
<Button
	onclick={() => {
		userState.reset();
		goto('/auth');
		toast.success('Logged out');
	}}
	variant="ghost"
	class="items-center justify-start"
>
	<Icon icon="lucide:log-out" font-size="20" />
	Log out
</Button>
