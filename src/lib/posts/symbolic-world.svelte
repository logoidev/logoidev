<script lang="ts">
	import BlogImage from 'src/components/BlogImage.svelte';
	import ToggleImages from 'src/components/ToggleImages.svelte';

	let hideImages = false;
</script>

<ToggleImages bind:hideImages />

<article class="flex flex-col gap-4 text-xl indent-4">
	<p>
		Recently I had a fascinating conversation and was encouraged to lay out some of the concepts I
		explained in a written form, so here it goes…
	</p>

	<p>
		The conversation touched on the ideas of three deep and modern thinkers, all of whom my
		companion knew and learned from personally - <a
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
		</a>. We started with discussing how incredible to see the ideas of these men gain so much
		attention and spread.
	</p>

	<p>
		I shared a personal note that I find John Vervaeke's ideas most difficult to understand and less
		accessible, at the same time commanding Jonathan's ability to articulate. To my surprise my
		friend said that his experience was exactly the opposite. And that he found symbolic worldview
		and "God is Symbol" confusing. So I will try to repeat my attempts to explain it in the best way
		I can.
	</p>

	<p>
		There are several core concepts that are central to Jonathan's Symbolic Worldview that is
		largely rooted in teachings of the Church Fathers, such as St. Maximus the Confessor and St.
		Gregory of Nyssa.
	</p>

	<h3 class="text-3xl font-semibold text-center">Categories</h3>

	<p>
		The first thing I want to introduce is concept of categories as such. One of the very first
		things that Adam was tasked to do in Genesis is to tend to the garden and to name the animals.
	</p>

	<!-- TODO: Add carousels -->
	<BlogImage
		hide={hideImages}
		title="Adam naming the animals"
		src="https://upload.wikimedia.org/wikipedia/commons/1/15/Adam_naming_the_animals._Etching._Wellcome_V0034186.jpg"
	/>

	<p>
		Let's think about what this means... Out of multiplicity of created living beings in the garden,
		he needed to find names for them, meaning separate them into categories of beings. Looking at a
		gray wolf, an arctic wolf, a Persian cat and a Bengal tiger there had to be some unifying aspect
		of the category of cat, and wolf, and logically an aspect separating categories.
	</p>

	<BlogImage
		hide={hideImages}
		title="Felidae family (Cats)"
		src="https://github.com/user-attachments/assets/27e43c48-5e28-40ec-8754-cf4317840676"
	/>

	<p>
		The mechanism that allows humans to perform such classification, even at a very young age is
		quite miraculous, especially considering how difficult this problem is in image recognition and
		spatial computing in comparison.
	</p>

	<BlogImage
		class="max-w-[25rem] mx-auto"
		hide={hideImages}
		title="Drawing of a 3 year-old"
		src="https://github.com/user-attachments/assets/039ee0eb-12eb-4a4d-af9b-d40556597f7e"
	/>

	<p>
		This capacity to see at the core of a being extends to non-living things as well. Jonathan's
		favorite example is a chair or a cup. While there could be a countless variations of a cup, we
		have a solid understanding of how a cup looks like. Even if we're presented in a new type of cup
		we've never seen before, like a medeival ordained goblet, it takes a fraction of a second for it
		to fall into our neat cup drawer in the mind.
	</p>

	<BlogImage
		hide={hideImages}
		title="Different types of cups"
		src="https://github.com/user-attachments/assets/1d3aa96e-2946-4994-be30-8ac04026195f"
	/>

	<p>
		There are also bordering but distinct categories, like it is pretty obvious for us when it's a
		bottle and not a cup. So if we look at a cup and break it up into peices, and do the same with a
		bottle - likely there will be quite a few overlapping pieces and components. So if we try to
		gather all of the common components of a cup and a bottle it could be a category of it's own, as
		adding any extra peice will necessarily tilt it over into either cup or bottle side. Important
		distinction that this category of an object is unlikely to be very functional, and like Dr.
		Peterson sucessfuly argues, we do seem to percieve function first. A cup is something you drink
		out of and can easily grab, a bottle is something you can also easily grab and drink out of, but
		it's main purpose is to hold liquids and not spill them.
	</p>

	<h3 class="text-3xl font-semibold text-center">Attention</h3>

	<p>
		This brings out to how we attend to things. We are surrounded by infinite complexity. Every
		single object is infinitely complex, it necessarily consists of components on, in a sense, lower
		level of being or purpose. Modern technology is the most obvious example. Every device has
		nested layers of complex components - screens consist of millions of pixel, each pixel
		consisting of 3 subpixels, driven by tiny wires and transistors, connected to dedicated graphics
		chip, that itself consists of smaller parts and talks to CPU, which itelf consists of smaller
		parts like a clock, millions of gates and software to enable all of it to work together, which
		itelf is layered from machine code, to drivers, operating systems and so on...
	</p>

	<p>
		And living beings are even more complex and incredible, from simplest cells, to organs, and full
		functioning and self-healing and replicating organisms. And it extends to cosmos just as well,
		from planets to planetary systems, galaxies and, as current popular culture desparately wants to
		convince us, even multiple universes.
	</p>

	<iframe
		class="mx-auto"
		width="560"
		height="315"
		src="https://www.youtube-nocookie.com/embed/uaGEjrADGPA?mute=1"
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
	<a class="text-base underline mx-auto" href="https://htwins.net/scale2/" target="_blank">
		Scale of Universe (interactive demo)
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
		allows us to do the same, to look directly at the core of the forms.
	</p>

	<h3 class="text-3xl font-semibold text-center">Logoi</h3>
	<p>TODO: What we see, example of the christmas tree</p>

	<h3 class="text-3xl font-semibold text-center">Unity and Multiplicity</h3>
	<p>TODO: Logoi as binding purpose for things, scaled up and scaled down versions</p>

	<h3 class="text-3xl font-semibold text-center">Visible and Invisible</h3>
	<p>
		TODO: Quote the Nicene Creed, introduce two categories of visible and invisible (Earth and
		Heaven, Body and Spirit) as the most generic categories, Man as a joining and focal point at
		which all purposes/logoi make sense
	</p>

	<h3 class="text-3xl font-semibold text-center">Prayer as seeking attention and memory</h3>
	<p>TODO: Quote the Liturgy of Sr. John Chrysostom</p>
	<p>Prayer before communion <i>...Remember me, O Lord in Thy Kingdom.</i></p>

	<h3 class="text-3xl font-semibold text-center">Symbolos vs Diabolos</h3>
	<p>
		Symbols - shows united purposes, like memory pointers, gathers multiplicity into unity (dust to
		being)
	</p>
	<p>
		Diabolos - the opposite, splitting away, disunion and failiure to recognize and point to the
		purpose
	</p>

	<h3 class="text-3xl font-semibold text-center">Summary</h3>
	<p class="mx-auto">
		Purpose of worship, relational aspect of being and incarnation (Son being a perfect Symbol of
		the Father and Trinity infinitely pointing to itself)
	</p>

	<br />
	<div class="text-center">
		<p class="relative right-2.5">In Christ</p>

		<a href="/v" title="Vlad Kolbaia" class="text-2xl font-serif">V</a>
	</div>
</article>
