<script lang="ts">
	import BlogImage from 'src/components/BlogImage.svelte';
	import ToggleImages from 'src/components/ToggleImages.svelte';

	let hideImages = false;

	let mongoliaImageType: 'flag' | 'emblem' | 'horse' = 'emblem';
</script>

<ToggleImages bind:hideImages />

<article class="flex flex-col gap-4 text-xl indent-4">
	<p>
		Recently I had a fascinating conversation with a friend - <i>Murad</i>. I am very thankful to
		him for providing encouragement to move to Canada and for the emotional support he gave my wife
		while we were trying to reunite our family in Ukraine. He is a lifelong student of history, and
		is assisting the professor in History 101 at the University of Waterloo. That’s why in
		particular I was hoping to discuss with him the current state of the world, conflict, and most
		of all understand his views on the Muslim faith and the historicity of Mohammed, the Quran, and
		most of all - Jesus of Nazareth. We discussed much more, it was a long and very meaningful
		dialogue that I now realize could have been a great podcast. I’ll have to think about these
		topics for a bit longer, but I do want to note one story in particular.
	</p>

	<p>
		Naturally topic of faith and cosmology came up - I shared my Christian view of creation and
		being, while he explained his. As the Muslim faith is dominant in Azerbaijan - his home country,
		I assumed Murad was Muslim as well, but I assumed wrong. He shed a lot of light on Islam for me
		though, and in particular that Islam and Christianity are not incompatible, but something of a
		<i>“fork”</i> (a term frequently used in programming) - a story sharing the origin but divergent
		at some point and existing in parallel. One question in particular that divides our religions, apparently,
		is about what son Abraham was told to sacrifice - Isaac or Ishmael? Abraham is a very important figure
		in both religions (in fact so important both religions are classified as Abrahamic) and a father
		of all nations.
	</p>

	<BlogImage
		hide={hideImages}
		link="https://en.wikipedia.org/wiki/Binding_of_Isaac"
		title="The Sacrifice of Isaac by Caravaggio"
		src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg/1555px-Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg"
	/>

	<p class="text-center">
		<i>NOTE</i>: You can <span>{hideImages ? 'show' : 'hide'}</span> all images:
		<ToggleImages position="relative" bind:hideImages />
	</p>

	<BlogImage
		hide={hideImages}
		title="Abraham at the Last Judgement"
		link="https://youtu.be/TsHnGUKEEdM?t=2085"
		src="https://github.com/logoidev/logoidev/assets/11582927/ad9cd596-9ce5-49c9-890c-e4ec2bf9657c"
	/>

	<p>
		There’s a pretty good article on this
		<a
			class="underline"
			target="_blank"
			href="https://countercurrents.org/2019/07/the-sacrifice-of-ishmael-or-issac-a-debate/"
		>
			with quotes from both texts.
		</a>
		This was very interesting to know and I initially thought that this sounded so childish and silly.
		Does it really matter who or more importantly what was the name of the son that was saved from the
		sacrifice? But I suspect there’s more depth to this story, so it’s worth returning to this later.
	</p>
	<p>
		What Murad shared with me is his religion and cosmology he believes in. He said that he is
		Tangrian. It’s a worldview native to the nomadic tribes that lived in the territory of modern
		day Azerbaijan and a culture he feels connected to, much like I want to attach myself to Kyivan
		Rus'. As a modern-day Ukrainian living in Canada, I have very little to do with Kyivan Rus’ but
		I feel like the culture that is the core of my identity was rooted there, and in particular,
		began the day of the Baptism in the year 988.
	</p>

	<BlogImage
		hide={hideImages}
		title="Baptism of Kyivan Rus' by Klavdiy Lebedev"
		src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Lebedev_baptism.jpg"
	/>

	<p>
		Tengrians believe that life is an eternal movement of souls and spirits and has no beginnings
		and no end. The god is often symbolized by the image of a horse moving so fast that you cannot
		see its legs. In the saddle, there’s often a symbol you can also see as a part of both <button
			disabled={mongoliaImageType === 'flag'}
			class={mongoliaImageType !== 'flag' ? 'underline' : ''}
			on:click={() => (mongoliaImageType = 'flag')}>flag</button
		>
		and the
		<button
			disabled={mongoliaImageType === 'emblem'}
			class={mongoliaImageType !== 'emblem' ? 'underline' : ''}
			on:click={() => (mongoliaImageType = 'emblem')}>emblem</button
		>
		of Mongolia.
		<button
			disabled={mongoliaImageType === 'horse'}
			class={mongoliaImageType !== 'horse' ? 'underline' : ''}
			on:click={() => (mongoliaImageType = 'horse')}>The Wind Horse</button
		>
		- <a class="underline" target="_blank" href="https://en.wikipedia.org/wiki/Wind_Horse">Azure</a>
		often appears flying and bearing
		<a
			class="underline"
			target="_blank"
			href="https://en.wikipedia.org/w/index.php?title=Three_Jewels">Three Jewels</a
		> an important symbol in Buddhism as well.
	</p>

	{#if mongoliaImageType === 'emblem'}
		<BlogImage
			hide={hideImages}
			imageClass="w-80"
			title="Emblem of Mongolia"
			link="https://en.wikipedia.org/wiki/Emblem_of_Mongolia"
			src="https://upload.wikimedia.org/wikipedia/commons/3/3e/State_emblem_of_Mongolia.svg"
		/>
	{:else if mongoliaImageType === 'flag'}
		<BlogImage
			hide={hideImages}
			title="Flag of Mongolia"
			link="https://en.wikipedia.org/wiki/Flag_of_Mongolia"
			imageClass="w-80"
			src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Mongolia.svg/1920px-Flag_of_Mongolia.svg.png"
		/>
	{:else if mongoliaImageType === 'horse'}
		<BlogImage
			hide={hideImages}
			title="Azure - The Wind Horse"
			link="https://en.wikipedia.org/wiki/Wind_Horse"
			imageClass="w-80"
			src="https://upload.wikimedia.org/wikipedia/commons/b/b8/Lungta_symbol.svg"
		/>
	{/if}

	<p>
		In the saddle there is as a chalice holding the spirit. It is believed that bodily life begins
		when the body is filled by many such spirits at birth that unite into one soul, creating a
		unique recipe of the individual, but it does not begin there as spirits are eternal - they
		simply enter this brief state of “fulfillment” until the body is dead and the spirits are poured
		back to where they came from, hopefully filing other new souls with their pieces. The god -
		Tengri, a word used in Turkic language to describe any god or gods, like Roman gods or Egyptian
		gods.
	</p>

	<BlogImage
		hide={hideImages}
		imageClass="w-80"
		title="Spelling of the name of Tengri"
		src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Orkhon.svg/1024px-Orkhon.svg.png"
	/>

	<p>
		Tengri is viewed as the creator of this movement (something similar to
		<a class="italic underline" target="_blank" href="https://en.wikipedia.org/wiki/Unmoved_mover">
			Aristotle's prime mover
		</a>) but who is indifferent to the world and its fate, he does not cast judgment and everything
		that is permissible is just that - permissible. Morality is subjective in this case. There is,
		however, practical recognition that this movement is generally positive, and the movement is
		forward. What constitutes forward is not fully explained, but at least it’s not movement back.
		All life is recognized as valuable, and human life is among those. It is customary when saying
		farewell to say something roughly translating to <i>“stay alive”</i>, so being alive is
		considered good, and being dead is not.
	</p>

	<p>
		It is also customary to say “Tengri wills it” when something good and fortunate happens - this
		confused me quite a lot since you can ask what is the point of recognizing the will of god as
		good if this god lacks the distinction between the two. For now I interpret it as recognition of
		the positive movement and collective will of the spirits embodying the people.
	</p>

	<p>
		Murad also shared a fascinating thing which is 3 roles that are considered particularly
		important in the Tengrian society.
	</p>

	<p>
		The first one is <a
			class="font-bold underline"
			href="https://www.britannica.com/topic/shamanism">Shaman</a
		> - he is something like a ritual master, usually helpful in childbirth and delivery, but is also
		a healer and a communicator with spirits. Because shaman has a strong connection with spirits, he
		would usually live on the edge of the cities and does not have a family of his own. It’s a very practical
		role and actually didn't have very much to do with the dances and tambourines commonly depicted in
		modern culture. Yet this is exactly why they are most known out of the three groups. Shamans do not
		provide spiritual guidance or preach, they also do not pronounce prayers as prayer itself is not
		needed for an indifferent god. Analog to the prayer is meditation which is aimed at recognizing the
		beauty of the moment and slowing down the perception of this movement.
	</p>

	<BlogImage
		hide={hideImages}
		title="Mongol Shaman c.1909"
		link="https://www.britannica.com/topic/shamanism"
		imageClass="w-80"
		src="https://cdn.britannica.com/63/3863-050-611D29E3/shaman-gown-Mongolian-drum-image-spirit-helper-1909.jpg"
	/>

	<p>
		The second important role is the <b>Ozan</b>. Ozans are bards and storytellers, they travel and
		share stories of life and represent and support the nature of the exchange of ideas, knowledge
		and propagation of culture. The means of this function is mostly oral. Storytelling is a big
		part of the culture as often you would see small memorials telling the stories that happened at
		the location, often times fun and dramatic. It reinforces the belief that every individual is
		unique and is built in hope that good parts of the soul will be taken by Azure and are picked to
		be a part of the next conciousness born.
	</p>

	<BlogImage
		hide={hideImages}
		imageClass="w-80"
		title="The Voice of the Ancient Bard by William Blake"
		link="https://en.wikipedia.org/wiki/Bard"
		src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Songs_of_Innocence_and_of_Experience%2C_copy_Y%2C_1825%2C_object_54%2C_The_Voice_of_the_Ancient_Bard_%28Metropolitan_Museum_of_Art%29.jpg"
	/>

	<p>
		The third role is <b>Yazan</b>, who is a scribe and a writer. There were very few yazans as
		writing was a difficult and scarce skill. They usually work in tandem with ozans acting as a
		sort of filter to all the stories that ozans generate, effectively functioning as a collective
		memory and sieve. I admire the wisdom to recognize the importance of writing even in nomadic and
		oral culture.
	</p>

	<BlogImage
		hide={hideImages}
		title="Nestor the Cronicler, 15th century manuscript"
		description="There are no images of nomadic scribes, so this is the most important slavic scribe of Kiev Rus', who lived in 11th century AD"
		link="https://en.wikipedia.org/wiki/Nestor_the_Chronicler"
		src="https://upload.wikimedia.org/wikipedia/commons/4/48/%D0%A0%D0%B0%D0%B4%D0%B7%D0%B8%D0%B2%D1%96%D0%BB%D0%BB%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B8%D0%B9_%D0%BB%D1%96%D1%82%D0%BE%D0%BF%D0%B8%D1%81_%D0%9D%D0%B5%D1%81%D1%82%D0%BE%D1%80_%D0%BB%D1%96%D1%82%D0%BE%D0%BF%D0%B8%D1%81%D0%B5%D1%86%D1%8C_%281051%29.jpg"
	/>

	<p>
		Those are the <i>core functions</i> that require the cosmology to work and produce a functioning
		society, free of the judgment of God and burdens of absolute truth. We are just passengers
		temporarily occupying a vessel in a process that never ends. It’s a very optimistic worldview
		and quite a huge contrast to the
		<a class="underline italic" target="_blank" href="https://en.wikipedia.org/wiki/Eschatology"
			>Last Judgment</a
		> - the time when this supposed movement will end. In fact the existence of heaven for Tengrians
		is already kind of proof that souls are eternal, the only question we seemed to differ on is that
		if we keep our memories and identities in this spirit heaven after death or not, and also about the
		nature of such an environment.
	</p>

	<p>
		While there’s supposedly no hierarchy of spirits, Tengri is recognized as “bigger” or more
		important than the rest and a primary creator, so there <b>is</b> a hierarchy really. Now the
		the most controversial and dangerous question arose - what description of god fits at the top?
		Naturally, I asked if my friend would be offended if I said that our God (in the form of Old
		Testament <b>YHWH</b>) created Tengri and this cosmic movement and then left and didn’t
		interfere since - a view held by many known as
		<a class="italic underline" href="https://en.wikipedia.org/wiki/Deism" target="_blank">Deism.</a
		>
		My friend said that he has no problem with this statement unless I insist that God does interfere,
		judge and has control over free will and events. So I will <i>not</i> insist that as I certainly
		can’t know for sure.
	</p>

	<BlogImage
		hide={hideImages}
		title="Tetragrammaton"
		description="Name of YHWH, read right to left"
		imageClass="w-64"
		link="https://en.wikipedia.org/wiki/Tetragrammaton"
		src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Tetragrammaton_scripts.svg/1024px-Tetragrammaton_scripts.svg.png"
	></BlogImage>

	<p>
		I still chose to believe in a loving and quite attached and interfering God, a God who judges,
		redeems, and ultimately cares about every single human being and wants a good relationship with
		us.
	</p>

	<p>
		In the spirit of me enacting <i>Yazan</i> and my friend enacting <i>Ozan</i> you can now read this
		story and hopefully enjoy it. I’m very thankful to Murad for sharing it with me and I hope he finds
		time to help me edit and add on some important pieces I may have missed.
	</p>

	<p>
		It was a fascinating dialogue and a fantastic story of a worldview of people who used to live
		very differently from us. I feel a certain resonance with this story - as an immigrant in charge
		of a big family, I’m factually a part of a nomadic tribe and do not have a permanent home. I do
		not yet know if we will stay here in Canada or will have to find a new place, what will I get to
		keep or what will I have to leave behind in this eternal movement, but ultimately I’m reminded
		of the <i>Job 1:21</i>
	</p>

	<blockquote class="italic">“…the Lord gave, and the Lord has taken away…”</blockquote>

	<br />
	<div class="text-center">
		<p>Stay alive people,</p>

		<a href="/v" title="Vlad Kolbaia" class="text-2xl font-serif">V</a>
	</div>
</article>
