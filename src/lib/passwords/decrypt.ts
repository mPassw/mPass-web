import { ChaCha20Poly1305 } from '@stablelib/chacha20poly1305';
import { base64toUintArray, derive } from './helpers';

const decrypt = async (
	masterPassword: string,
	salt: string,
	nonce: string,
	encrypted: string
): Promise<string> => {
	const key = await derive(masterPassword, salt);

	const chacha = new ChaCha20Poly1305(key);

	const decrypted = chacha.open(base64toUintArray(nonce), base64toUintArray(encrypted));

	if (!decrypted) {
		throw new Error('Decryption failed');
	}

	return new TextDecoder().decode(decrypted);
};

export { decrypt };
