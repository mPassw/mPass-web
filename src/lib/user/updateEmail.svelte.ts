import { goto } from '$app/navigation';
import { userState } from '@/state/userState.svelte';

const updateEmailGetCode = async (): Promise<void> => {
	const res = await fetch(`${userState.serverUrl}/@me/email/update/request-code`, {
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
		throw new Error(await res.text());
	}
};

const updateEmail = async (
	newEmail: string,
	code: string,
	salt: string,
	verifier: string,
	masterPassword: string
): Promise<void> => {
	if (masterPassword !== userState.password) {
		throw new Error('Invalid password');
	}

	const res = await fetch(`${userState.serverUrl}/@me/email/update/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userState.authToken}`
		},
		body: JSON.stringify({
			email: newEmail,
			code,
			salt,
			verifier
		})
	});

	if (!res.ok) {
		if (res.status === 498) {
			userState.reset();
			await goto('/auth');
		}

		throw new Error(await res.text());
	}
};

export { updateEmailGetCode, updateEmail };
