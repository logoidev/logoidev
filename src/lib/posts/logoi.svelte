<script lang="ts">
	import clsx from 'clsx';
	import BlogImage from 'src/components/BlogImage.svelte';
	import BookMeeting from 'src/components/BookMeeting.svelte';
	import ToggleImages from 'src/components/ToggleImages.svelte';
	import RoundCodeWithParams from 'src/components/RoundCode/RoundCodeWithParams.svelte';
	import MapLink from 'src/components/MapLink.svelte';
	import Payment from 'src/components/Payment/Payment.svelte';
	import { ORIGIN_FOUNDATION } from 'src/shared/constants';

	const search = Object.fromEntries([window.location.search?.substring(1).split('=')]);

	let hideImages = false;

	let color: 'white' | 'black' = search.color ?? 'white';

	const coinId = 'LGI:IAMALPHAANDOMEGA';

	let donateShown = false;
	let counter = 0;
	const interval = setInterval(() => {
		counter++;
		if (counter === 7) {
			clearInterval(interval);
		}
	}, 2160);

	$: destination =
		color === 'white'
			? { latitude: 42.36699181786727, longitude: -71.10507899108563 }
			: { latitude: 42.33827509745518, longitude: -71.09901474603274 };
	$: destinationUrl = `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`;
	$: donationReceiptUrl =
		color === 'white'
			? 'https://drive.google.com/file/d/1_sTInCI_FiX-NSWHpX9z_M8EzvobGxzr/view'
			: 'https://drive.google.com/file/d/1RFhwsNdBBlnLgaU145djzR_i3A5lwi4J/edit';

	const toggleColor = () => {
		color = color === 'white' ? 'black' : 'white';

		const searchParams = new URLSearchParams(window.location.search);
		if (color === 'black') {
			searchParams.append('color', 'black');
		} else {
			searchParams.delete('color');
		}
		const search = searchParams.toString();
		const url = `${window.location.origin}${window.location.pathname}${search ? `?${search}` : ''}`;
		window.history.pushState({ path: url }, '', url);
	};
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
	/>
</svelte:head>

<ToggleImages bind:hideImages />

<button
	title="Change coin color"
	class={clsx('scale-125 opacity-50 hover:opacity-95', {
		'fixed bottom-3 right-24': true
	})}
	on:click={toggleColor}
>
	🌗
</button>

