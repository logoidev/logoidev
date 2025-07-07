<script context="module" lang="ts">
	export type Message = {
		text: string;
		imageUrl?: string | null;
		author: string;
		note?: string;
		timestamp?: string;
		type: 'user' | 'agent';
	};
</script>

<script lang="ts">
	import BlogImage from 'src/components/BlogImage.svelte';
	import { cn } from '../../lib/utility/cn';
	import { parse as markdownToHtml } from 'marked';

	export let message: Message;
</script>

<div class="flex flex-col text-sm">
	<article class="w-full focus-visible:outline-2 focus-visible:outline-offset-2" dir="auto">
		<h5 class="sr-only">{message.author} said:</h5>
		<div class="m-auto text-base py-4 px-3 sm:px-6">
			<div
				class="mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl w-full"
			>
				<div
					class={cn('relative flex w-full min-w-0 flex-col px-0 sm:px-1.5 md:px-4', {
						'items-start': message.type === 'agent',
						'items-end': message.type === 'user'
					})}
				>
					<div class="flex-col gap-1 md:gap-3 w-full">
						<div class="flex max-w-full flex-col flex-grow">
							<div
								dir="auto"
								class="min-h-8 text-message relative flex w-full flex-col gap-2 whitespace-normal break-words text-start"
							>
								<div
									class={cn('flex w-full flex-col gap-1', {
										'items-start': message.type === 'agent',
										'items-end': message.type === 'user'
									})}
								>
									{#if message.note}
										<div
											class="border border-gray-300 rounded-md py-2 pr-4 pl-1 text-sm italic mb-2 text-center"
										>
											<span class="text-xs">NOTE:</span>
											{message.note}
										</div>
									{/if}

									{#if message.imageUrl}
										<div
											class={cn('flex w-full flex-row items-center gap-1', {
												'justify-start': message.type === 'agent',
												'justify-end': message.type === 'user'
											})}
										>
											<div class="overflow-hidden rounded-lg w-full h-full max-h-96 max-w-64">
												<div
													class="relative flex h-auto w-full max-w-lg items-center justify-center overflow-hidden"
												>
													<button
														type="button"
														aria-haspopup="dialog"
														aria-expanded="false"
														class="overflow-hidden rounded-lg w-full h-full max-h-96 max-w-64"
													>
														<BlogImage
															alt="Uploaded image"
															class="object-cover object-center overflow-hidden rounded-lg h-full max-h-96 max-w-64 w-fit transition-opacity duration-300 opacity-100"
															src={message.imageUrl}
														/>
													</button>
												</div>
											</div>
										</div>
									{/if}

									<div
										class={cn(
											'message-md relative max-w-full rounded-3xl px-2 sm:px-5 py-2.5 [&>*]:pb-2 [&>*]:indent-0 [&>*]:leading-7 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-4 [&>*:first-child]:py-0 [&>*:last-child]:py-0 [&>ul]:list-disc [&>ul]:pl-[0.75em] [&>ul]:ml-[0.75em] [&>ul_li]:mb-2 [&>ol]:list-decimal [&>ol]:pl-[0.75em] [&>ol]:ml-[0.75em] [&>ol_li]:mb-2 [&>h2]:text-2xl [&_a]:!text-blue-400 [&_a]:break-all',
											{
												'rounded-tl-lg': message.imageUrl && message.type === 'agent',
												'rounded-tr-lg': message.imageUrl && message.type === 'user',
												'bg-[hsla(0,0%,91%,.5)] max-w-[75%] text-left [&>*]:pl-3 [&>*]:pr-1.5':
													message.type === 'user'
											}
										)}
									>
										{@html markdownToHtml(message.text)}
									</div>
								</div>
							</div>
							{#if message.timestamp}
								<div
									class={cn('hidden my-2 flex-row gap-1 text-xs', {
										'justify-start': message.type === 'agent',
										'justify-end': message.type === 'user'
									})}
								>
									<span>{new Date(message.timestamp).toLocaleString()}</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</article>
</div>
