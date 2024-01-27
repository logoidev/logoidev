import { redirect } from '@sveltejs/kit';
import { posts } from '../posts.js';

export async function load({ params: { post: postId = '' } }) {
	const post = posts.find(({ id }) => id === postId);

	if (!post) {
		redirect(302, '/');
	}

	const res = await import(`$lib/posts/${post.id}.svelte`);
	console.log('Res', res);

	try {
		// const imported = await import(/* @vite-ignore */ `$lib/posts/${post.id}.svelte`);
		// post.Content = imported.defaut;
	} catch (e) {
		console.log('Could not load post', e);
	}

	return post;
}
