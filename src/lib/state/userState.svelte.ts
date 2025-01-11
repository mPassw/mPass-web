import { goto } from '$app/navigation';
import { getExpFromJwt } from '@/crypto/loginUtils';
import { toast } from 'svelte-sonner';
import { passwordsState } from './passwordsState.svelte';

class UserData {
	authState:
		| 'loggedIn'
		| 'serverValidation'
		| 'login'
		| 'registration'
		| 'emailVerification'
		| '2fa' = $state('serverValidation');
	authToken: string = $state('');
	authTimeoutId: NodeJS.Timeout | null = $state(null);

	serverUrl: string = $state('');
	username?: string = $state('');
	id: number = $state(0);
	email: string = $state('');
	password: string = $state('');

	createdAt: string = $state('');
	lastLogin: string = $state('');

	isEmailVerified: boolean = $state(false);
	isAdmin: boolean = $state(false);

	// this function is called after a successful login
	// it sets a timeout to log the user out after the token expires
	postLogin(token: string) {
		try {
			if (this.authTimeoutId) {
				clearTimeout(this.authTimeoutId);
				this.authTimeoutId = null;
			}

			const exp = getExpFromJwt(token);
			if (!exp) {
				throw new Error('Invalid token: no expiration found');
			}

			const expiryDate = new Date(exp * 1000);
			const now = new Date();
			const timeLeft = expiryDate.getTime() - now.getTime();

			if (timeLeft <= 0) {
				throw new Error('Token has already expired');
			}

			this.authToken = token;
			this.authState = 'loggedIn';
			this.saveEmail();

			this.authTimeoutId = setTimeout(() => {
				this.reset();
				toast.warning('Session expired');
				goto('/auth');
			}, timeLeft);
		} catch {
			this.reset();
			goto('/auth');
		}
	}

	// save/load data to/from local storage
	// this is useful for the user to not have to re-enter the server url or email every time
	saveServerUrl() {
		localStorage.setItem('serverUrl', this.serverUrl);
	}
	loadSavedServerUrl() {
		this.serverUrl = localStorage.getItem('serverUrl') || '';
	}
	saveEmail() {
		localStorage.setItem('email', this.email);
	}
	loadSavedEmail() {
		this.email = localStorage.getItem('email') || '';
	}

	reset() {
		this.authState = 'serverValidation';
		this.authToken = '';
		this.serverUrl = '';
		this.email = '';
		this.password = '';
		this.createdAt = '';
		this.lastLogin = '';
		this.isEmailVerified = false;
		this.isAdmin = false;
		this.authTimeoutId = null;
		passwordsState.passwords = [];
	}
}

const userState = new UserData();

export { userState };
