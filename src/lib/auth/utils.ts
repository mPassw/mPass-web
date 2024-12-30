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

export { modPow, bufferToBigInt, base64ToBigInt };
