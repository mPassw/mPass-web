import jsSHA from 'jssha/sha256';
import { G, modPow, N } from './utils.svelte';
import { userState } from '@/state/userState.svelte';

const calculateA = (): { a: bigint; A: bigint } => {
	const a =
		BigInt(
			'0x' +
				Array.from(crypto.getRandomValues(new Uint8Array(32)))
					.map((b) => b.toString(16).padStart(2, '0'))
					.join('')
		) % N;
	const A = modPow(G, a, N);
	return { a, A };
};

const calculateU = (A: bigint, B: bigint): bigint => {
	return BigInt(
		'0x' +
			new jsSHA('SHA-256', 'HEX')
				.update(A.toString(16).padStart(512, '0'))
				.update(B.toString(16).padStart(512, '0'))
				.getHash('HEX')
	);
};

const calculateK = (): bigint => {
	return BigInt(
		'0x' +
			new jsSHA('SHA-256', 'HEX')
				.update(N.toString(16))
				.update(G.toString(16).padStart(512, '0'))
				.getHash('HEX')
	);
};

const calculateX = (salt: string): bigint => {
	return BigInt(
		'0x' +
			new jsSHA('SHA-256', 'HEX')
				.update(salt)
				.update(
					new jsSHA('SHA-256', 'TEXT')
						.update(userState.email + ':' + userState.password)
						.getHash('HEX')
				)
				.getHash('HEX')
	);
};

const calculateS = (a: bigint, B: bigint, k: bigint, u: bigint, x: bigint): bigint => {
	const s = B - k * modPow(G, x, N);

	return modPow(((s % N) + N) % N, a + u * x, N);
};

const calculateM1 = (A: bigint, B: bigint, S: bigint): string => {
	return new jsSHA('SHA-256', 'HEX')
		.update(A.toString(16).padStart(512, '0'))
		.update(B.toString(16).padStart(512, '0'))
		.update(S.toString(16).padStart(512, '0'))
		.getHash('HEX');
};

const getExpFromJwt = (token: string): number => {
	const parts = token.split('.');
	if (parts.length !== 3) {
		throw new Error();
	}

	const payload = JSON.parse(atob(parts[1]));

	if (typeof payload.exp === 'number') {
		return payload.exp;
	} else {
		throw new Error();
	}
};

export { calculateA, calculateU, calculateK, calculateX, calculateS, calculateM1, getExpFromJwt };
