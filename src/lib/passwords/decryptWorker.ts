import { ChaCha20Poly1305 } from '@stablelib/chacha20poly1305';
import { base64toUintArray, derive } from './helpers';

declare let self: Worker;

self.onmessage = async (event: MessageEvent) => {
	const { masterPassword, salt, nonce, encrypted } = event.data;

	const key = await derive(masterPassword, salt);
	const chacha = new ChaCha20Poly1305(key);

	const decrypted = chacha.open(base64toUintArray(nonce), base64toUintArray(encrypted));

	if (!decrypted) {
		self.postMessage({ error: 'Decryption failed' });
		return;
	}

	self.postMessage({ decrypted: new TextDecoder().decode(decrypted) });
};
