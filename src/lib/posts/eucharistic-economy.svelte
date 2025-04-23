<script lang="ts">
	import clsx from 'clsx';
	import BlogImage from 'src/components/BlogImage.svelte';
	import RoundCodeWithParams from 'src/components/RoundCode/RoundCodeWithParams.svelte';
	import ToggleImages from 'src/components/ToggleImages.svelte';
	import { ORIGIN_FOUNDATION } from 'src/shared/constants';
	import { onMount, onDestroy } from 'svelte';

	let hideImages = false;

	const coinId = 'LGI:IAMALPHAANDOMEGA';
	let coinColor = 'white';
	let counter = 0;
	let element: HTMLDivElement;
	let observer: IntersectionObserver;

	function startCoinIncrease() {
		const interval = setInterval(() => {
			counter++;
			if (counter === 7) {
				clearInterval(interval);
			}
		}, 2160);
	}

	onMount(() => {
		const options = {
			root: null, // viewport
			threshold: 0.1 // Trigger when 10% is visible
		};

		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					startCoinIncrease();
					// Stop observing once triggered
					if (element) {
						observer.unobserve(element);
					}
				}
			});
		}, options);

		if (element) {
			observer.observe(element);
		}

		return () => {
			if (observer && element) {
				observer.unobserve(element);
			}
		};
	});

	onDestroy(() => {
		if (observer) {
			// Disconnect observer fully when component is destroyed
			observer.disconnect();
		}
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
	/>
</svelte:head>

<ToggleImages bind:hideImages />

<article class="flex flex-col gap-4 text-xl indent-4">
	<p>
		As I've outlined in the <a class="underline italic" target="_blank" href="/blog/logoi">
			Logoi blog
		</a> post, one of the most important and challenging goals I set out is to encourage people to go
		to church, engage with their communities, participate and express charity.
	</p>

	<p>
		For this year's Lenten project, I helped our parish expand ways to accept donations in an ever
		so cashless world by designing and installing NFC/QR payment stands.
	</p>

	<BlogImage
		hide={hideImages}
		title="Digital donations in our narthex"
		src="https://github.com/user-attachments/assets/76853d67-2ef4-4cfa-b1b5-ff0554bc518c"
	/>

	<p>
		I think it's pretty safe to say that the Orthodox church is among the most resistant to change
		organisations and adopting new technology is challenging here especially, but to me this proved
		that when technology is convenient, not disrsuptive and at the proper place, then the path is
		made clear. And of course this was done with the blessing of our spiritual father and the help
		and involvement of our treasurer.
	</p>

	<p>
		Right now, as a proof of concept I built this on top of <a
			class="underline italic"
			target="_blank"
			href="https://www.zeffy.com/en-CA/referral?referredByOrganizationId=2a09852c-2e51-4614-8726-1acc9ed22afd"
		>
			Zeffy
		</a>, which does all of the heavy lifting and regulatory compliance, as well as covering all
		transaction fees - so I can't recommend it enough. While there are obvious shortcomings on
		customization, and UX improvements I have in mind, it's free and it works. There is already
		interest from other local churches to set up something similar, so Lord willing Logoi will
		develop a custom solution for churches at some near future.
	</p>

	<p>
		We already saw an increase in donations, even given the usual uptick during Easter and our
		lentent fundraisers.
	</p>

	<p>
		If you're interested in setting up something similar, please <a
			class="underline italic"
			target="_blank"
			href="mailto:vlad@logoi.dev?subject=Virtual church donation stands">reach out to me</a
		> and I'll be happy to direct you and help you out.
	</p>

	<h3 class="font-medium text-2xl text-center">Church finances</h3>

	<p>
		During this time, naturally I learned more about church governance, treasury, regulatory
		requirments, donations, reciepts, taxes, and I kept thinking more deeply about it all and ways
		to make it more efficient. It's interesting that the governments encourage charity and don't tax
		churches. And I like paying taxes just as much as the next guy, so my mind went back to the
		Logoi coins.
	</p>

	<p>
		I <a class="underline italic" target="_blank" href="/blog/logoi"> wrote about them here </a>,
		but the gist of the idea is that the coin value increases as you physically approach the
		location that calls to you - ideally a church, and then when you reach it, the value is donated
		to it. And of course you can top it up and hopefully are encouraged to come in and participate.
	</p>

	<div
		bind:this={element}
		class={clsx('mx-auto my-4 font-trajan', {
			'grayscale invert bg-white rounded-full px-2.5 py-2': coinColor === 'black'
		})}
	>
		<RoundCodeWithParams id={coinId} color={coinColor === 'white' ? 'black' : ''} {counter} />
	</div>

	<p>
		Since the coin is a pointer to a database entry, there's no particular requirement or limitation
		for it to hold only one type of currency, it is a multi-wallet, both for digital fiat and
		cryptocurrency. You will say what church will accept crypto donations? But I bet as it gets
		regulated and adopted by more payment processors and banks, churches I'm sure will not care
		about what currency you use, as it will be neatly abstracted away.
	</p>

	<p>
		So now let's say a <a
			target="_blank"
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
		gathers and distributes these donations to non-profits and is issuing tax receipts. As long as there's
		no way for users to withdraw or redeem the value of the coins, it can't be considered a currency
		or commodity as far as I understand. Moreso, we are commited to
		<a
			class="underline italic"
			target="_blank"
			href="https://github.com/logoidev/logoidev/blob/main/LICENSE.md"
			>OpenSource and free non-commercial</a
		>
		use, so the issuing body can be a different non-profit tied to a specific local community under a
		white-label solution.
	</p>

	<p>
		Now consider you are able to donate on someone's behalf. Does it change anything? Not really
		since money still flows one way, and a charity decides how the donations are spent and which
		projects or causes get funded. But now you can keep a sort of "ballance" of donations you made
		and donations made on your behalf. You are not a direct beneficiary, you don't get anything in
		return, but your community does and hopefully the projects it funds are good and trickle down to
		you.
	</p>

	<p>
		What's curious to me is the next step. If you have a highly cohesive local community based on
		trust and full faith that the church is distributing funds fairly, funds meals, schools, then
		there's a big opportunity to forgo direct fiat exchange entirely and for you friend to help you
		out, and for you to donate to the cause he cares about on his behalf.
	</p>

	<p>
		I am well aware that this is starting to sounds like some type of crypto communism, and of
		course the government will not be happy and will find ways to get into the mix, but as it
		currently stands, depending on how trusting you are of your community, it might just work.
	</p>

	<p>
		The Eucharistic Economy may be too loud of a term, but to me it does describe how people
		participate, how value is offered, multiplied, and how the community is fed and recieves back.
	</p>

	<p>
		This is a thought experiment at this stage, as all attempts to create a strong local independent
		and self-sufficient community, based on trust and love have failed historically and all attempts
		to scale them have resulted in disaster.
	</p>

	<p>
		<quote class="font-medium"
			><i>
				"...Then saith he unto them, Render therefore unto Caesar the things which are Caesar's; and
				unto God the things that are God's.."
			</i></quote
		>
		<a class="underline text-base" target="_blank" href="https://www.bible.com/bible/1/MAT.22.21">
			(Matthew 22:21)
		</a>
	</p>

	<BlogImage
		imageClass="w-80"
		src="https://github.com/user-attachments/assets/a40000a1-8224-4d6a-8479-5c58d9d86b4e"
	/>

	<p>
		Maybe there will be a time where Caesars are no more and among the ruins of what was,
		Eucharistic communities will flourish? But then if we truly are one body, why keep track at all?
	</p>
</article>
