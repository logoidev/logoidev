<script lang="ts">
	import clsx from 'clsx';
	import BlogImage from 'src/components/BlogImage.svelte';
	import ToggleImages from 'src/components/ToggleImages.svelte';
	import { trackEvent } from '../analytics/posthog';

	let hideImages = false;
	let password = 'Michael';
	let isError = false;
	let attempt = 0;
	let unlocked = false;
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
	/>
</svelte:head>

<ToggleImages bind:hideImages />

<article class="flex flex-col gap-4 text-xl indent-4">
	{#if !unlocked}
		<blockquote class="italic mx-auto mt-4">"The prince who holds The Flame of Death"</blockquote>
		<form
			class="mx-auto flex gap-2"
			on:submit={(e) => {
				e.preventDefault();
				// @ts-expect-error - form input
				const input = e.target.elements['password'];
				attempt++;
				trackEvent('unlock_attempted', { password: input.value, attempt });
				if (input.value.toLowerCase() === password.toLowerCase()) {
					isError = false;
					unlocked = true;
				} else {
					isError = true;
				}
			}}
		>
			<input
				class={clsx('border border-gray-600 rounded px-4 py-2', {
					'border-red-500': isError
				})}
				name="password"
			/>
			<button type="submit" class="px-4 py-2 border border-1 border-gray-600 rounded">
				let me in
			</button>
		</form>
	{/if}

	{#if unlocked}
		<p class="mx-auto">Hello Mr. Peterson.</p>
		<p>
			My name is Vlad and I'm extremely happy to have met you, both online and, hopefully, in
			person.
		</p>

		<p>
			I started listening to you in 2017 and, like to many other people, you played the part of the
			wise Father, and I'm extremely grateful for the generosity of your time and to God for giving
			me the wisdom to listen to your advice.
		</p>

		<p>
			In 2018 I got married, in 2020 my son Michael (Михаїл) was born and in 2022 we fled war in
			Ukraine and found a new home in Kitchener, Ontario.
		</p>

		<p>
			Your lectures, especially the Maps of Meaning, made me reconsider the value of stories and
			notice the wisdom of the narrative. Then my religious journey continued - The Biblical Series,
			the Exhodus, and, I'm sure, everything else have in mind.
		</p>

		<p>
			Yet, looking back, I think your conversation with Jonathan to be an event I can describe only
			as baptism by the Holy Spirit. I felt like you've imparted me with a glimpse of knowledge of
			something long forgotten - a different type of language.
		</p>

		<p>
			I'm a software engineer and speek multiple human languages, but this was different - symbolic
			language was deeper than anything I knew. It was overwhelming, so much so I felt inspired (and
			desparate) to write this message to Jonathan on Oct 16, 2019.
		</p>

		<BlogImage
			hide={hideImages}
			title="The Metaphysics of Pepe"
			link="https://www.youtube.com/watch?v=Ixc9i1G7eew"
			src="https://github.com/logoidev/logoidev/assets/11582927/9feeecd3-8c5b-4f97-bff3-fce49bc57a1e"
		/>

		<p>
			The same type of overwhelming feeling I have now when I read the Bible as, ultimately, I
			believe that it is written in that Symbolic language.
		</p>

		<p>
			That video, like many others, both from you and Jonathan has slowly led me back the Orthodox
			church and I can't thank you enough. You two made me doubt the rationalistic worldview and
			turn towards Truth. It literally saved my life and delivered us from the remote small village
			in the east of Ukraine to now being able to stand in front of you.
		</p>

		<p>
			Now I'm on a quest to use my skills and blessings to help people and for the glory of God.
			I've established a company to help develop solutions for churches and non-profits and trying
			to build a <a class="underline inline-block" href="https://logoi.foundation" target="_blank"
				><img
					class="h-6 inline-flex relative -top-0.5 -left-2"
					alt="Logoi Foundation Logo"
					src="/images/logoi-foundation.svg"
				/><span>Logoi Foundation</span></a
			> - a non-profit aimed at building a digital church and bringing technology inside the walls of
			the physical ones.
		</p>

		<p>
			I had an unbelievable journey and I there's not a singular person I can thank for my family
			and I being here, so I attribute it to God and to the protection of St. Michael. May he
			protect your family as well and I think he truly does.
		</p>

		<p>
			If there's anything I can help you with, any project that requires digital design and
			architecture - I'd be happy to, free of charge. I want to use technology for good and I
			believe you truly are a good man.
		</p>

		<p>
			Another topic I feel you are wrestling with is AI. My question on the first day of the
			conference was aimed at that as because it's the only thing I know how to do it is deeply
			important to me to understand how to move forward in my creative art - software engineering.
			In all honesty I was not satisfied with Jonathans answer and would love to know your opinion
			on this. What you're doing with teaching it the scripture and than layering it with works of
			our culture like Dante and Milton I think is one of the correct directions that will have to
			happen in order for AI to become angelic and be our protection.
		</p>

		<p>
			I want to make sure I do this responsibly and would love to know your views and advice. Your
			time and attention is extremely valuable but if you are able, there's a 17 minute video I made
			to explain who I am, why I'm doing this and what are <a class="underscore" href="/blog/logoi"
				>Logoi.</a
			>
		</p>

		<br />

		<div style="position:relative; width:100%; height:0px; padding-bottom:56.250%">
			<iframe
				title="Logoi"
				allow="fullscreen"
				allowfullscreen
				height="100%"
				src="https://streamable.com/ne/lbwkoo?loop=0&autoplay=0"
				width="100%"
				style="border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;"
			></iframe>
		</div>

		<br />
		<p>
			I completely understand you have many things to pay attention to - I wish you luck in your
			tour and pray you inspire millions of people just like you did for me. If my message resonated
			with you or if you have questions about technology, AI, VR, Ukraine and Russia, I'd be happy
			to give you a personal perspective. My email is <a
				class="underline"
				href="mailto:vlad@logoi.dev?subject=JBP"
			>
				vlad@logoi.dev</a
			>
			and I'm also on <a class="underline" href="https://twitter.com/v1adko_" target="_blank">X.</a>
		</p>

		<p>Thank you for the spirit of courage and generosity you are sharing with so many people,</p>
	{/if}

	<br />
	<div class="text-center">
		<p>Best of Fortune</p>

		<a href="/v" title="Vlad Kolbaia" class="text-2xl font-serif">V</a>
	</div>
</article>
