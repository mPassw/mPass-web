import { passwordsState, type PasswordBase } from '@/state/passwordsState.svelte';
import { encryptPasswordBase } from './encryptPassword.svelte';
import { userState } from '@/state/userState.svelte';
import { getPasswords } from './getPasswords.svelte';
import { goto } from '$app/navigation';

const createPassword = async (password: PasswordBase): Promise<void> => {
	const encryptedPassword = await encryptPasswordBase(password);

	const res = await fetch(`${userState.serverUrl}/passwords/new`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userState.authToken}`
		},
		body: JSON.stringify({
			title: encryptedPassword.title,
			websites: encryptedPassword.websites,
			login: encryptedPassword.login,
			password: encryptedPassword.password,
			note: encryptedPassword.note,
			salt: encryptedPassword.salt,
			nonce: encryptedPassword.nonce
		})
	});

	if (!res.ok) {
		if (res.status === 498) {
			userState.reset();
			await goto('/auth');
		}

		throw new Error('Failed to create password');
	}

	passwordsState.passwords = [];

	await getPasswords();
};

export { createPassword };
