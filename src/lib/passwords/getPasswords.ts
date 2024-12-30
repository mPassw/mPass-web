interface ServicePassword {
	id: number;
	createdAt: Date;
	updatedAt?: Date;
	title: string;
	websites: string[];
	login?: string;
	password?: string;
	note?: string;
	salt: string;
	nonce: string;
}

const getPasswords = async (
	serverUrl: string,
	{ limit, offset, orderBy, orderDirection, search, fromDate, toDate }: GetPasswordsParams
): Promise<ServicePassword[]> => {
	let url = `${serverUrl}/passwords?`;

	if (limit) url += `limit=${limit}&`;
	if (offset) url += `offset=${offset}&`;
	if (orderBy) url += `orderBy=${orderBy}&`;
	if (orderDirection) url += `orderDirection=${orderDirection}&`;
	if (search) url += `search=${search}&`;
	if (fromDate) url += `fromDate=${fromDate.toISOString()}&`;
	if (toDate) url += `toDate=${toDate.toISOString()}&`;

	const res = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
		}
	});

	const data: ServicePassword[] = await res.json();

	return data;
};

export { getPasswords, type ServicePassword };

interface GetPasswordsParams {
	limit?: number;
	offset?: number;
	orderBy?: 'title' | 'login' | 'createdAt';
	orderDirection?: 'asc' | 'desc';
	search?: string;
	fromDate?: Date;
	toDate?: Date;
}
