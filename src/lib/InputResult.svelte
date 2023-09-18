<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import type { PlayerPoint } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let registeredGathering;

	let player1_point: number = 0;
	let player2_point: number = 0;
	let player3_point: number = 0;
	let player4_point: number = 0;
	let gameCount: number = 0;

	function calculatePoint(playerPoints: PlayerPoint[]): PlayerPoint[] {
		// 点数の降順にソート
		let playerPointsDesc = playerPoints.sort((a, b) => {
			return a.player_point > b.player_point ? -1 : 1;
		});

		// 点数計算
		playerPointsDesc[1].player_point =
			Math.floor((playerPointsDesc[1].player_point - registeredGathering.kaeshi) / 1000) +
			registeredGathering.uma2;
		playerPointsDesc[2].player_point =
			Math.floor((playerPointsDesc[2].player_point - registeredGathering.kaeshi) / 1000) -
			registeredGathering.uma2;
		playerPointsDesc[3].player_point =
			Math.floor((playerPointsDesc[3].player_point - registeredGathering.kaeshi) / 1000) -
			registeredGathering.uma1;
		playerPointsDesc[0].player_point = -(
			playerPointsDesc[1].player_point +
			playerPointsDesc[2].player_point +
			playerPointsDesc[3].player_point
		);

		return playerPointsDesc;
	}

	const registResult = async () => {
		let playerPoints: PlayerPoint[] = [
			{ player: registeredGathering.player1, player_point: player1_point },
			{ player: registeredGathering.player2, player_point: player2_point },
			{ player: registeredGathering.player3, player_point: player3_point },
			{ player: registeredGathering.player4, player_point: player4_point }
		];

		console.log(playerPoints);

		const totalPoint: number = playerPoints.reduce(
			(sum: number, x: PlayerPoint) => sum + x.player_point,
			0
		);
		if (totalPoint !== registeredGathering.genten * 4) {
			alert(
				`合計値が ${totalPoint} になっています。合計値は ${
					registeredGathering.genten * 4
				} 点である必要があります。`
			);
			return;
		}

		// 重複チェック関数
		function hasDuplicatePlayerPoint(playerPoints: PlayerPoint[]): boolean {
			const playerPointSet = new Set<number>();
			for (const point of playerPoints) {
				if (playerPointSet.has(point.player_point)) {
					return true; // 重複が見つかった場合
				}
				playerPointSet.add(point.player_point);
			}
			return false; // 重複が見つからなかった場合
		}

		if (hasDuplicatePlayerPoint(playerPoints)) {
			alert('同点のプレイヤーが存在します。着順確定のため、点差をつけてください。');
			return;
		}

		// TODO: 5捨6入

		const playerPointsDesc: PlayerPoint[] = calculatePoint(playerPoints);

		console.log(playerPointsDesc);

		// DB登録
		const player1Result = playerPointsDesc.find((x) => x.player === registeredGathering.player1);
		const player2Result = playerPointsDesc.find((x) => x.player === registeredGathering.player2);
		const player3Result = playerPointsDesc.find((x) => x.player === registeredGathering.player3);
		const player4Result = playerPointsDesc.find((x) => x.player === registeredGathering.player4);
		gameCount++;

		try {
			const newResult = {
				gathering_id: registeredGathering.id,
				game_count: gameCount,
				player1_point: player1Result.player_point,
				player2_point: player2Result.player_point,
				player3_point: player3Result.player_point,
				player4_point: player4Result.player_point
			};

			const { data, error } = await supabase.from('results').insert(newResult).select();
			dispatch('addResult', data[0]);

			// player1_point = 0;
			// player2_point = 0;
			// player3_point = 0;
			// player4_point = 0;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	};
</script>

{#if registeredGathering}
	<table>
		<thead>
			<tr>
				<th>{registeredGathering.player1}</th>
				<th>{registeredGathering.player2}</th>
				<th>{registeredGathering.player3}</th>
				<th>{registeredGathering.player4}</th>
				<th />
			</tr>
		</thead>
		<tbody>
			<tr>
				<td> <input type="number" bind:value={player1_point} class="middle" /> </td>
				<td> <input type="number" bind:value={player2_point} class="middle" /> </td>
				<td> <input type="number" bind:value={player3_point} class="middle" /> </td>
				<td> <input type="number" bind:value={player4_point} class="middle" /> </td>
				<td> <button type="submit" on:click={registResult}>記録</button></td>
			</tr>
		</tbody>
	</table>
{/if}

<style>
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
</style>
