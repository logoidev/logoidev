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
		As outlined in the <a class="underline italic" target="_blank" href="/blog/logoi">Logoi blog</a
		>, one of the most important and challenging goals we set was to encourage people to attend
		church, engage with their communities, and participate in acts of charity.
	</p>

	<p>
		For this year's Lenten project, we helped our parish expand the ways to accept donations in an
		increasingly cashless world by designing and installing NFC/QR payment stands.
	</p>

	<BlogImage
		hide={hideImages}
		title="Digital donations in our narthex"
		src="https://github.com/user-attachments/assets/76853d67-2ef4-4cfa-b1b5-ff0554bc518c"
	/>

	<p>
		I think it's safe to say that the Orthodox Church is among the most resistant to change, and
		adopting new technology here is especially challenging. However, this project proved that when
		technology is convenient, non-disruptive, and appropriately placed, the path becomes clear. This
		effort was, of course, undertaken with the blessing of our spiritual father and the help and
		involvement of our treasurer.
	</p>

	<p>
		As a proof of concept, we built the system on top of <a
			class="underline italic"
			target="_blank"
			href="https://www.zeffy.com/en-CA/referral?referredByOrganizationId=2a09852c-2e51-4614-8726-1acc9ed22afd"
			>Zeffy</a
		>, which handles the heavy lifting and regulatory compliance while covering all transaction
		fees—I can’t recommend it enough. While there are some shortcomings in customization and UX
		improvements that I have in mind, it’s free and it works. We've already seen interest from other
		local churches looking to set up something similar. Lord willing, Logoi will develop a custom
		solution for churches in the near future.
	</p>

	<p>
		We’ve already seen an increase in donations, beyond the usual uptick during Easter and our
		Lenten fundraisers.
	</p>

	<p>
		If you’re interested in setting up something similar, please <a
			class="underline italic"
			target="_blank"
			href="mailto:vlad@logoi.dev?subject=Virtual church donation stands">reach out</a
		>—I’ll be happy to direct you and help you get started.
	</p>

	<h3 class="font-medium text-2xl text-center">Church finances</h3>

	<p>
		During this time, I naturally learned more about church governance, treasury practices,
		regulatory requirements, donations, receipts, taxes, and began thinking more deeply about how to
		make the whole process more efficient. It’s interesting that governments encourage charity and
		exempt churches from taxation. And while I like paying taxes as much as the next guy, my mind
		wandered back to the idea of Logoi coins.
	</p>

	<p>
		I <a class="underline italic" target="_blank" href="/blog/logoi">wrote about them</a> before, but
		here’s the core idea: the value of a coin increases as you physically approach the location that
		calls to you—ideally, a church—and once you reach it, the value is donated to it. You can top it
		up, and ideally, be encouraged to enter and participate.
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
		Since the coin merely points to a database entry, there’s no technical limitation for it to
		store only one type of currency. It can be a multi-wallet, holding both digital fiat and
		cryptocurrency. You may ask, "What church would accept crypto donations?" But as regulation and
		mainstream adoption expand through banks and payment processors, the underlying currency may not
		matter—it will be abstracted away.
	</p>

	<p>
		So now let's say a gathers and distributes these donations to non-profits and is issuing tax
		receipts. As long as there's no way for users to withdraw or redeem the value of the coins, it
		can't be considered a currency or commodity as far as I understand. Moreso, we are committed to
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
		Now imagine there's a local non-profit organisation, such as <a
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
		</a> that gathers and distributes these donations to nonprofits or other church communities, issues
		tax receipts and funds projects to fulfill the needs of a community. As long as users cannot withdraw
		or redeem the coins for personal use, it shouldn’t be considered a currency or commodity, to the
		best of my understanding. Furthermore, we are committed to open source and free non-commercial use.
		The issuing body could be a different nonprofit, tied to a specific local community or, ideally,
		a church, using a white-label solution. Do take this with a grain of salt: I am not a financial,
		crypto, or nonprofit tax expert. At this point, we’re just positing ideas.
	</p>

	<p>
		Now consider this: what if you're able to donate on someone else's behalf? Does it change
		anything? Not really—money still flows one way, and a charity still decides how the donations
		are spent and which projects or causes get funded. But now you can start to see a sort of
		"balance" — of what you’ve given, and what’s been given in your name. You're not a direct
		beneficiary—you don't receive anything in return, but your community does. And ideally, the
		projects being funded trickle down to benefit you as well.
	</p>

	<p>
		What’s particularly curious is what comes next. If you have a highly cohesive local
		community—one built on trust and full faith that the Church is distributing funds fairly, with
		transparency and oversight: funding meals, schools, and services—then there's a significant
		opportunity to forgo direct fiat exchange entirely. Perhaps your friend helps you out in a time
		of need, and you in turn donate to a cause he cares about, on his behalf.
	</p>

	<p>
		I’m well aware that this starts to sound like a form of crypto-communism—and of course, the
		government may eventually take an interest and find ways to intervene. But as it currently
		stands, depending on how much trust you place in your community, it just might work.
	</p>

	<p>
		"The Eucharistic Economy" may be too bold a term, but to me it describes how people participate,
		how value is offered and multiplied, and how the community is fed—and, in turn, receives back.
	</p>

	<p>
		At this stage, it remains a thought experiment. Historically, all attempts to create strong,
		local, independent, self-sufficient communities based on trust and love have failed—or worse,
		been crushed. And all attempts to scale such ideals have led to disaster.
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
		imageClass="w-52"
		src="https://github.com/user-attachments/assets/a40000a1-8224-4d6a-8479-5c58d9d86b4e"
	/>

	<p>
		Maybe a time will come when Caesars are no more. And among the ruins of what was, Eucharistic
		communities might flourish. But if we truly are one body in Christ—why keep track at all?
		Shouldn't the left hand not know what the other is doing?
	</p>

	<p>
		This Lent and this project made me think: what does it mean to give? And what does it mean to
		belong and receive back? Does technology help here or does it create another barrier and
		increases the distance. Somewhere between an old and rusty quarter, a QR code and a crypto
		wallet, between a tap at the door and the tap of the phone, between walking past an offering of
		bread and wine, there’s a thread—a line that runs through the very heart of Church life. It’s
		not about transactions. It’s about participation.
	</p>

	<p>
		Whether or not these ideas go anywhere, or get built, or even make sense outside this page—I’m
		still convinced the real economy is Eucharistic. And every time someone walks into church,
		gives, receives, and stays for coffee hour, something of that economy fulfills its purpose and
		becomes lived. It echoes the liturgy, where value isn’t stored but offered, multiplied, shared,
		and received.
	</p>

	<p>
		Because in the end, all logoi—every intention, purpose, gift, and act of love—are gathered into
		the one Logos. And in Him, every act of giving becomes more than charity; it becomes communion,
		not merely economy.
	</p>

	<div class="text-center">
		<a href="/v" title="Vlad Kolbaia" class="text-2xl font-serif">V</a>
	</div>
</article>
