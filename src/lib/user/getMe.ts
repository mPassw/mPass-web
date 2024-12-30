interface UserData {
	createdAt: string;
	lastLogin: string;
	email: string;
	emailVerified: boolean;
	admin: boolean;
}

const getMe = async (serverUrl: string): Promise<UserData> => {
	const res = await fetch(`${serverUrl}/@me`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
		}
	});

	const data: UserData = await res.json();

	return data;
};

export { getMe, type UserData };
