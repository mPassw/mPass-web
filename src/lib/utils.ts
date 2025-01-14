import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getIcon = (url: string): string => {
	try {
		const urlToCheck = url.match(/^https?:\/\//) ? url : `https://${url}`;

		const parsedUrl = new URL(urlToCheck);

		// `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
		// `https://logo.clearbit.com/${domain}`;
		// `https://icon.horse/icon/${domain}`;
		return `https://api.faviconkit.com/${parsedUrl.hostname}/144`;
	} catch {
		return '';
	}
};
