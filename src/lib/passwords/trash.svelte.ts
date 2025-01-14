import { passwordsState } from '@/state/passwordsState.svelte';
import { userState } from '@/state/userState.svelte';

const movePasswordToTrash = async (id: number) => {
	const res = await fetch(`${userState.serverUrl}/passwords/to-trash/${id}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		throw new Error(await res.json());
	}

	passwordsState.moveToTrash(id);
};

const movePasswordFromTrash = async (id: number) => {
	const res = await fetch(`${userState.serverUrl}/passwords/from-trash/${id}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		throw new Error(await res.json());
	}

	passwordsState.moveFromTrash(id);
};

export { movePasswordToTrash, movePasswordFromTrash };
