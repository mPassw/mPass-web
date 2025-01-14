import {
	calculateA,
	calculateK,
	calculateM1,
	calculateS,
	calculateU,
	calculateX
} from '@/crypto/loginUtils';
import { base64ToHex } from '@/crypto/utils.svelte';
import { userState } from '@/state/userState.svelte';

const login = async (): Promise<string> => {
	const salt = await requestSalt();

	const { a, A } = calculateA();
	const B = await sendCrenentials(A.toString(16));

	const u = calculateU(A, B);
	const k = calculateK();
	const x = calculateX(salt);

	const S = calculateS(a, B, k, u, x);
	const M1 = calculateM1(A, B, S);

	const token = await verifyProof(M1);

	return token;
};

export { login };

const requestSalt = async (): Promise<string> => {
	const res = await fetch(`${userState.serverUrl}/auth/login/request-salt`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email: userState.email })
	});

	if (!res.ok) {
		throw new Error(await res.json());
	}

	const data = await res.json();

	return base64ToHex(data.salt);
};

const sendCrenentials = async (A: string): Promise<bigint> => {
	const res = await fetch(`${userState.serverUrl}/auth/login/send-credentials`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: userState.email,
			a: A
		})
	});

	if (!res.ok) {
		throw new Error(await res.json());
	}

	const data = await res.json();

	return BigInt(data.b);
};

const verifyProof = async (M1: string): Promise<string> => {
	const res = await fetch(`${userState.serverUrl}/auth/login/verify-proof`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: userState.email,
			m1: M1
		})
	});

	if (!res.ok) {
		throw new Error(await res.json());
	}

	const data = await res.json();

	return data.token;
};
