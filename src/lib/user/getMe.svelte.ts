import { userState } from '@/state/userState.svelte';

const getMe = async () => {
	const res = await fetch(`${userState.serverUrl}/@me`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		throw new Error('Failed to get user data');
	}

	const data = await res.json();

	userState.id = data.id;
	userState.email = data.email;
	userState.username = data.username;

	userState.createdAt = data.createdAt;
	userState.lastLogin = data.lastLogin;

	userState.isEmailVerified = data.emailVerified;
	userState.isAdmin = data.admin;
};

export { getMe };
