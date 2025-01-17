import { goto } from '$app/navigation';
import { userState } from '@/state/userState.svelte';

const updateUsername = async (masterPassword: string, newUsername?: string): Promise<Response> => {
	if (masterPassword !== userState.password) {
		throw new Error('Invalid password');
	}

	const res = await fetch(`${userState.serverUrl}/@me/username/update`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userState.authToken}`
		},
		body: JSON.stringify({
			username: newUsername?.length ? newUsername : null
		})
	});

	if (res.status === 498) {
		userState.reset();
		await goto('/auth');

		throw new Error('Invalid token');
	}

	return res;
};

export { updateUsername };
