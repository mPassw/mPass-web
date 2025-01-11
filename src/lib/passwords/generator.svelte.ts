import { userState } from '@/state/userState.svelte';
import { encryptor } from '@/state/passwordsState.svelte';

const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERSET = '0123456789';
const SPECIALSET = '!@#$%^&*()_+';

// type for password history item
type HistoryItem = {
	password: string;
	date: Date;
};

/**
 * Get a random word from the words list
 * @param amount amount of words to get (default `1`)
 * @param capitalize whether to capitalize the words (default `false`)
 * @returns array of words
 */
const getWords = (amount: number = 1, capitalize: boolean = false): string[] => {
	if (encryptor.wordsList.length === 0) {
		(async () => {
			await encryptor.loadWordsList();
		})();
	}

	const result: string[] = [];

	for (let i = 0; i < amount; i++) {
		const randomIndex = Math.floor(Math.random() * encryptor.wordsList.length);
		let word = encryptor.wordsList[randomIndex].trim();
		if (capitalize) {
			word = word.charAt(0).toUpperCase() + word.slice(1);
		}
		result.push(word);
	}

	return result;
};

/**
 * Generate a passphrase with given parameters
 * @param wordCount number of words in passphrase
 * @param numberCount number of numbers to add after words
 * @param separator string to separate words
 * @param capitalize whether to capitalize words
 * @returns generated passphrase
 */
const generatePassphrase = (
	wordCount: number = 3,
	numberCount: number = 1,
	separator: string = '-',
	capitalize: boolean = true
): string => {
	const words = getWords(wordCount, capitalize);

	const availablePositions = Array.from({ length: wordCount }, (_, i) => i);
	const shuffle = (arr: number[]) => arr.sort(() => Math.random() - 0.5);
	shuffle(availablePositions);

	for (let i = 0; i < Math.min(numberCount, wordCount); i++) {
		const pos = availablePositions[i];
		const randomNum = Math.floor(Math.random() * 10);
		words[pos] = words[pos] + randomNum;
	}

	return words.join(separator);
};

/**
 * Generate a simple password with a given length, amount of numbers, special characters, and capitalized letters
 * @param length password length
 * @param numbers amount of numbers in the password
 * @param specials amount of special characters in the password
 * @param capitalized amount of capitalized letters in the password
 * @returns generated password
 */
const generateSimplePassword = (
	length: number = 12,
	numbers: number = 4,
	specials: number = 1,
	capitalized: number = 2
): string => {
	const result = Array(length)
		.fill('')
		.map(() => CHARSET.toLowerCase().charAt(Math.floor(Math.random() * CHARSET.length)));

	const availablePositions = Array.from({ length }, (_, i) => i);
	const shuffle = (arr: number[]) => arr.sort(() => Math.random() - 0.5);

	for (let i = 0; i < numbers; i++) {
		const posIndex = Math.floor(Math.random() * availablePositions.length);
		const pos = availablePositions.splice(posIndex, 1)[0];
		result[pos] = NUMBERSET.charAt(Math.floor(Math.random() * NUMBERSET.length));
	}

	for (let i = 0; i < specials; i++) {
		const posIndex = Math.floor(Math.random() * availablePositions.length);
		const pos = availablePositions.splice(posIndex, 1)[0];
		result[pos] = SPECIALSET.charAt(Math.floor(Math.random() * SPECIALSET.length));
	}

	shuffle(availablePositions);
	for (let i = 0; i < capitalized; i++) {
		if (availablePositions.length === 0) break;
		const pos = availablePositions.pop()!;
		result[pos] = result[pos].toUpperCase();
	}

	return result.join('');
};

/**
 * Generate a simple login based on the user's email
 * @param length random part length
 * @returns generated login
 */
const generateSimpleLogin = (email: string = userState.email, length: number = 4): string => {
	const name = email.split('@')[0];
	const domain = email.split('@')[1];

	const random = Math.random()
		.toString(36)
		.substring(2, 2 + length);

	return `${name}+${random}@${domain}`;
};

/**
 * Get the password history from the local storage
 * @returns password history
 */
const getPasswordHistory = (): HistoryItem[] => {
	const passwords = localStorage.getItem('passwordsHistory');

	if (passwords) {
		return JSON.parse(passwords);
	}

	return [];
};

/**
 * Add a password to the password history. The history is limited to 100 items, because of performance issues with large record
 * @param password password to add
 */
const addPasswordToHistory = (password: string): void => {
	const passwords = getPasswordHistory();
	passwords.unshift({ password, date: new Date() });

	if (passwords.length > 100) {
		passwords.length = 100;
	}

	localStorage.setItem('passwordsHistory', JSON.stringify(passwords));
};

/**
 * Clear the password history
 */
const clearPasswordHistory = () => {
	localStorage.removeItem('passwordsHistory');
};

export {
	type HistoryItem,
	CHARSET,
	NUMBERSET,
	SPECIALSET,
	getWords,
	generatePassphrase,
	generateSimplePassword,
	generateSimpleLogin,
	getPasswordHistory,
	addPasswordToHistory,
	clearPasswordHistory
};
