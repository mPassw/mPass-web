import { goto } from '$app/navigation';
import { userState } from '@/state/userState.svelte';

const deauthorizeSessions = async () => {
	const res = await fetch(`${userState.serverUrl}/@me/DeauthorizeSessions`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		if (res.status === 498) {
			userState.reset();
			await goto('/auth');
		}

		throw new Error(await res.json());
	}
};
export { deauthorizeSessions };
