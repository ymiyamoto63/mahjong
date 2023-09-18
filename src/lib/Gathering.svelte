<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import type { GatheringType } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let genten: number = 25000;
	let kaeshi: number = 30000;
	let uma1: number = 20;
	let uma2: number = 10;
	let player1: string = '宮本';
	let player2: string;
	let player3: string;
	let player4: string;
	let isRegistered = false;

	const registGathering = async () => {
		const players = [player1, player2, player3, player4];
		const playerSet = new Set<string>(players);

		if (players.length !== playerSet.size) {
			alert('プレイヤー名が重複しています。');
			return;
		}

		try {
			const newGathering: GatheringType = {
				genten,
				kaeshi,
				uma1,
				uma2,
				player1,
				player2,
				player3,
				player4
			};
			const { data, error } = await supabase.from('gatherings').insert(newGathering).select();
			// registeredGathering = data[0];
			dispatch('registGathering', data[0]);
			isRegistered = true;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	};
</script>

<form>
	<div>
		<label
			>原点
			<input type="number" disabled={isRegistered} bind:value={genten} class="middle" />
		</label>
		<label
			>返し
			<input type="number" disabled={isRegistered} bind:value={kaeshi} class="middle" />
		</label>
		<label
			>ウマ1位
			<input type="number" disabled={isRegistered} bind:value={uma1} class="short" />
		</label>
		<label
			>ウマ2位
			<input type="number" disabled={isRegistered} bind:value={uma2} class="short" />
		</label>
	</div>
	<div>
		<label
			>player1:
			<input disabled={isRegistered} bind:value={player1} class="middle" />
		</label>
	</div>
	<div>
		<label
			>player2:
			<input disabled={isRegistered} bind:value={player2} class="middle" />
		</label>
	</div>
	<div>
		<label
			>player3:
			<input disabled={isRegistered} bind:value={player3} class="middle" />
		</label>
	</div>
	<div>
		<label
			>player4:
			<input disabled={isRegistered} bind:value={player4} class="middle" />
		</label>
	</div>
	<button disabled={isRegistered} type="submit" on:click|preventDefault={registGathering}
		>開始</button
	>
</form>

<style>
	.short {
		width: 30px;
		padding: 3px 7px;
		border-radius: 5px;
		border: 1px solid #ccc;
	}
	.middle {
		width: 60px;
		padding: 3px 7px;
		border-radius: 5px;
		border: 1px solid #ccc;
	}
</style>
