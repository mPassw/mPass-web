import { passwordsState, type TrashedPassword } from '@/state/passwordsState.svelte';
import { userState } from '@/state/userState.svelte';

const movePasswordToTrash = async (id: number) => {
	const res = await fetch(`${userState.serverUrl}/passwords/to-trash/${id}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		throw new Error('Failed to trash password');
	}

	passwordsState.removePassword(id);
};

const movePasswordFromTrash = async (password: TrashedPassword) => {
	const res = await fetch(`${userState.serverUrl}/passwords/from-trash/${password.id}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		throw new Error('Failed to move password from trash');
	}

	passwordsState.addPassword(password);
};

export { movePasswordToTrash, movePasswordFromTrash };
