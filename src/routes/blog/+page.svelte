<script lang="ts">
	import Image from 'src/components/Image.svelte';

	import Socials from 'src/components/Socials/Socials.svelte';
	import { SOCIALS } from 'src/data/socials';

	import Copyright from 'src/components/Copyright.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import { getIndexUrl } from 'src/shared/routes';
	import { posts } from '$lib/posts';

	import ReadEstimate from 'src/components/ReadEstimate.svelte';
	import { trackAnalyticsEvent } from 'src/components/AnalyticsScripts.svelte';
	import BlogMeta from 'src/components/BlogMeta.svelte';

	let rounded = true;
</script>

<BlogMeta />

<div class="flex flex-col justify-between min-h-screen">
	<div class="flex justify-center items-center">
		<a href="/" class="flex flex-col items-center">
			<span class="text-2xl text-center font-serif mt-4">Design & Development</span>
			<Image class="w-44" src="./images/blog.svg" />
		</a>
	</div>

	<div class="p-8">
		<ul class="flex flex-col gap-2 text-center">
			{#each posts as post, idx}
				<li class="group text-2xl font-serif relative">
					<a
						href={`/blog/${post.id}`}
						on:click={() => trackAnalyticsEvent('blog:post-navigation', { post_id: post.id })}
					>
						<span
							class="text-base opacity-50 group-hover:opacity-95"
							title={`Published on ${new Date(post.published).toLocaleDateString()}`}
							>#{idx + 1}</span
						>
						<span>{post.title}</span>
						<ReadEstimate estimate={post.minutesToRead} />
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="flex flex-col justify-center items-center font-serif">
		<Socials withToggle socials={SOCIALS} />

		<ToggleQr
			animated
			{rounded}
			url={getIndexUrl('blog')}
			imageSrc="/images/qr.svg"
			onCenterClick={() => (rounded = !rounded)}
		/>

		<Copyright />
	</div>
</div>
