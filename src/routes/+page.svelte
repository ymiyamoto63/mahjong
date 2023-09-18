<script lang="ts">
	import InputResult from '$lib/InputResult.svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { Gathering, RegisteredGathering } from '$lib/types';

	let genten: number = 25000;
	let kaeshi: number = 30000;
	let uma1: number = 20;
	let uma2: number = 10;
	let player1: string = '宮本';
	let player2: string;
	let player3: string;
	let player4: string;
	let registeredGathering: RegisteredGathering; // 登録された会（会は複数ゲームのまとまり）
	let isRegistered = false;
	let results = []; // 結果リスト

	const registGathering = async () => {
		const players = [player1, player2, player3, player4];
		const playerSet = new Set<string>(players);

		if (players.length !== playerSet.size) {
			alert('プレイヤー名が重複しています。');
			return;
		}

		try {
			const newGathering: Gathering = {
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
			// console.log(data);
			registeredGathering = data[0];
			isRegistered = true;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	};

	function addResult(event) {
		results = [...results, event.detail];
	}
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
	<div>
		{#if registeredGathering}
			<InputResult {...registeredGathering} on:customEvent={addResult} />
		{/if}
	</div>
	<div>
		{#if results.length > 0}
			<table>
				<thead>
					{#if registeredGathering}
						<tr>
							<th>半荘数</th>
							<th>{registeredGathering.player1}</th>
							<th>{registeredGathering.player2}</th>
							<th>{registeredGathering.player3}</th>
							<th>{registeredGathering.player4}</th>
						</tr>
					{/if}
				</thead>
				<tbody>
					{#each results as result}
						<tr>
							<td>{result.game_count}</td>
							<td>{result.player1_point}</td>
							<td>{result.player2_point}</td>
							<td>{result.player3_point}</td>
							<td>{result.player4_point}</td>
						</tr>
					{/each}
					<tr id="total-point">
						<td>合計</td>
						<td>{results.reduce((sum, x) => sum + x.player1_point, 0)}</td>
						<td>{results.reduce((sum, x) => sum + x.player2_point, 0)}</td>
						<td>{results.reduce((sum, x) => sum + x.player3_point, 0)}</td>
						<td>{results.reduce((sum, x) => sum + x.player4_point, 0)}</td>
					</tr>
				</tbody>
			</table>
		{/if}
	</div>
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
	th,
	td {
		border: solid 1px; /* 枠線指定 */
		padding: 10px; /* 余白指定 */
	}

	table {
		border-collapse: collapse; /* セルの線を重ねる */
		margin: 10px 10px;
	}

	#total-point {
		background-color: aqua;
	}
</style>
