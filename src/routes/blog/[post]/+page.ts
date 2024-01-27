import { json, redirect } from '@sveltejs/kit';

import { getPostById, getBlogPostComponent, type PostId } from '$lib/posts';
import { MANIFEST } from 'src/shared/constants.js';

export async function load({ params: { post: postId } }) {
	if (postId === MANIFEST) {
		return null;
	}

	const post = getPostById(postId as PostId);
	if (!post) {
		redirect(302, '/');
	}

	try {
		const res = await getBlogPostComponent(post.id);
		post.Content = res.default;
	} catch (e) {
		console.log('Could not load post', e);
	}

	return post;
}
