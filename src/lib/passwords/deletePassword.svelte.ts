import { passwordsState } from '@/state/passwordsState.svelte';
import { userState } from '@/state/userState.svelte';

const deletePassword = async (id: number) => {
	const res = await fetch(`${userState.serverUrl}/passwords/delete/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		throw new Error('Failed to delete password');
	}

	passwordsState.removePassword(id);
};

export { deletePassword };
