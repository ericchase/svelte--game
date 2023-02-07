<script lang="ts">
	import Map from '$lib/Map.svelte';
	import { onMount } from 'svelte';

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

<div class="col w-fill h-fill">
	<Map bind:this={gameMap} {x} {y} {w} {h} {tile_size} />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>
