<script lang="ts">
	import BlogImage from 'src/components/BlogImage.svelte';
	import ToggleImages from 'src/components/ToggleImages.svelte';

	let hideImages = false;
	let genesisQuoteExpanded = false;
</script>

<ToggleImages bind:hideImages />

<article class="flex flex-col gap-4 text-xl indent-4">
	<p>
		Recently I had a fascinating conversation and was encouraged to lay out some of the concepts I
		explained in a written form, so here it goes…
	</p>

	<p>
		The conversation touched on the ideas of three deep and modern thinkers, all of whom my
		colleague knew and learned from personally - <a
			class="underline"
			target="_blank"
			href="https://www.youtube.com/@JordanBPeterson"
		>
			Dr. Jordan Peterson
		</a>,
		<a class="underline" target="_blank" href="https://www.youtube.com/@johnvervaeke">
			Dr. John Vervaeke
		</a>
		and
		<a class="underline" target="_blank" href="https://www.youtube.com/@JonathanPageau">
			Jonathan Pageau
		</a>.
	</p>

	<p>
		I shared a personal note that I find John's ideas most difficult to understand and less
		accessible, at the same time commending Jonathan's ability to articulate. To my surprise my
		friend said that his experience was exactly the opposite and that he found this symbolic
		language and "God is Symbol" confusing. So I will try to recount my attempts to explain it in
		the best way I can. These ideas are quite complex, and I don't claim to be an expert theologian
		- this is purely based on my understanding.
	</p>

	<p>
		There are several core concepts that are central to Jonathan's <a
			class="underline -mr-1"
			target="_blank"
			href="https://www.thesymbolicworld.com?utm_source=logoi"
		>
			Symbolic World
		</a>view that is largely rooted in the teachings of the Church Fathers, such as St. Maximus the
		Confessor and St. Gregory of Nyssa.
	</p>

	<p class="text-center">
		<i>NOTE</i>: I am a visual learner and rely on images to anchor the story,
		<span>{hideImages ? 'so' : 'but'}</span>
		you can
		<span>{hideImages ? 'show' : 'hide'}</span>
		all images:
		<ToggleImages position="relative" bind:hideImages />
	</p>

	<h3 class="text-3xl font-serif text-center">Categories</h3>

	<p>
		The first thing I want to introduce is concept of categories as such. One of the very first
		things that Adam was tasked to do right before and right after the creation of Eve is to tend to
		the garden and to name the animals.
	</p>

	<quote class="w-3/5 mx-auto text-lg max-w-screen-sm pl-[2em] border-l-emerald-900 border-l-4">
		<ol
			start="15"
			class="list-decimal marker:not-italic marker:text-sm"
			style="font-family: system-ui, -apple-system;"
		>
			<li>
				The Lord God took the man and put him in the Garden of Eden to <b>
					work it and take care of it.
				</b>
			</li>

			{#if genesisQuoteExpanded}
				<li>
					And the Lord God commanded the man, <quote class="italic">
						“You are free to eat from any tree in the garden;
					</quote>
				</li>
				<li>
					<quote class="italic">
						you must not eat from the tree of the knowledge of good and evil, for when you eat from
						it you will certainly die.”
					</quote>
				</li>
				<li>
					The Lord God said, <quote class="italic">
						“It is not good for the man to be alone. I will make a helper suitable for him.”
					</quote>
				</li>
			{:else}
				<button
					class="text-gray-400 flex flex-col items-center leading-5 justify-center mx-auto text-sm -mt-4"
					on:click={() => (genesisQuoteExpanded = true)}
				>
					<span>⋯</span>
					<span class="-my-2">(expand)</span>
					<span>⋯</span>
				</button>
			{/if}
			<li value="19">
				Now the Lord God had formed out of the ground all the wild animals and all the birds in the
				sky. He brought them to the man <b>to see what he would name them</b>; and whatever the man
				called each living creature, that was its name.
			</li>
		</ol>

		<a
			href="https://www.biblegateway.com/passage/?search=Genesis%202%3A15-19&version=NIV&utm_source=logoi"
			class="float-right italic underline">Genesis 2:15-19</a
		>
	</quote>

	<!-- TODO: Add carousels -->
	<BlogImage
		hide={hideImages}
		title="Adam naming the animals"
		src="https://upload.wikimedia.org/wikipedia/commons/1/15/Adam_naming_the_animals._Etching._Wellcome_V0034186.jpg"
	/>

	<p>
		Let's think about what this means... For the multiplicity of created living beings in the
		garden, he needed to find names for them, meaning separate them into categories of beings.
		Looking at a gray wolf, an arctic wolf, a Persian cat and a Bengal tiger, there had to be some
		unifying aspect of the category of the cat, and the wolf. The necessity for category-separating
		aspects naturally follows.
	</p>

	<BlogImage
		hide={hideImages}
		title="<s>Felidae family</s> Cats"
		src="https://github.com/user-attachments/assets/27e43c48-5e28-40ec-8754-cf4317840676"
	/>

	<p>
		The mechanism that allows humans to perform such classification, even at a very young age is
		quite miraculous, especially considering how difficult this problem is for computers in
		comparison - image recognition and spatial computing relies on millions of examples given and
		heavy processing, and even then has a fairly large margin of error, where's a 3 year old will
		see 2 different cats and can understand them as largely the same thing.
	</p>

	<BlogImage
		class="max-w-[25rem] mx-auto"
		hide={hideImages}
		title="Drawing of a 3 year-old"
		src="https://github.com/user-attachments/assets/039ee0eb-12eb-4a4d-af9b-d40556597f7e"
	/>

	<p>
		This capacity to see at the core of a being extends to non-living things as well. Jonathan's
		favorite example that continues to haunt him is a chair and a cup. While there could be
		countless variations of a cup, we have a solid understanding of what a cup looks like. Even if
		we're presented with a new type of cup we have never seen before, like a medeival ordained
		goblet, it takes a fraction of a second for it to fall neatly into our cup drawer in the mind.
	</p>

	<BlogImage
		hide={hideImages}
		title="Different types of cups"
		src="https://github.com/user-attachments/assets/1d3aa96e-2946-4994-be30-8ac04026195f"
	/>

	<p>
		There are also bordering but distinct categories, like it is pretty obvious for us when it's a
		bottle and not a cup. So if we look at a cup and break it up into peices, and do the same with a
		bottle - likely there will be quite a few overlapping pieces and components. If we try to gather
		all of the common components of a cup and a bottle it could be a category of it's own, as adding
		any extra peice will necessarily tilt it over into either cup or bottle side. Important
		distinction that this category of an object is unlikely to be very functional - does this thing
		hold water or do we need to drink from it. Like Dr. Peterson sucessfuly argues, we do seem to
		percieve function first. A cup is something you drink out of and can easily grab, a bottle is
		something you can also easily grab and drink out of, but it's main purpose is to hold liquids
		and not spill them.
	</p>

	<BlogImage
		hide={hideImages}
		title="Glass to Bottle spectrum"
		src="https://github.com/user-attachments/assets/4635545b-90ae-4e2a-84c2-167fea493475"
	/>

	<p>
		While it is easy to make a glass out of the bottle, if you cut the bottle not enough and some
		curvature is preserved, it is not a "good" cup anymore, and untill it can be capped, it's not a
		good "bottle" either - it becomes a marginal thing, it enters the "monstrous" realm. And
		monsters are quite prominent in Jonathan's symbolic vocabulary. They are by all means all of the
		things that exist on the edge (marginal) and between distinct categories. Misguidedness towards
		its purpose is both a cause for and a symptom of the monstrosity. Humans are quite good at
		detecting and quickly reacting to strange things, things that fall out of natural and expected
		patterns. While there's another huge push in culture to accept all that is strange and to
		include everything people fail to recognize that it simply opens up to more category breakdown
		and even stranger things with all the dangers it entails.
	</p>

	<h3 class="text-3xl font-serif text-center">Attention</h3>

	<p>
		This brings us to how we attend to things. We are surrounded by enormous complexity. Every
		single object is infinitely complex, it necessarily consists of components on, in a sense, lower
		level of being or purpose. Modern technology is the most obvious example. Every device has
		nested layers of complex components - screens consist of millions of pixels, each pixel
		consisting of subpixels, driven by tiny wires and transistors, connected to dedicated graphics
		chips, that itself consists of smaller parts that talk to the CPU, which itelf consists of
		smaller parts, infused with electricity and orchestrated by layered software (machine code,
		drivers, operating system) to enable all of it to work together. Then we get networks of these
		devices, and so on...
	</p>

	<p>
		And living beings are even more complex and incredible, from simplest cells, to organs, to full
		functioning and self-healing replicating organisms. It extends to the cosmos just as well, from
		planets to planetary systems, galaxies and, as current popular culture desparately wants to
		convince us, multiple universes. In all honesty the depth of the rabbit hole doesn't matter that
		much as what's important is the pattern that allows lesser things to be united into higher
		things in all layers and resolutions of being.
	</p>

	<iframe
		class="mx-auto w-4/5 min-w-56 max-w-screen-sm aspect-video"
		src="https://www.youtube-nocookie.com/embed/uaGEjrADGPA?mute=1"
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
	<a
		class="text-base underline mx-auto"
		href="https://htwins.net/scale2?utm_source=logoi"
		target="_blank"
	>
		Scale of the universe (interactive demo)
	</a>

	<p>
		We take for granted not being overwhelmed by every single snowflake or every individual branch
		and leaf when walking outside. It is actually a feature of a healthy mind to ignore most things,
		as people with OCD can attest to excrutiating pain of being unable to ignore and let go of any
		particular triggering thing. Our attention filters out vast majority of sensory information, at
		the same time enhancing this 2 dimensional visual input with depth perception, edge detection,
		distance approximation and classifies and ranks all objects in the viewport with purpose and our
		motivations at the time.
	</p>

	<p>
		In ancient philosophy this capacity for our mind to see to the purposes of things is reffered to
		as the <a class="underline italic" href="https://en.wikipedia.org/wiki/Nous" target="_blank">
			Nous
		</a>
		- the <i>Eye of the Soul</i>. That's what allowed Adam to categorize the animals and thats what
		allows us to do the same, to look directly at the core of the forms and recognize the edges of
		things - where one thing ends and another begins, and relationship of parts to the whole.
	</p>

	<h3 class="text-3xl font-serif text-center">Veils</h3>
	<p>
		TODO: Borders of categories, from cellular membranes, to skin, to Noahs ark, to cities, to the
		holy covering of the Theothokos - all are instances of the pattern of the veil. Veils are also
		tied to divine hierarchies (orders of angels), the idea of asking for intercession is in a way
		hierarchical referral because the veils can't be forcefully torn or penetrated. In our parish if
		any person is late for the liturgy the notes with the names of the departed and for blessing of
		the living are given to men who are allowed to enter the altar. The list is then given to the
		Priest who offers them further up.
	</p>

	<h3 class="text-3xl font-serif text-center">Logoi</h3>
	<p>
		TODO: What we see, example of the Christmas tree, purposes that hold things in God's memory -
		deviation from the purpose causes distancing and even breakdown, potential reference to Donald
		D. Hoffman and everything being "an illusion" and the world being a reference akin to computer
		user interface. Prayer and worship as interface with the Divine. *Need to find a good way not to
		deviate and freak people out too much.
	</p>
	<p>
		Tie logoi to the coverings - an image of the threads of protective covering of the Theotokos
		(Pokrov) to be made of logoi.
	</p>
	<p>
		At the same time Logoi and veils are mutually dependant - just as the essensces require a
		container not to dissipate, containers require a seed to be placed in them as empty vessels can
		not hold.
	</p>
	<p>
		Going back to the example of the cup now the thing that comes up in your mind when I ask to
		imagine a cup, you can think of the logos of the cup. You can play with your imagination and
		imagine a weird cup, or broken cup, but all those variation are driven by distance from the
		central "perfect image" - the inteded Logos of the cup in the mind of God. Too much distancing
		leads to the monstrous margin and even further distancing leads to breakdown.
	</p>
	<p>
		From this it is quite easy to imagine that Logoi are hierarchical as well, Vessel seems to be a
		more encompassing and abstract logos that has aspects of the cup but lacks particularity that
		differentiates itself from it. From this you can imagine a network, a weaved tapestry of
		purposes and meanings from which objects of creation stem. Like a virtual representation of a
		thing now a cup can be represented in all aspects of perception - you can make it, drink from
		it, draw it, sing a song about it, dream of it, and break it over someone's head in GTA6.
	</p>
	<p>
		This networked tapestry - Pokrov (Shroud) of the Theothokos, is the thing that holds chaos at
		bay, it is both the Noah's Ark, the Jonah's Whale and the (from my thesis).
	</p>
	<p>
		Share a personal experience of "unveiling" of structure and stability during the war, which
		allowed to see the fragility, but also feel a much more intimiate and personal covering.
	</p>

	<h3 class="text-3xl font-serif text-center">Memory</h3>
	<p>TODO: Memory as a filter and a tool of significance (personal and cultural)</p>
	<p>Quote the Liturgy of St. John Chrysostom</p>
	<p>
		Prayer as seeking attention and rememberance - Prayer before communion <i>
			...Remember me, O Lord in Thy Kingdom.
		</i>
	</p>
	<p>
		The failure of memory (or perhaps it's main feature) is seen already in Genesis with Eve's
		addition of "nor shall you touch it", showing the imperfection when information is transmitted
		even in the most perfect circumstances.
	</p>

	<h3 class="text-3xl font-serif text-center">Unity and Multiplicity</h3>
	<p>
		TODO: Logoi as binding purpose for things, scaled up and scaled down versions, relate to the
		idea of the seed (a container of purpose, a name) and a place where heaven and earth meet. And
		if we think of what seeds produce - trees, a self repeating, recursive patterns that hold
		identity, where identity as such is necessarily given from above or "from the outside", as
		self-identification is degenerative and subject to fault due to lack of understanding akin to
		Goedel's incompleteness.
	</p>

	<h3 class="text-3xl font-serif text-center">Visible and Invisible</h3>
	<p>
		TODO: Quote the Nicene Creed, introduce two categories of visible and invisible (Earth and
		Heaven, Body and Spirit) as the most generic categories, Man as a joining and focal point at
		which all purposes/logoi make sense and fulfill themselves.
	</p>

	<h3 class="text-3xl font-serif text-center">Symbolos vs Diabolos</h3>
	<p>
		Symbolos - shows united purposes, like memory pointers, gathers multiplicity into unity (dust to
		being), allows to comminicate and recognize abstract categories.
	</p>
	<p>
		Diabolos - the opposite, splitting away, disunion and failiure to recognize and point to the
		purpose
	</p>
	<p>
		William Blake ancient of days - moment of creation as diabolic (need to be careful here, may be
		worth it to mention the fall as a splitting/turning away and the fact that we refer to this
		world as living in death). This splitting is a scattering of seeds. That means the Eschaton is
		symbolic in nature - a gathering/harvesting of fruit.
	</p>

	<h3 class="text-3xl font-serif text-center">Summary</h3>
	<p class="mx-auto">
		Purpose of worship, relational aspect of being and incarnation (Son being a perfect Symbol of
		the Father and Trinity infinitely pointing to itself), Crucifix as a the ultimate place of union
		of Heaven and Earth, and an anchor of attention, and the axis of the world - the Symbol of the
		Logos in a sense of fulfillment of the most important purpose possible.
	</p>

	<br />
	<div class="text-center">
		<p class="relative right-2.5">In Christ</p>

		<a href="/v" title="Vlad Kolbaia" class="text-2xl font-serif">V</a>
	</div>
</article>
