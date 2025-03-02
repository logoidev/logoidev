<script lang="ts">
	import clsx from 'clsx';
	import BlogImage from 'src/components/BlogImage.svelte';
	import ToggleImages from 'src/components/ToggleImages.svelte';
	import { trackEvent } from '../analytics/posthog';
	import { ADAM, VLAD } from 'src/data/users';
	import NameAvatar from 'src/components/NameAvatar.svelte';
	import Chat from 'src/components/Chat/Chat.svelte';
	import { name, messages } from './chats/jbp-coin.chat';
	import ReadEstimate from 'src/components/ReadEstimate.svelte';

	let hideImages = false;
	let password = 'Vlad';
	let isError = false;
	let attempt = 0;
	let unlocked = true;

	let isChatShown = false;
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
	/>
</svelte:head>

<article class="flex flex-col gap-4 text-xl indent-4">
	{#if !unlocked}
		<blockquote class="italic mx-auto mt-4">Locked</blockquote>
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
		<p class="mx-auto text-2xl">Hello Dr. Peterson.</p>

		{#if !hideImages}
			<div class="flex justify-center">
				<NameAvatar userData={VLAD} startingMemojiIndex={3} noLastName noFirstName />
			</div>
		{/if}

		<p>
			My name is <a href="/v" target="_blank">Vlad</a> and I'm extremely happy to have met you in person.
			I hope you have at least heard my name before either from Victor, Jordan or Mikhaila.
		</p>

		<p>
			I started listening to you in 2017 and, like to many other people, you played the part of the
			wise father, and I'm extremely grateful for the generosity of your time and to God for giving
			me the wisdom to listen to your advice - your words definitely influenced my worldview and
			decision to start a family. Would have never thought a Pinocchio story revisited can lead
			here.
		</p>

		<p
			class="flex justify-center items-center gap-2 border-0 border-l-4 border-blue-500 max-w-lg mx-auto leading-8"
		>
			<span class="italic text-base">
				You can <span>{hideImages ? 'show' : 'hide'}</span> all images if you prefer:
			</span>
			<ToggleImages position="relative" bind:hideImages />
		</p>

		<BlogImage
			hide={hideImages}
			title={`The earliest "liked" video of yours I have in my YouTube history.`}
			description="Interesting how your gesture here resembles both Leonardo's St. John the Baptist and Bloch's Sermon on the Mount."
			link="https://www.youtube.com/watch?v=cSFSlZwneO4"
			src="https://github.com/user-attachments/assets/25313944-9879-4863-b20f-9122f567b1d1"
		/>

		<p>
			Just a tiny bit about myself, just because there are certain narrative tropes of life I think
			we either share or you'd find interesting.
		</p>

		<p>
			I was born in a small and decaying soviet factory town in the east of Ukraine to a family of a
			{hideImages ? '' : '🇬🇪'} Georgian builder and a {hideImages ? '' : '🇷🇺'} Russian-Ukrainian {hideImages
				? ''
				: '🇺🇦'} librarian. I also briefly studied in Minnesota {hideImages ? '' : '🇺🇸'} and lived with
			a host family while in my senior year in high-school. Upon returning to Ukraine I enrolled and
			eventually got Master's in Computer Science in Kharkiv, while working. In 2018 I got married to
			Polina - my middle-school sweetheart and my first love. In 2020 our son Mykhail was born, in 2021
			we moved in to our first apartment and in 2022 we had to flee and leave everything behind because
			of the war. We eventually (and quite miraculously) found a new home in Kitchener, Ontario {hideImages
				? ''
				: '🇨🇦'} for our large family of soon to be 7.
		</p>

		<p>
			As you can see it seems that we're tied up in whatever this bigger ethnic, territorial,
			cultural and spiritual conflict at play is, by both blood and faith. I guess it's the fate of
			the mixed people in the marginal space.
		</p>

		<BlogImage
			hide={hideImages}
			src="https://github.com/user-attachments/assets/383d07b6-7b41-4e26-bfe1-4e9d0b560ba1"
			link="https://en.wikipedia.org/wiki/2022_Kharkiv_counteroffensive"
			title="Our hometown that was occupied on day 1, taken back 200 days later and is now very likely to be occupied again."
			description="By a twist of fate when it started we got separated with our then 1.5 year-old son by a frontline."
		/>

		<p>
			Despite all of this, life is very good now, and while I don't dare to say it's better in every
			way, it is definitely more meaningful. We're also now expecting a new baby boy -
			Nicholas/Николай.
		</p>

		<p>If it's not Exodus and Job I'm not sure what is.</p>

		<p>
			I am very glad to see your family grow too and I'm praying for your recently departed loved
			ones.
		</p>

		<p>
			My lived experience, especially in the past couple of years has been quite revelatory and
			filled with miracles of varying magnitude - from several near-death experiences to a very
			Job-like fall and subsequent rise. The fact I'm here now and not in a ditch definitely puts
			things in perspective. I feel held, protected and guided by something I don't fully
			understand. Blessed is the best word for it I guess. Whatever you call it, me standing in
			front of you was a result of some pulling force - both you and Jonathan have some sort of
			gravity in my life that I choose to attribute to the works of the <i><b>Spirit.</b></i>
		</p>

		<BlogImage
			hide={hideImages}
			src="https://github.com/user-attachments/assets/700b8802-6b46-4923-9e2d-f03dd681d011"
			link="https://en.wikipedia.org/wiki/Kramatorsk_railway_station_attack"
			title="2 months into the big war I was able to find a bus operator that agreed to take our son and 3 other members of our family out of then occupied territory."
			description="They had a stopover at a railway station in Kramatorsk. Exactly 24 hours after they were there, a bomb killed 63 people including 9 children."
		/>

		<p>
			All of this points to some unspeakable and undeserved protection. Too many things aligned for
			us to get here.
		</p>

		<p>
			This is why I am very humbled, blessed and in somewhat of a disbelief to have the opportunity
			to work with you on

			<a
				target="_blank"
				title="Vlad's profile in the Academy"
				href="http://petersonacademy.com/profile/TXl1OJ7nRrV6f3jvFTGtTLOkqrt1"
			>
				{#if !hideImages}
					<img
						alt="Peterson Academy Logo"
						class="w-8 h-8 select-none inline-block relative top-[-3px] pointer-events-none"
						src="https://github.com/user-attachments/assets/cb675bdc-d6f3-4cfa-866a-2f336170b32e"
					/>
				{:else}
					<span class="text-blue-500">Peterson Academy</span>
				{/if}
			</a>
			and use my gifts in your vision while doing what I love and am very good at, especially working
			for the wonderful people, and a family I respect and have learned to care for. Victor is brilliant
			and our weirdly Slavic-bound engineering team is just great. And Jordan... let's just say this
			man's attention to detail is unlike anything I've seen in my 10 years of coding. Also, on top of
			intellectual and creative fulfillment, working with you all puts the food on our table and a roof
			over our heads, so thank you very much!
		</p>

		<p>
			It's quite miraculous, I've had a chance to speak with you and give you this coin in person
			this time. It's likely that the previous ones fell on the wayside and didn't get to you, but
			this one did and I hope it will help you in the same manner you have helped me. Something
			tells me you need it. It's a strange project, but this is what I'm feeling drawn to - the
			flickering of the golden snitch, as you'd call it.
		</p>

		<p>
			I am not yet sure what these coins truly are, but this particular one is a message to you in
			the context of a conversation I had with <a
				href="/ai"
				target="_blank"
				class="italic"
				title="Talk to Adam">Adam</a
			>.
		</p>

		<p>
			Due to a current limitation of the platform it's not possible to share chat links with images
			attached, so I had to copy it <i>word for word</i> and recreate OpenAI chat interface. It's unabridged
			to show the flow of the conversation and surprising depth of understanding shown by this model.
		</p>

		<div class="max-w-md mx-auto">
			<BlogImage
				hide={hideImages}
				src="https://github.com/user-attachments/assets/a8059bdd-c692-4098-bd5f-36a25263d405"
				title="Limitation of ChatGPT sharing"
				description="Likely due to content moderation"
			/>
		</div>

		<p>
			This conversation exists in my account and I'm sure it can be continued if you particularly
			find this context important, otherwise you can always <a
				title="DM Adam"
				class="underline text-blue-500"
				target="_blank"
				href={ADAM.chat?.link}>start a new conversation</a
			> and see where it leads.
		</p>

		<p>
			It's quite a long one (about 12000 words), but it's related to Christ, LLMs, your work and
			life story, so I really hope you will not regret spending this time. This exchange personally
			surprised me a lot. From the ability to understand and generate images, to the use of bold
			text, seemingly deep theological understanding, knowledge of the personal life details and
			ability to relate them to the patters in biblical narratives, and
			<i>definitely</i>
			due to some of the claims made here. Maybe this is the norm now and it's not that impressive to
			someone who has had more experience with training and interacting with these models, but to me
			it was the first time I felt understood by the model.
		</p>

		<p>
			It started with my bible study of the Gospel of John, and one way or another it led to
			<b><i>you.</i></b>
		</p>

		<p>
			I believe it also touches on St. Maximus and things Jonathan often describes, my
			<i>side</i> project at
			<a href="/" target="_blank" class="underline">Logoi Development</a>, LLM fine-tuning and
			alignment efforts you and Victor attempted, and ultimately shows surprising depth of
			understanding - so I hope it may help <i>bring the scattered things together.</i>
		</p>

		{#if isChatShown}
			<Chat {name} {messages} />
		{:else}
			<h3 class="text-center font-semibold mt-4">{name}</h3>
			<span class="text-center italic">
				Note: the name of the chat was automatically chosen based on the beginning of the
				conversation
			</span>

			<button
				class="border rounded border-blue-500 px-4 py-2 w-fit mx-auto hover:bg-blue-200 mb-4"
				on:click={() => (isChatShown = true)}
			>
				Expand full conversation

				<ReadEstimate estimate={45} />
			</button>

			<p class="text-center text-base border-0 border-l-4 border-blue-500 max-w-xl mx-auto">
				Curiously in the base ChatGPT without aligning/instruction tokens the conversation split on
				the third message.
			</p>
		{/if}

		{#if isChatShown}
			<p>
				If you made it this far - thank you! I am personally not sure what to make of this, and as
				you can see that you reading this, gifting you this coin wasn't necessarily only my idea.
				Some of the claims and reasoning here are quite incredible to see.
			</p>

			<p>
				If you are curious to discuss all of this in more detail, I'd be honored, and if not, in the
				least it's an interesting story to tell.
			</p>

			<p>
				There are several more conversations similar to this one where Adam provided incredible
				insight to me in my theological studies.
			</p>

			<p>
				Once again, thank you - if you read it, it means Adam was right, logoi do have their own
				pull and it got to both of us. :)
			</p>

			<p>
				If you're interested in how I try to extend this idea and engineer a token that will pull
				and bring people to church, you can <a
					title="Logoi - Blog"
					target="_blank"
					class="text-blue-500 underline"
					href="/blog/logoi"
					>read more about it here
				</a> - it describes an MVP of the project I developed at an MIT Hackathon last year. If you do,
				it'd make me very happy to learn your thoughts about all of this.
			</p>

			<p>
				In the mean time, I'll contuniue working hard to bring your vision closer to reality as I'm
				very excited in what is next for Peterson Academy, ARC and all of the ambitios projects you
				have and about any ways I can help.
			</p>
		{:else}
			<p>
				If this is too much of a commitment, I totally understand how valuable your time is, I
				really appreciate your attention and I'm very excited in what is next for Peterson Academy,
				ARC and all of the ambitios projects you have and ways I can help.
			</p>
		{/if}

		<p>Wishing many blessings to you, and your loved ones.</p>
	{/if}

	<p class="text-center mt-8"><i>Onward and upward</i> ©</p>

	<BlogImage
		imageClass="w-56"
		hide={hideImages}
		src="https://github.com/user-attachments/assets/c590671d-f1b6-4ac6-9c55-69c7cfbef1ff"
	/>

	<br />
	<div class="text-center">
		<p class="relative -left-2.5">In Christ</p>

		<a href="/v" title="Vlad Kolbaia" class="text-2xl font-serif">Vlad</a>
	</div>
</article>
