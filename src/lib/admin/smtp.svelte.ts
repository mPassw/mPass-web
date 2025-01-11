import { userState } from '@/state/userState.svelte';

const sendTestEmail = async (email: string): Promise<Response> => {
	const res = await fetch(`${userState.serverUrl}/admin/smtp/test`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userState.authToken}`
		},
		body: JSON.stringify({
			email: email
		})
	});

	return res;
};

export { sendTestEmail };
