import { passwordsState } from '@/state/passwordsState.svelte';
import { userState } from '@/state/userState.svelte';

export const deleteAllPasswords = async () => {
	const res = await fetch(`${userState.serverUrl}/passwords/bulk-delete`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		throw new Error(await res.text());
	}

	passwordsState.passwords = [];
};
