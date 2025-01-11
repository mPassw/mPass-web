import { generateBase64Salt } from '@/crypto/utils.svelte';
import { encryptor, type PasswordBase } from '@/state/passwordsState.svelte';
import { userState } from '@/state/userState.svelte';

const encryptString = async ({
	masterPassword,
	plaintext,
	salt,
	nonce
}: {
	masterPassword: string;
	plaintext: string;
	salt?: string;
	nonce?: string;
}): Promise<string> => {
	if (!salt) {
		salt = generateBase64Salt();
	}

	const key = await encryptor.derive(masterPassword, salt);

	if (!nonce) {
		nonce = generateBase64Salt(24);
	}

	return await encryptor.encrypt(plaintext, key.hash, nonce);
};

const encryptPasswordBase = async (password: PasswordBase): Promise<PasswordBase> => {
	password.salt = generateBase64Salt();
	password.nonce = generateBase64Salt(24);

	const key = await encryptor.derive(userState.password, password.salt);

	if (password.login) {
		password.login = await encryptor.encrypt(password.login, key.hash, password.nonce);
	}

	if (password.password) {
		password.password = await encryptor.encrypt(password.password, key.hash, password.nonce);
	}

	if (password.note) {
		password.note = await encryptor.encrypt(password.note, key.hash, password.nonce);
	}

	return password;
};

export { encryptString, encryptPasswordBase };
