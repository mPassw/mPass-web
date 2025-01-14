import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getIcon = (url: string): string => {
	try {
		const urlToCheck = url.match(/^https?:\/\//) ? url : `https://${url}`;

		const parsedUrl = new URL(urlToCheck);

		return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;
		// return `https://logo.clearbit.com/${parsedUrl.hostname}`;
		// return `https://icon.horse/icon/${parsedUrl.hostname}`;
		// return `https://api.faviconkit.com/${parsedUrl.hostname}/144`;
		// return `https://icons.duckduckgo.com/ip3/${parsedUrl.hostname}.ico`;
	} catch {
		return '';
	}
};
