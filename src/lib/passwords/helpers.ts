import wasm from '@phi-ag/argon2/argon2.wasm?url';
import initialize from '@phi-ag/argon2/fetch';

const uintArrayToBase64 = (uintArray: Uint8Array): string => {
	let binaryString = '';
	const len = uintArray.byteLength;
	for (let i = 0; i < len; i++) {
		binaryString += String.fromCharCode(uintArray[i]);
	}
	return btoa(binaryString);
};

const base64toUintArray = (base64: string): Uint8Array => {
	const binaryString = atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes;
};

const hexStringToBytes = (hexString: string): Uint8Array => {
	if (hexString.length % 2 !== 0) {
		throw new Error('Invalid hex string length');
	}
	const byteArray = new Uint8Array(hexString.length / 2);
	for (let i = 0; i < hexString.length; i += 2) {
		const hexByte = hexString.substring(i, i + 2);
		const byte = parseInt(hexByte, 16);
		byteArray[i / 2] = byte;
	}
	return byteArray;
};

const generateSalt = (length: number = 16): string => {
	const buffer = new Uint8Array(length);
	window.crypto.getRandomValues(buffer);
	let salt = '';
	for (let i = 0; i < buffer.length; i++) {
		const byte = buffer[i].toString(16).padStart(2, '0');
		salt += byte;
	}
	return salt;
};

const generateNonce = (length: number = 12): Uint8Array => {
	const nonce = new Uint8Array(length);
	window.crypto.getRandomValues(nonce);

	return nonce;
};

const derive = async (masterPassword: string, salt: string): Promise<Uint8Array> => {
	const argon2 = await initialize(wasm);

	const result = argon2.hash(masterPassword, {
		salt: base64toUintArray(salt),
		timeCost: 2,
		hashLength: 32,
		memoryCost: 19456,
		parallelism: 1,
		version: 19
	});

	return result.hash;
};

export {
	uintArrayToBase64,
	base64toUintArray,
	hexStringToBytes,
	generateSalt,
	generateNonce,
	derive
};
