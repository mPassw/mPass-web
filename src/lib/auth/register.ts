import { g, N } from './primes';
import { bufferToBigInt, modPow } from './utils';

const register = async (email: string, password: string, serverUrl: string): Promise<Response> => {
	const { salt, verifier } = await generateSaltVerifier(email, password);

	const res = await fetch(`${serverUrl}/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			salt,
			verifier: verifier.toString(16)
		})
	});

	return res;
};

export { register };

const generateSaltVerifier = async (
	username: string,
	password: string
): Promise<{ salt: string; verifier: bigint }> => {
	const saltLength = new Uint8Array(16);
	const saltBytes = window.crypto.getRandomValues(new Uint8Array(saltLength));
	const saltBase64 = btoa(String.fromCharCode(...saltBytes));

	// SHA256(username || ':' || password)
	const encoder = new TextEncoder();
	const innerHashData = encoder.encode(`${username}:${password}`);
	const innerHashBuffer = await window.crypto.subtle.digest('SHA-256', innerHashData);

	// SHA256(salt || innerHash)
	const saltUint8Array = new Uint8Array(saltBytes);
	const combinedData = new Uint8Array(saltUint8Array.length + innerHashBuffer.byteLength);
	combinedData.set(saltUint8Array, 0);
	combinedData.set(new Uint8Array(innerHashBuffer), saltUint8Array.length);

	const outerHashBuffer = await window.crypto.subtle.digest('SHA-256', combinedData);

	const x = bufferToBigInt(new Uint8Array(outerHashBuffer));
	const verifier = modPow(g, x, N);

	return {
		salt: saltBase64,
		verifier: verifier
	};
};
