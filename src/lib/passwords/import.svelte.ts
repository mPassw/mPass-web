/* eslint-disable @typescript-eslint/no-explicit-any */

import { passwordsState, type PasswordBase } from '@/state/passwordsState.svelte';
import { getPasswords } from './getPasswords.svelte';
import { userState } from '@/state/userState.svelte';
import { goto } from '$app/navigation';

// data we dont use is typed as any
export type Bitwarden = {
	encrypted: boolean;
	folders: any;
	items: BitwardenItem[];
};

export type BitwardenItem = {
	passwordHistory: any;
	revisionDate?: string;
	creationDate: string;
	deletedDate?: string;
	id: string;
	organizationId: any;
	folderId?: string;
	type: number;
	reprompt?: number;
	name: string;
	notes?: string;
	favourite: boolean;
	fields: any;
	login: BitwardenLogin;
	collectionIds: any;
};

type BitwardenLogin = {
	fido2Credentials: any;
	uris: BitwardenLoginUri[];
	username?: string;
	password?: string;
	totp?: string;
};

export type BitwardenLoginUri = {
	match: any;
	uri: string;
};

export const bulkAddPasswords = async (passwords: PasswordBase[]) => {
	const res = await fetch(`${userState.serverUrl}/passwords/bulk-add`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userState.authToken}`
		},
		body: JSON.stringify({
			passwords
		})
	});

	if (!res.ok) {
		if (res.status === 498) {
			userState.reset();
			await goto('/auth');
		}

		throw new Error('Failed to import passwords');
	}

	passwordsState.passwords = [];

	await getPasswords();
};
