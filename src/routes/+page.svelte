<script lang="ts">
	import Map from '$lib/Map.svelte';
	import { onMount } from 'svelte';

	import type { PageData } from './$types';
	export let data: PageData;

	const { avatar_url } = data.user;
	console.log(avatar_url);

	let gameMap: Map;
	let x = 0;
	let y = 0;
	let w = 0;
	let h = 0;

	let tile_size = 40;

	onMount(function () {
		handleResize();
		window.addEventListener('resize', handleResize, true);
		return function () {
			window.removeEventListener('resize', handleResize, true);
		};
	});

	function handleResize() {
		w = Math.floor(window.innerWidth / tile_size);
		h = Math.floor(window.innerHeight / tile_size);
	}
</script>

<svelte:head>
	<title>x0y0</title>
</svelte:head>

<div class="float">
	<a href="https://github.com/settings/connections/applications/{data.GITHUB_CLIENT_ID}">
		GitHub Tokens
	</a>
</div>
<div id="game" class="col w-fill h-fill">
	<Map bind:this={gameMap} {avatar_url} {x} {y} {w} {h} {tile_size} />
</div>

<style>
	#game {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
		width: 100%;
		height: 100%;
	}

	.float {
		z-index: 10;
		position: absolute;
		top: 0;
		right: 0;
	}
</style>
