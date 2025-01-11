const N: bigint = BigInt(
	'0xAC6BDB41324A9A9BF166DE5E1389582FAF72B6651987EE07FC319294' +
		'3DB56050A37329CBB4A099ED8193E0757767A13DD52312AB4B03310D' +
		'CD7F48A9DA04FD50E8083969EDB767B0CF6095179A163AB3661A05FB' +
		'D5FAAAE82918A9962F0B93B855F97993EC975EEAA80D740ADBF4FF74' +
		'7359D041D5C33EA71D281E446B14773BCA97B43A23FB801676BD207A' +
		'436C6481F1D2B9078717461A5B9D32E688F87748544523B524B0D57D' +
		'5EA77A2775D2ECFA032CFBDBF52FB3786160279004E57AE6AF874E73' +
		'03CE53299CCC041C7BC308D82A5698F3A8D0C38271AE35F8E9DBFBB6' +
		'94B5C803D89F7AE435DE236D525F54759B65E372FCD68EF20FA7111F' +
		'9E4AFF73'
);

const G: bigint = BigInt(2);

const modPow = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
	if (modulus === 1n) return 0n;

	let result = 1n;
	base = base % modulus;
	while (exponent > 0n) {
		if (exponent % 2n === 1n) result = (result * base) % modulus;
		base = (base * base) % modulus;
		exponent = exponent / 2n;
	}
	return result;
};

const stringToUintArray = (str: string): Uint8Array => {
	const encoder = new TextEncoder();
	return encoder.encode(str);
};

const bufferToBigInt = (bytes: Uint8Array): bigint => {
	const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
	return BigInt('0x' + hex);
};

const base64ToBigInt = (base64: string): bigint => {
	const binaryString = atob(base64);

	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	return bufferToBigInt(bytes);
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

const base64ToHex = (base64: string): string => {
	const bytes = base64toUintArray(base64);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
};

const hexToBase64 = (hex: string): string => {
	const pairs = hex.match(/[\dA-F]{2}/gi) || [];
	const bytes = new Uint8Array(pairs.map((pair) => parseInt(pair, 16)));
	return uintArrayToBase64(bytes);
};

const uintArrayToBase64 = (uintArray: Uint8Array): string => {
	let binaryString = '';
	const len = uintArray.byteLength;
	for (let i = 0; i < len; i++) {
		binaryString += String.fromCharCode(uintArray[i]);
	}
	return btoa(binaryString);
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

// can also be used to generate base64 nonce - just pass length as 24
const generateBase64Salt = (length: number = 16): string => {
	const buffer = new Uint8Array(length);
	window.crypto.getRandomValues(buffer);

	let binaryString = '';
	for (let i = 0; i < buffer.byteLength; i++) {
		binaryString += String.fromCharCode(buffer[i]);
	}

	const base64Salt = btoa(binaryString);
	return base64Salt;
};

export {
	N,
	G,
	modPow,
	stringToUintArray,
	bufferToBigInt,
	base64ToHex,
	hexToBase64,
	base64ToBigInt,
	base64toUintArray,
	uintArrayToBase64,
	generateSalt,
	generateBase64Salt
};
