import {
	addPasswordToHistory,
	clearPasswordHistory,
	generatePassphrase,
	generateSimpleLogin,
	generateSimplePassword,
	getPasswordHistory,
	getWords,
	type HistoryItem
} from '@/passwords/generator.svelte';
import { userState } from './userState.svelte';

class PasswordGenerator {
	generatedPassword: string = $state('');
	passwordHistory: HistoryItem[] = $state([]);

	generateType: 'password' | 'username' | 'history' = $state('password');
	passwordType: 'password' | 'passphrase' = $state('password');
	usernameType: 'addressedEmail' | 'randomWord' = $state('addressedEmail');

	passwordLength: number = $state(12);
	passwordNumbersAmount: number = $state(1);
	passwordSpecialAmount: number = $state(1);

	passphraseLength: number = $state(4);
	passphraseNumbersAmount: number = $state(1);
	passphraseSeparator: string = $state('-');
	passphraseCapitalization: boolean = $state(false);

	usernameAddressedEmail: string = $state(userState.email ?? localStorage.getItem('email') ?? '');
	usernameAddressedEmailLength: number = $state(6);

	usernameRandomWordCapitalization: boolean = $state(false);
	usernameRandomWordIncludeNumber: boolean = $state(false);

	generate() {
		const oldState = this.generatedPassword;

		if (this.generateType === 'password') {
			if (this.passwordType === 'password') {
				this.generatedPassword = generateSimplePassword(
					this.passwordLength,
					this.passwordNumbersAmount,
					this.passwordSpecialAmount,
					(this.passwordLength - (this.passwordNumbersAmount + this.passwordSpecialAmount)) / 2
				);
			} else if (this.passwordType === 'passphrase') {
				this.generatedPassword = generatePassphrase(
					this.passphraseLength,
					this.passphraseNumbersAmount,
					this.passphraseSeparator,
					this.passphraseCapitalization
				);
			}
		} else if (this.generateType === 'username') {
			if (this.usernameType === 'addressedEmail') {
				this.generatedPassword = generateSimpleLogin(
					this.usernameAddressedEmail || userState.email,
					this.usernameAddressedEmailLength
				);
			} else if (this.usernameType === 'randomWord') {
				this.generatedPassword = getWords(1, this.usernameRandomWordCapitalization)[0];

				if (this.usernameRandomWordIncludeNumber) {
					this.generatedPassword += Math.floor(Math.random() * 10000)
						.toString()
						.padStart(4, '0');
				}
			}
		}

		if (oldState !== this.generatedPassword && this.generateType === 'password') {
			addPasswordToHistory(this.generatedPassword);
			this.updateHistory();
		}
	}

	updateHistory() {
		this.passwordHistory = getPasswordHistory();
	}

	savePasswordToHistory() {
		addPasswordToHistory(this.generatedPassword);
		this.passwordHistory = getPasswordHistory();
	}

	clearHistory() {
		clearPasswordHistory();
		this.passwordHistory = [];
	}
}

const passwordGeneratorState = new PasswordGenerator();

export { passwordGeneratorState };
