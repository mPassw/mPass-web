import { g, N } from './primes';
import { base64ToBigInt, modPow } from './utils';
import jsSHA from 'jssha/sha256';

const login = async (email: string, password: string, serverUrl: string): Promise<Response> => {
	const salt = await getSaltFromServer(email, serverUrl);

	const a =
		BigInt(
			'0x' +
				Array.from(crypto.getRandomValues(new Uint8Array(32)))
					.map((b) => b.toString(16).padStart(2, '0'))
					.join('')
		) % N;
	const A = modPow(g, a, N);

	const B = await sendCretentials(email, A.toString(16), serverUrl);

	const u = BigInt(
		'0x' +
			new jsSHA('SHA-256', 'HEX')
				.update(A.toString(16).padStart(512, '0'))
				.update(B.toString(16).padStart(512, '0'))
				.getHash('HEX')
	);

	const k = BigInt(
		'0x' +
			new jsSHA('SHA-256', 'HEX')
				.update(N.toString(16))
				.update(g.toString(16).padStart(512, '0'))
				.getHash('HEX')
	);

	const x = BigInt(
		'0x' +
			new jsSHA('SHA-256', 'HEX')
				.update(salt.toString(16))
				.update(new jsSHA('SHA-256', 'TEXT').update(email + ':' + password).getHash('HEX'))
				.getHash('HEX')
	);

	const S_base = B - k * modPow(g, x, N);
	const S = modPow(((S_base % N) + N) % N, a + u * x, N);

	const M1 = new jsSHA('SHA-256', 'HEX')
		.update(A.toString(16).padStart(512, '0'))
		.update(B.toString(16).padStart(512, '0'))
		.update(S.toString(16).padStart(512, '0'))
		.getHash('HEX');

	const response = await verifyProof(email, M1, serverUrl);
	return response;
};

export { login };

// step 1
const getSaltFromServer = async (email: string, serverUrl: string): Promise<bigint> => {
	const res = await fetch(`${serverUrl}/auth/login/request-salt`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email })
	});
	const data = await res.json();

	if (!res.ok) {
		throw new Error('Step 1 failed');
	}

	return base64ToBigInt(data.salt);
};

// step 2
const sendCretentials = async (email: string, A: string, serverUrl: string): Promise<bigint> => {
	const res = await fetch(`${serverUrl}/auth/login/send-credentials`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, A })
	});
	const data = await res.json();

	if (!res.ok) {
		throw new Error('Step 2 failed');
	}

	return BigInt(data.b);
};

// step 3
const verifyProof = async (email: string, M1: string, serverUrl: string): Promise<Response> => {
	const res = await fetch(`${serverUrl}/auth/login/verify-proof`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, m1: M1 })
	});

	if (!res.ok) {
		throw new Error('Step 3 failed');
	}

	return res;
};
