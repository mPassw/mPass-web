import { encryptor, passwordsState, type Password } from '@/state/passwordsState.svelte';
import { userState } from '@/state/userState.svelte';
import { toast } from 'svelte-sonner';

const decryptPassword = async (password: Password): Promise<void> => {
	if (password.decrypted) return;

	try {
		const key = await encryptor.derive(userState.password, password.salt);

		if (password.login) {
			const decrypted = await encryptor.decrypt(password.login, key.hash, password.nonce);
			password.login = decrypted;
		}

		if (password.password) {
			const decrypted = await encryptor.decrypt(password.password, key.hash, password.nonce);
			password.password = decrypted;
		}

		if (password.note) {
			const decrypted = await encryptor.decrypt(password.note, key.hash, password.nonce);
			password.note = decrypted;
		}

		password.decrypted = true;

		passwordsState.updatePassword(password);
	} catch {
		toast.error('Failed to decrypt password');
	}
};

export { decryptPassword };
