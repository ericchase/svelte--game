import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { encrypt, randomUUID } from '$lib/server/crypto';
import { GITHUB_CLIENT_ID, GITHUB_OAUTH_STATE_KEY } from '$env/static/private';

export const load = (async ({ cookies }) => {
	if (GITHUB_CLIENT_ID && GITHUB_OAUTH_STATE_KEY) {
		const state = randomUUID();
		const githubOAuthUrl = new URL('https://github.com/login/oauth/authorize');
		githubOAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID ?? '');
		githubOAuthUrl.searchParams.set('redirect_uri', 'http://localhost:5173/');
		githubOAuthUrl.searchParams.set('state', state);
		cookies.set('state', await encrypt(state, GITHUB_OAUTH_STATE_KEY), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
			maxAge: 60 * 5
		});
		throw redirect(302, githubOAuthUrl.toString());
	}
	throw error(500, 'Internal Server Error');
}) satisfies PageServerLoad;
