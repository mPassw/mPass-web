const getExp = (token: string): number | null => {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) {
			throw new Error();
		}

		const payload = JSON.parse(atob(parts[1]));

		if (typeof payload.exp === 'number') {
			return payload.exp;
		} else {
			throw new Error();
		}
	} catch {
		return null;
	}
};

export { getExp };
