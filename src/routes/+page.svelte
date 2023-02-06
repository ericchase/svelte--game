<script lang="ts">
	import PlayerImage from '$lib/images/chase.png';

	import { onMount } from 'svelte';

	let player: HTMLDivElement;
	let playerX = 0;
	let playerY = 0;

	let tilePointer: HTMLDivElement;
	let tileSize = 40;
	let gameMap: HTMLDivElement;
	let gameRect: DOMRect;

	onMount(function () {
		resizeGameMap();
		gameMap.addEventListener('mousemove', showTilePointer, true);
		gameMap.addEventListener('mousedown', movePlayer, true);
		window.addEventListener('resize', resizeGameMap, true);
		return function () {
			gameMap.removeEventListener('mousemove', showTilePointer, true);
			gameMap.removeEventListener('mousedown', movePlayer, true);
			window.removeEventListener('resize', resizeGameMap, true);
		};
	});
	function clampLocalCoordinates(x: number, y: number) {
		return {
			x: Math.floor(x / tileSize) * tileSize,
			y: Math.floor(y / tileSize) * tileSize
		};
	}
	function clampGlobalCoordinates(x: number, y: number) {
		return {
			x: Math.floor((x - gameRect.x) / tileSize) * tileSize + gameRect.x,
			y: Math.floor((y - gameRect.y) / tileSize) * tileSize + gameRect.y
		};
	}
	function globalCoordinatesToLocal(x: number, y: number) {
		return { x: x - gameRect.x, y: y - gameRect.y };
	}
	function localCoordinatesToGlobal(x: number, y: number) {
		return { x: gameRect.x + x, y: gameRect.y + y };
	}
	function movePlayer(event: MouseEvent) {
		const { x, y } = globalCoordinatesToLocal(
			Number.parseInt(tilePointer.style.getPropertyValue('left')),
			Number.parseInt(tilePointer.style.getPropertyValue('top'))
		);
		playerX = x;
		playerY = y;
		drawPlayer();
	}
	function drawPlayer() {
		const { x, y } = localCoordinatesToGlobal(playerX, playerY);
		player.style.setProperty('left', x + 'px');
		player.style.setProperty('top', y + 'px');
	}
	function showTilePointer(event: MouseEvent) {
		const { x, y } = clampGlobalCoordinates(event.x, event.y);
		tilePointer.style.setProperty('left', x + 'px');
		tilePointer.style.setProperty('top', y + 'px');
	}
	function resizeGameMap() {
		const xSize = Math.floor((window.innerWidth - 300) / tileSize) * tileSize;
		const ySize = Math.floor((window.innerHeight - 300) / tileSize) * tileSize;
		gameMap.style.setProperty('width', xSize + 'px');
		gameMap.style.setProperty('flex-basis', ySize + 'px');
		gameRect = gameMap.getBoundingClientRect();
		drawPlayer();
	}
</script>

<svelte:head>
	<title>x0y0</title>
	<!-- <meta name="description" content="description text" /> -->
</svelte:head>

<div class="row fill">
	<div bind:this={tilePointer} id="tile-pointer" />
	<div bind:this={player} id="player"><img src={PlayerImage} alt="player" /></div>
	<div id="side-panel">Side Panel</div>
	<div class="col fill">
		<div bind:this={gameMap} id="game-map" />
		<div id="bottom-panel">Bottom Panel</div>
	</div>
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
	}
	.col {
		display: flex;
		flex-direction: column;
	}
	.fill {
		width: 100%;
		height: 100%;
	}

	#player {
		box-sizing: border-box;
		position: absolute;
		min-width: 40px;
		max-width: 40px;
		width: 40px;
		height: 40px;
		max-height: 40px;
		min-height: 40px;
		z-index: 1;
	}
	#tile-pointer {
		box-sizing: border-box;
		background-color: #65caedcc;
		position: absolute;
		min-width: 40px;
		max-width: 40px;
		width: 40px;
		height: 40px;
		max-height: 40px;
		min-height: 40px;
		pointer-events: none;
		z-index: 2;
	}
	#game-map {
		flex: 0 0 0;
		position: relative;
		z-index: 3;
	}
	#side-panel {
		border-right: 1px solid black;
		flex-grow: 1;
		width: 100%;
	}
	#bottom-panel {
		border-top: 1px solid black;
		flex-grow: 1;
		height: 100%;
	}
</style>
