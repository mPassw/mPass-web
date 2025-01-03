import { xchacha20poly1305 } from '@noble/ciphers/chacha';
import { base64toUintArray, derive } from './helpers';

const decrypt = async (
	masterPassword: string,
	salt: string,
	nonce: string,
	encrypted: string
): Promise<string> => {
	const key = await derive(masterPassword, salt);
	const chacha = xchacha20poly1305(key, base64toUintArray(nonce));
	const decrypted = chacha.decrypt(base64toUintArray(encrypted));

	if (!decrypted) {
		throw new Error('Decryption failed');
	}

	return new TextDecoder().decode(decrypted);
};

export { decrypt };
