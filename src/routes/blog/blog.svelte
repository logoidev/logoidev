<script>
	import { getRoute } from 'src/utils/routing';
	import { onMount } from 'svelte';
	import Main from '../main.svelte';
	import Image from 'src/components/Image.svelte';

	import Socials from 'src/components/Socials/Socials.svelte';
	import { SOCIALS } from 'src/data/socials';

	import Copyright from 'src/components/Copyright.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import { getIndexUrl } from 'src/shared/routes';
	import { posts } from './posts';

	import Post from './post.svelte';
	import ReadEstimate from 'src/components/ReadEstimate.svelte';
	import { trackAnalyticsEvent } from 'src/components/AnalyticsScripts.svelte';

	let route = 'blog';
	let rounded = true;
	let postId = '';
	$: post = posts.find((p) => p.id === postId);

	const updateRoute = () => ([route, postId] = getRoute({ nested: true }));

	onMount(() => {
		updateRoute();
		window.addEventListener('hashchange', updateRoute);
	});
</script>

<svelte:head>
	<title>Logoi Development - Blog</title>
</svelte:head>

{#if route === 'blog'}
	<div class="flex flex-col justify-between min-h-screen">
		<div class="flex justify-center items-center">
			<a href={post ? '#blog' : '#'} class="flex flex-col items-center">
				<span class="text-2xl text-center font-serif mt-4">Design & Development</span>
				<Image class="w-44" src="./images/blog.svg" />
			</a>
		</div>

		<div class="p-8">
			{#if !post}
				<ul class="flex flex-col gap-2 text-center">
					{#each posts as post}
						<li class="text-2xl font-serif relative">
							<a
								href={`#blog/${post.id}`}
								on:click={() => trackAnalyticsEvent('blog:post-navigation', { post_id: post.id })}
							>
								<span>{post.title}</span>
								<ReadEstimate estimate={post.estimate} /></a
							>
						</li>
					{/each}
				</ul>
			{:else}
				<Post id="vision" />
			{/if}
		</div>

		<div class="flex flex-col justify-center items-center font-serif">
			<Socials withToggle socials={SOCIALS} />

			<ToggleQr
				animated
				{rounded}
				url={getIndexUrl(post ? `blog/${post.id}` : 'blog')}
				imageSrc="/images/qr.svg"
				onCenterClick={() => (rounded = !rounded)}
			/>

			<Copyright />
		</div>
	</div>
{:else}
	<Main />
{/if}