<article class="flex flex-col gap-4 text-xl indent-4">
	<p>
		One of the most important and challenging goals we set out for Logoi is to encourage people to
		go to church, engage with their communities and express charity.
	</p>

	<p>
		If you think about how the most amazing buildings have been built or how the most impactful
		organisations were established, most likely it was done through charity, patronage, or something
		we now call "crowdfunding".
	</p>
	<p>
		Many were also funded in full or in part by the cities and governments, which could still be
		considered charitable by proxy as it's done for the benefit of the public. All of these are
		expressions of charity and making it easy to give is among the most foundational goals of Logoi.
	</p>

	{#if color === 'white'}
		<BlogImage
			hide={hideImages}
			title="Gergeti Trinity Church, 14th century"
			link="https://en.wikipedia.org/wiki/Gergeti_Trinity_Church"
			src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Gergeti_Trinity_Church_09.23.jpg/2560px-Gergeti_Trinity_Church_09.23.jpg"
		/>
		<p>
			Our ancestors built cathedrals in the most remote places without as many tools, money or
			education. The Trinity Church, built in 14th century in Georgia is one of the showcases what
			regular people are capable of when they are united in their goals and in their charity. The
			architect of this building is unknown and the construction itself was likely funded and built
			by the local population.
		</p>

		<BlogImage
			hide={hideImages}
			title="Sagrada Familia, 1882 - Unfinished"
			link="https://en.wikipedia.org/wiki/Sagrada_Fam%C3%ADlia"
			src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sagrada_Familia_%28July_2022%29_08.jpg/2560px-Sagrada_Familia_%28July_2022%29_08.jpg"
		/>
		<p>
			Sagrada Familia is another example of a project spanning centuries, Gaudí's vision still not
			fully realised. Yet, the project survived countless political regimes, wars and many
			generations of builders, patrons and visitors.
		</p>
	{:else}
		<BlogImage
			hide={hideImages}
			title="The Metropolitan Museum of Art, 1870"
			link="https://en.wikipedia.org/wiki/Metropolitan_Museum_of_Art"
			src="https://upload.wikimedia.org/wikipedia/commons/3/30/Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg"
		/>

		<p class="text-center">
			<i>NOTE</i>: You can <span>{hideImages ? 'show' : 'hide'}</span> all images:
			<ToggleImages position="relative" bind:hideImages />
		</p>

		<BlogImage
			hide={hideImages}
			title="Killian Court, MIT, 1913"
			link="https://en.wikipedia.org/wiki/Killian_Court"
			src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/MIT_Building_10_and_the_Great_Dome%2C_Cambridge_MA.jpg/2560px-MIT_Building_10_and_the_Great_Dome%2C_Cambridge_MA.jpg"
		/>
		<BlogImage
			hide={hideImages}
			title="Memorial Hall, Harvard, 1877"
			link="https://en.wikipedia.org/wiki/Harvard_University"
			src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Sanders_theater_2009y.JPG/2560px-Sanders_theater_2009y.JPG"
		/>

		<p>
			All of these organisation, from the top universities to the most fantastic museums holding
			priceless works of art, are in large part non-profits relying on the charity of patrons that
			value the principles upon which these organisations were established. These values span
			centuries and unite people across times and cultures, and the only way to ensure that they are
			preserved and hopefully even developed is through giving and participation.
		</p>
	{/if}

	<p>
		If these were possible to create then it's most certainly possible now. But it's also important
		to explain to people what their donations are aimed at and how they are used. And the best way
		to do it is to show them. So another important and challenging task is to encourage people to go
		to places such as churches, museums, foundations and other non-profit organisations to witness
		what they stand for and what purposes bind them.
	</p>

	<p>This is what the Logoi Coin is designed to accomplish.</p>

	<div class="mx-auto">
		<BookMeeting text="Claim your coin 🪙" href="/c" target={undefined} />
	</div>

	<p>
		Completely unique in design and essense the coin is meant to be taken to a specific location.
	</p>
	<p>
		The coin is indifferent to who will get it there, so the system is completely <b>anonymous.</b>
	</p>

	<div
		class={clsx('mx-auto my-4', {
			'grayscale invert bg-white rounded-full px-2.5 py-2': color === 'black'
		})}
	>
		<RoundCodeWithParams id={coinId} />
	</div>

	<p>
		There is a <button
			disabled={color === 'white'}
			class={color === 'black' ? 'underline' : ''}
			on:click={() => (color = 'white')}>white</button
		>
		and a
		<button
			disabled={color === 'black'}
			class={color === 'white' ? 'underline' : ''}
			on:click={() => (color = 'black')}>black</button
		> coin
	</p>

	<p>The coin holds a number of locations, and along the path the value of the coin increases.</p>
	<p>
		The white coin is dynamically programmed to pick a random location among a set of predefined
		ones introducing an element of surprise and is <b>free</b>
	</p>
	<p>
		While the black one has a location pre-set and costs <b>$1</b>
	</p>

	<p class="text-center">
		<i>NOTE</i>: Click
		<button class="text-2xl" on:click={toggleColor}> 🌗 </button> to change coin color
	</p>

	<div class="bg-white flex flex-col items-center text-center mt-4 text-base">
		<p>You need to get to</p>
		<button class="text-xl"
			>{color === 'white' ? 'St. Mary Orthodox Church' : 'Isabella Stewart Gardner Museum'}</button
		>

		<p>Click the icon below and return<br /> to this page once you're there</p>

		<p class="text-sm">~ {color === 'white' ? 620 : 2160}m away</p>

		<button class="mt-6" on:click={() => window.open(destinationUrl, 'blank')}>Navigate </button>
		<MapLink title="Destination" url={destinationUrl}>Get there</MapLink>
	</div>

	<p>As the coin gets closer to the location the value increases</p>

	<div
		class={clsx('mx-auto my-4 font-trajan', {
			'grayscale invert bg-white rounded-full px-2.5 py-2': color === 'black'
		})}
	>
		<RoundCodeWithParams id={coinId} color={color === 'white' ? 'black' : ''} {counter} />
	</div>

	<p>
		Users also have the ability to share the coin with friends and donate <b>$1</b> to increase it's
		value and <u>impact</u>
	</p>

	{#if donateShown}
		<Payment give {coinId} on:success={() => counter++} />
	{:else}
		<div class="flex justify-center">
			<button class="border px-2 py-1 rounded" on:click={() => (donateShown = true)}>
				Give $1
			</button>
		</div>
	{/if}
	<p>
		And when it reaches the destination the value of the coin is tied in and donated to the
		location, while the coin becomes {color === 'white' ? 'golden ⭐' : 'silver 🪙'}
	</p>

	<div
		class={clsx('mx-auto my-4 font-trajan redeemed', {
			'grayscale invert !bg-[#700000] text-white rounded-full px-2.5 py-2': color === 'black'
		})}
	>
		<RoundCodeWithParams
			id={coinId}
			color={color === 'white' ? 'gold' : 'white'}
			counter={counter + 1}
		/>
	</div>

	<p>And finally the value of the coin is donated to the destination:</p>

	{#if color === 'white'}
		<BlogImage
			hide={hideImages}
			title="Donation to St. Mary Orthodox Church"
			link="https://www.stmaryorthodoxchurch.org/contact/donate-now"
			src="https://github.com/logoidev/logoidev/assets/11582927/f1aa4647-a121-4002-82b4-f17703041292"
		/>
	{:else}
		<BlogImage
			hide={hideImages}
			title="Donation to Isabella Stewart Gardner Museum"
			link="https://tnew.gardnermuseum.org/donate/q/annual-fund"
			src="https://github.com/logoidev/logoidev/assets/11582927/281898fe-644c-40e2-8d37-dbb5e875e06c"
		/>
	{/if}

	<p>
		<a
			class="inline-flex flex-row relative top-0.5"
			href={`${ORIGIN_FOUNDATION}?src_external=logoi-blog`}
		>
			<img
				class="h-8 relative top-1 left-1"
				alt="Logoi Foundation Logo"
				src="/images/logoi-foundation.svg"
			/>
			<span class={`text-sm text-center mt-4 font-trajan`}>Logoi Foundation</span>
		</a>
		is working hard on <b>automating</b> this process and helping more organisations collect donations
		in a simpler way while encouraging engagement and participation.
	</p>

	<div class="flex items-center justify-center mb-4">
		<div class="mt-4 border border-[gold] rounded px-4 py-2 text-center font-serif">
			<p class="text-base">
				The value of the coin has been donated to the {color === 'white' ? 'church' : 'location'}
			</p>
			<a class="underline text-blue-500 text-sm" target="_blank" href={donationReceiptUrl}>
				View donation receipt
			</a>
		</div>
	</div>

	<p>Here's video demo of an MVP:</p>

	<div
		class="aspect-[9/16] w-[20rem] mx-auto"
		style="position:relative; height:0px; padding-bottom:56.250%"
	>
		<iframe
			title="Logoi"
			allow="fullscreen"
			allowfullscreen
			height="100%"
			src="https://streamable.com/ne/wd76z9?loop=0&autoplay=0&bg=white"
			width="100%"
			style="border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;"
		></iframe>
	</div>

	<p>
		If you like this <a class="underline" href="/blog/vision" target="_blank">vision</a> and think
		that your {color == 'white' ? 'church' : 'organisation'} or any other non-profit would be interested,
		<b>please share</b> this page with them.
	</p>

	<blockquote class="italic mx-auto mt-4">“Give, and it will be given to you...”</blockquote>

	<br />
	<div class="text-center">
		<p>Best of Fortune</p>

		<a href="/v" title="Vlad Kolbaia" class="text-2xl font-serif">V</a>
	</div>
</article>

<style>
	.redeemed.grayscale.invert :global(.coin-counter) {
		fill: white !important;
	}
</style>
