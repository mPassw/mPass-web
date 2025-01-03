const decrypt = async (
	masterPassword: string,
	salt: string,
	nonce: string,
	encrypted: string
): Promise<string> => {
	return new Promise((resolve, reject) => {
		const worker = new Worker(new URL('./decryptWorker.ts', import.meta.url), {
			type: 'module'
		});

		worker.postMessage({ masterPassword, salt, nonce, encrypted });

		worker.onmessage = (event) => {
			if ('error' in event.data) {
				worker.terminate();
				reject(event.data.error);
			} else {
				worker.terminate();
				resolve(event.data.decrypted);
			}
		};

		worker.onerror = (error) => {
			worker.terminate();
			reject(error);
		};
	});
};

export { decrypt };
