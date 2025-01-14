import type { Password } from '@/state/passwordsState.svelte';
import { encryptString } from './encryptPassword.svelte';
import { userState } from '@/state/userState.svelte';
import { goto } from '$app/navigation';

const savePassword = async (password: Password) => {
	let updatedLogin = password.login;
	let updatedPassword = password.password;
	let updatedNote = password.note;

	if (updatedLogin) {
		updatedLogin = await encryptString({
			masterPassword: userState.password,
			plaintext: updatedLogin,
			salt: password.salt,
			nonce: password.nonce
		});
	}

	if (updatedPassword) {
		updatedPassword = await encryptString({
			masterPassword: userState.password,
			plaintext: updatedPassword,
			salt: password.salt,
			nonce: password.nonce
		});
	}

	if (updatedNote) {
		updatedNote = await encryptString({
			masterPassword: userState.password,
			plaintext: updatedNote,
			salt: password.salt,
			nonce: password.nonce
		});
	}

	const res = await fetch(`${userState.serverUrl}/passwords/update/${password.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userState.authToken}`
		},
		body: JSON.stringify({
			title: password.title,
			login: updatedLogin,
			password: updatedPassword,
			websites: password.websites,
			note: updatedNote
		})
	});

	if (!res.ok) {
		if (res.status === 498) {
			userState.reset();
			await goto('/auth');
		}

		throw new Error('Failed to save password');
	}
};

export { savePassword };
