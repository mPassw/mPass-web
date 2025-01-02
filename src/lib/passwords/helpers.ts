// @ts-expect-error - type is missing
import argon2 from 'argon2-browser/dist/argon2-bundled.min.js';

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
	const key = await argon2.hash({
		pass: masterPassword,
		salt: atob(salt),
		time: 2,
		mem: 19456,
		hashLen: 32,
		parallelism: 1,
		type: argon2.ArgonType.Argon2id
	});

	return key.hash as Uint8Array;
};

export {
	uintArrayToBase64,
	base64toUintArray,
	hexStringToBytes,
	generateSalt,
	generateNonce,
	derive
};
