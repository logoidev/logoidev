<script lang="ts">
	const GITHUB_REPO_URL_BASE = 'https://github.com/logoidev/logoidev';
	const GITHUB_REPO_URL = `${GITHUB_REPO_URL_BASE}/tree/main/src/`;
	const GITHUB_LOGO_URL =
		'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg';
	export let path = '';
	$: url = GITHUB_REPO_URL + path;
</script>

<div
	class="group fixed bottom-2 right-2 bg-white opacity-50 hover:opacity-90 rounded flex items-center p-2 gap-2"
>
	<img class="w-6" alt="GitHub logo" src={GITHUB_LOGO_URL} />
	<a class="hidden group-hover:block" href={url}>View code on GitHub</a>
</div>
