import { userState } from '@/state/userState.svelte';

type UserData = {
	id: number;
	createdAt: string;
	lastLogin?: string;
	email: string;
	emailVerified: boolean;
	username?: string;
	admin: boolean;
	passwordsCount: number;
};

const getUsers = async (): Promise<UserData[]> => {
	const res = await fetch(`${userState.serverUrl}/admin/users`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		throw new Error('Failed to fetch users');
	}

	const data: UserData[] = await res.json();

	return data;
};

const getUser = async (id: number): Promise<UserData> => {
	const res = await fetch(`${userState.serverUrl}/admin/users/${id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		throw new Error('Failed to fetch user');
	}

	const data: UserData = await res.json();

	return data;
};

const toggleEmailVerification = async (id: number): Promise<void> => {
	const res = await fetch(`${userState.serverUrl}/admin/users/${id}/email/toggle-verification`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		throw new Error('Failed to toggle email verification');
	}

	return;
};

const toggleRole = async (id: number): Promise<void> => {
	const res = await fetch(`${userState.serverUrl}/admin/users/${id}/role/toggle`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	});

	if (!res.ok) {
		throw new Error('Failed to toggle role');
	}

	return;
};

export { type UserData, getUsers, getUser, toggleEmailVerification, toggleRole };
