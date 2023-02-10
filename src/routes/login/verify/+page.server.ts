import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { decrypt } from '$lib/server/crypto';
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_OAUTH_STATE_KEY
} from '$env/static/private';

export const load = (async ({ cookies, url }) => {
	if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET && GITHUB_OAUTH_STATE_KEY) {
		if (await compareState(url.searchParams.get('state'), cookies.get('state'))) {
			const response = await fetch('https://github.com/login/oauth/access_token', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					client_id: GITHUB_CLIENT_ID,
					client_secret: GITHUB_CLIENT_SECRET,
					code: url.searchParams.get('code')
				})
			});
			const { access_token, token_type } = await response.json();
			cookies.set('access_token', access_token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
				maxAge: 60 * 60 * 24 * 30
			});
			cookies.set('token_type', token_type, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
				maxAge: 60 * 60 * 24 * 30
			});
			cookies.delete('state', { path: '/' });
			throw redirect(302, '/');
		}
		console.log('compare failed');
	}
	throw error(500, 'Internal Server Error');
}) satisfies PageServerLoad;

async function compareState(
	state_param: string | null | undefined,
	state_cookie: string | null | undefined
) {
	try {
		if (state_param && state_cookie) {
			const state_decrypted = await decrypt(state_cookie, GITHUB_OAUTH_STATE_KEY);
			if (state_param === state_decrypted) {
				return true;
			}
		}
	} catch (err) {
		console.log(err);
	}
	return false;
}
