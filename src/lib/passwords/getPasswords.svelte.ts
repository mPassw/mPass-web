import { passwordsState, type Password } from '@/state/passwordsState.svelte';
import { userState } from '@/state/userState.svelte';

const getPasswords = async () => {
	const res = await fetch(
		`${userState.serverUrl}/passwords?orderBy=createdAt&orderDirection=desc`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${userState.authToken}`
			}
		}
	);

	if (!res.ok) {
		throw new Error('Failed to get passwords');
	}

	const data: Password[] = await res.json();

	passwordsState.passwords = data.map((password) => ({
		...password,
		decrypted: false
	}));
};

export { getPasswords };
