import { redirect } from '@sveltejs/kit';

import { getPostById, getBlogPostComponent, type PostId } from '$lib/posts';

export async function load({ params: { post: postId } }) {
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
