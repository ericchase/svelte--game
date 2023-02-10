import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { decrypt } from '$lib/server/crypto';

export const POST = (async ({ request }) => {
	try {
		return json(
			await decrypt(
				await request.json(),
				'0V8lj1zl6N5lUACZc3g40515o52x046k5mREwxR1xf57IBN2Fd7X0ulbh75kt94o'
			)
		);
	} catch (err) {
		console.log(err);
		return json('');
	}
}) satisfies RequestHandler;
