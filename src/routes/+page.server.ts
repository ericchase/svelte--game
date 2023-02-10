import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { GITHUB_CLIENT_ID } from '$env/static/private';

export const load = (async ({ cookies, url }) => {
	if (url.searchParams.has('code')) {
		throw redirect(302, '/login/verify' + url.search);
	}
	if (!cookies.get('access_token') || !cookies.get('token_type')) {
		throw redirect(302, '/login');
	}
	const user_response = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`
		}
	});
	const user_data = await user_response.json();
	if (user_data.message === 'Bad credentials') {
		throw redirect(302, '/login');
	}
	const { login, avatar_url } = user_data;
	return { GITHUB_CLIENT_ID, user: { login, avatar_url } };
}) satisfies PageServerLoad;
