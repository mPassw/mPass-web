import { base64toUintArray, generateBase64Salt, uintArrayToBase64 } from '@/crypto/utils.svelte';
import { xchacha20poly1305 } from '@noble/ciphers/chacha';
import type Argon2 from '@phi-ag/argon2';
import wasm from '@phi-ag/argon2/argon2.wasm?url';
import initialize from '@phi-ag/argon2/fetch';
import wordsAlpha from '$lib/assets/words_alpha.txt';

type PasswordBase = {
	createdAt: Date | string;
	title: string;
	websites: string[];
	login?: string;
	password?: string;
	note?: string;
	salt: string;
	nonce: string;
	inTrash: boolean;
};

type Password = PasswordBase & {
	id: number;
	updatedAt?: Date;
	decrypted: boolean;
};

class Encryptor {
	argon2: Argon2 | null = $state(null);
	wordsList: string[] = $state([]);

	async init() {
		if (!this.argon2) {
			this.argon2 = await initialize(wasm);
		}
	}

	async loadWordsList() {
		if (this.wordsList.length > 0) return;

		const text = await (await fetch(wordsAlpha)).text();
		this.wordsList = text.split('\n');
	}

	async derive(masterPassword: string, salt?: string) {
		if (!this.argon2) {
			await this.init();
		}

		if (!salt) {
			salt = generateBase64Salt();
		}

		return this.argon2!.hash(masterPassword, {
			salt: base64toUintArray(salt),
			timeCost: 2,
			hashLength: 32,
			memoryCost: 19456,
			parallelism: 1,
			version: 19
		});
	}

	async encrypt(plaintext: string, hash: Uint8Array, nonce: string) {
		if (!this.argon2) {
			await this.init();
		}

		const chacha = xchacha20poly1305(hash, base64toUintArray(nonce));
		const encrypted = chacha.encrypt(new TextEncoder().encode(plaintext));

		return uintArrayToBase64(encrypted);
	}

	async decrypt(password: string, hash: Uint8Array, nonce: string) {
		if (!this.argon2) {
			await this.init();
		}

		const chacha = xchacha20poly1305(hash, base64toUintArray(nonce));
		const decrypted = chacha.decrypt(base64toUintArray(password));

		return new TextDecoder().decode(decrypted);
	}
}

class PasswordsData {
	passwords: Password[] = $state([]);

	getPassword(id: number) {
		return this.passwords.find((p) => p.id === id);
	}

	addPassword(password: Password) {
		this.passwords = [password, ...this.passwords];
	}

	removePassword(id: number) {
		this.passwords = this.passwords.filter((p) => p.id !== id);
	}

	updatePassword(password: Password) {
		this.passwords = this.passwords.map((p) => (p.id === password.id ? password : p));
	}

	moveToTrash(id: number) {
		const password = this.getPassword(id);

		if (password) {
			this.updatePassword({ ...password, inTrash: true });
		}
	}

	moveFromTrash(id: number) {
		const password = this.getPassword(id);

		if (password) {
			this.updatePassword({ ...password, inTrash: false });
		}
	}
}

const encryptor = new Encryptor();
const passwordsState = new PasswordsData();

export { encryptor, passwordsState, type Password, type PasswordBase };
