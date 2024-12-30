const verifyEmail = async (email: string, code: string, serverUrl: string): Promise<boolean> => {
	const res = await fetch(`${serverUrl}/auth/email/verify`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			code
		})
	});

	return res.ok;
};

export { verifyEmail };
