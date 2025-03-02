export const posts = [
	{
		id: 'vision',
		title: 'Logoi and our Vision',
		published: '2023-11-01T14:44:44.444Z',
		minutesToRead: 8,
		gh_discussion_id: 19
	},
	{
		id: 'arc',
		title: 'Six important questions before building an ARC',
		published: '2023-11-06T19:11:11.00Z',
		minutesToRead: 6,
		gh_discussion_id: 25
	},
	{
		id: 'yazan',
		title: 'Enacting Yazan',
		published: '2023-11-18T15:00:00.00Z',
		minutesToRead: 7,
		gh_discussion_id: 32
	},
	{
		id: 'logoi',
		title: 'Logoi - the guiding locus of Value',
		published: '2024-02-11T18:00:00.00Z',
		minutesToRead: 3,
		gh_discussion_id: 35
	},
	{
		id: 'jbp',
		title: 'JBP',
		published: '2024-03-01T04:00:00.00Z',
		minutesToRead: 3,
		gh_discussion_id: 0,
		hidden: true
	},
	{
		id: 'jbp-coin',
		title: 'The Coin',
		published: '2025-03-01T12:00:00.00Z',
		minutesToRead: 62,
		gh_discussion_id: 0,
		hidden: true
	},
	{
		id: 'jp',
		title: 'JP',
		published: '2024-03-02T16:00:00.00Z',
		minutesToRead: 4,
		gh_discussion_id: 0,
		hidden: true
	}
] as const;

export type PostId = (typeof posts)[number]['id'];
type PostWithoutId = {
	title: string;
	published: string;
	minutesToRead: number;
	gh_discussion_id: number;
	Content: ConstructorOfATypedSvelteComponent;
};
export type Post = PostWithoutId & { id: PostId };

export const getPostById = (id: PostId) => posts.find((p) => p.id === id) as unknown as Post;

export const getBlogPostComponent = (id: PostId) => {
	switch (id) {
		case 'vision':
			return import('$lib/posts/vision.svelte');
		case 'arc':
			return import('$lib/posts/arc.svelte');
		case 'yazan':
			return import('$lib/posts/yazan.svelte');
		case 'logoi':
			return import('$lib/posts/logoi.svelte');
		case 'jbp':
			return import('$lib/posts/jbp.svelte');
		case 'jbp-coin':
			return import('$lib/posts/jbp-coin.svelte');
		case 'jp':
			return import('$lib/posts/jp.svelte');
	}
};
