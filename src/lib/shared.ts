import { writable, type Writable } from 'svelte/store';
import type { ServicePassword } from './passwords';
import type { UserData } from './user';

const instanceUrl: Writable<string> = writable('');
const email: Writable<string> = writable('');
const password: Writable<string> = writable('');

const userData: Writable<UserData> = writable({} as UserData);
const servicePasswords: Writable<ServicePassword[]> = writable([]);

// server - initial state, not logged in, request server url
// email - email verification
const currentAuthState: Writable<'loggedin' | 'server' | 'login' | 'register' | 'email'> =
	writable('server');

export { instanceUrl, email, currentAuthState, password, userData, servicePasswords };
