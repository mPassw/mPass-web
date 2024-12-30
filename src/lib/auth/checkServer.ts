const isServerValid = async (url: string): Promise<boolean> => {
	try {
		const res = await fetch(url, {
			method: 'GET'
		});

		if (!res.ok) return false;
		if (!res.headers.get('x-mpass-instance')) return false;

		return true;
	} catch {
		return false;
	}
};

const fixUrl = (url: string): string => {
	let fixedUrl = url;

	if (!/(http|https):\/\//.test(fixedUrl)) {
		fixedUrl = `http://${fixedUrl}`;
	}
	while (fixedUrl.endsWith('/')) {
		fixedUrl = fixedUrl.slice(0, -1);
	}

	return fixedUrl;
};

export { isServerValid, fixUrl };
