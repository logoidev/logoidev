<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { cn } from 'src/lib/utility/cn';

	const dispatch = createEventDispatcher();

	export let isExpanded = false;

	let midlineElement: HTMLDivElement;
	let email = '';
	let title = '';
	let message = '';
	let isSubmitting = false;
	let error = '';
	let success = false;

	// Scroll midline into view when expanded
	$: if (isExpanded && midlineElement) {
		// Small delay to allow expansion animation to start
		setTimeout(() => {
			midlineElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}, 100);
	}

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		error = '';
		isSubmitting = true;

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					title,
					message
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to send message');
			}

			success = true;
			// Reset form
			email = '';
			title = '';
			message = '';

			// Collapse form after 3 seconds
			setTimeout(() => {
				dispatch('collapse');
				success = false;
			}, 3000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			isSubmitting = false;
		}
	};

	const handleCancel = () => {
		// Reset form when canceling
		email = '';
		title = '';
		message = '';
		error = '';
		success = false;
		dispatch('collapse');
	};
</script>

<div class={cn('contact-form-container mb-4', $$props.class)}>
	<div class="contact-form-wrapper" class:expanded={isExpanded}>
		<form
			on:submit|preventDefault={handleSubmit}
			class="contact-form flex flex-col gap-4 max-w-md w-full px-4"
		>
			{#if success}
				<div class="text-green-700 text-center p-3 bg-green-50 rounded border border-green-200">
					✅ Message sent successfully! We'll get back to you soon.
				</div>
			{:else}
				<div class="flex justify-center my-2">
					<a
						href="/cal"
						class="text-xl inline-block border border-slate-300 py-2 px-4 rounded hover:bg-slate-200"
					>
						💬 Set up a call
					</a>
				</div>
				<div class="flex items-center gap-2 mb-2">
					<div class="flex-1 h-px bg-slate-300 ml-4"></div>
					<span class="text-base text-slate-500">or</span>
					<div class="flex-1 h-px bg-slate-300 mr-4"></div>
				</div>
				<div class="flex flex-col gap-3">
					<div>
						<label for="contact-email" class="block text-sm font-medium mb-1"> Email </label>
						<input
							id="contact-email"
							type="email"
							bind:value={email}
							required
							placeholder="your@email.com"
							class="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-300"
							disabled={isSubmitting}
						/>
					</div>

					<div>
						<label for="contact-title" class="block text-sm font-medium mb-1"> Title </label>
						<input
							id="contact-title"
							type="text"
							bind:value={title}
							required
							placeholder="How can we help you?"
							class="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-300"
							disabled={isSubmitting}
						/>
						<div bind:this={midlineElement} class="invisible pointer-events-none h-0">Midline</div>
					</div>

					<div>
						<label for="contact-message" class="block text-sm font-medium mb-1"> Message </label>
						<textarea
							id="contact-message"
							bind:value={message}
							required
							rows="5"
							placeholder="Outline your idea and we'll get back to you soon."
							class="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
							disabled={isSubmitting}
						></textarea>
					</div>
				</div>

				{#if error}
					<div class="text-red-700 text-sm p-2 bg-red-50 rounded border border-red-200">
						{error}
					</div>
				{/if}

				<div class="flex gap-2">
					<button
						type="button"
						on:click={handleCancel}
						disabled={isSubmitting}
						class="border border-slate-300 py-2 px-4 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="flex-1 border border-slate-300 py-2 px-4 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
					>
						{#if isSubmitting}
							Sending...
						{:else}
							Send
						{/if}
					</button>
				</div>
			{/if}
		</form>
	</div>
</div>

<style>
	.contact-form-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.contact-form-wrapper {
		width: 100%;
		max-height: 0;
		opacity: 0;
		transform: translateY(-10px) scale(0.98);
		overflow: hidden;
		transition:
			max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.3s ease 0.1s,
			transform 0.3s ease 0.1s;
		visibility: hidden;
		pointer-events: none;
		display: flex;
		justify-content: center;
	}

	.contact-form-wrapper.expanded {
		max-height: 800px;
		opacity: 1;
		transform: translateY(0) scale(1);
		visibility: visible;
		pointer-events: auto;
	}

	.contact-form {
		width: 100%;
	}
</style>
