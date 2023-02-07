<script lang="ts">
	import PlayerImage from '$lib/images/chase.png';

	import { Entity } from '$lib/Entity';

	import { onMount } from 'svelte';

	export let x = 0;
	export let y = 0;
	export let w = 0;
	export let h = 0;

	export let tile_size = 0;

	let gameMap: HTMLDivElement;

	let entitySet = new Set<Entity>();
	let pointer: Entity;
	let player: Entity;

	onMount(function () {
		pointer = createEntity();
		pointer.el.style.setProperty('background-color', '#00FFFF55');
		pointer.index = 1;

		player = createEntity();
		player.el.style.setProperty('background-image', `url(${PlayerImage})`);

		gameMap.addEventListener('mousemove', updatePointer);
		gameMap.addEventListener('mousedown', commandMove);
		return function () {
			gameMap.removeEventListener('mousemove', updatePointer);
			gameMap.removeEventListener('mousedown', commandMove);
		};
	});

	function updatePointer(event: MouseEvent) {
		const { lx, ly } = clampGlobalToLocal(event.x, event.y);
		pointer.x = lx;
		pointer.y = ly;
		updateEntity(pointer);
	}

	function commandMove(event: MouseEvent) {
		player.x = pointer.x;
		player.y = pointer.y;
		updateEntity(player);
	}

	function clampGlobalToLocal(gx: number, gy: number) {
		return {
			lx: Math.floor((gx - x) / tile_size),
			ly: Math.floor((gy - y) / tile_size)
		};
	}
	function convertLocalToGlobal(lx: number, ly: number) {
		return { gx: lx * tile_size + x, gy: ly * tile_size + y };
	}

	export function createEntity() {
		const entity = new Entity();
		entitySet.add(entity);
		gameMap.append(entity.el);
		return entity;
	}
	export function updateEntity(entity: Entity) {
		if (entity.x < 0 || entity.x > w || entity.y < 0 || entity.y > h) {
			entity.el.style.setProperty('display', 'none');
		} else {
			entity.el.style.removeProperty('display');
		}
	}
	export function deleteEntity(entity: Entity) {
		entitySet.delete(entity);
		entity.el.remove();
	}
	export function refreshEntities() {
		for (const entity of entitySet) {
			updateEntity(entity);
		}
	}
	$: if (w & h) refreshEntities();
</script>

<div id="map" bind:this={gameMap} style={`width:${w * tile_size}px;height:${h * tile_size}px;`} />

<style>
	#map {
		position: absolute;
	}
</style>
