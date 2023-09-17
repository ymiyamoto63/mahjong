<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	let genten: number = 25000;
	let kaeshi: number = 30000;
	let uma1: number = 20;
	let uma2: number = 10;
	let player1 = '宮本';
	let player2;
	let player3;
	let player4;
	let player1_point: number = 0;
	let player2_point: number = 0;
	let player3_point: number = 0;
	let player4_point: number = 0;
	let registeredGathering; // 登録された会（会は複数ゲームのまとまり）
	let isRegistered = false;
	let registeredResult; // 登録されたゲームの結果
	let results = []; // 結果リスト
	let gameCount = 0;

	type Gathering = {
		genten: number;
		kaeshi: number;
		uma1: number;
		uma2: number;
		player1: string;
		player2: string;
		player3: string;
		player4?: string;
	};

	const registGathering = async () => {
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

	const registResult = async () => {
		let playerPoints = [
			{ player: player1, player_point: player1_point },
			{ player: player2, player_point: player2_point },
			{ player: player3, player_point: player3_point },
			{ player: player4, player_point: player4_point }
		];

		let playerPointsDesc = playerPoints.sort((a, b) => {
			return a.player_point > b.player_point ? -1 : 1;
		});

		// 点数計算
		playerPointsDesc[1].player_point =
			Math.floor((playerPointsDesc[1].player_point - kaeshi) / 1000) + uma2;
		playerPointsDesc[2].player_point =
			Math.floor((playerPointsDesc[2].player_point - kaeshi) / 1000) - uma2;
		playerPointsDesc[3].player_point =
			Math.floor((playerPointsDesc[3].player_point - kaeshi) / 1000) - uma1;
		playerPointsDesc[0].player_point = -(
			playerPointsDesc[1].player_point +
			playerPointsDesc[2].player_point +
			playerPointsDesc[3].player_point
		);

		console.log(playerPointsDesc);

		// DB登録
		const player1Result = playerPointsDesc.find((x) => x.player === player1);
		const player2Result = playerPointsDesc.find((x) => x.player === player2);
		const player3Result = playerPointsDesc.find((x) => x.player === player3);
		const player4Result = playerPointsDesc.find((x) => x.player === player4);
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
			registeredResult = data[0];
			results = [...results, registeredResult];

			player1_point = 0;
			player2_point = 0;
			player3_point = 0;
			player4_point = 0;
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
			<input disabled={isRegistered} bind:value={genten} class="middle" />
		</label>
		<label
			>返し
			<input disabled={isRegistered} bind:value={kaeshi} class="middle" />
		</label>
		<label
			>ウマ1位
			<input disabled={isRegistered} bind:value={uma1} class="short" />
		</label>
		<label
			>ウマ2位
			<input disabled={isRegistered} bind:value={uma2} class="short" />
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
						<td> <input bind:value={player1_point} class="middle" /> </td>
						<td> <input bind:value={player2_point} class="middle" /> </td>
						<td> <input bind:value={player3_point} class="middle" /> </td>
						<td> <input bind:value={player4_point} class="middle" /> </td>
						<td> <button type="submit" on:click={registResult}>記録</button></td>
					</tr>
				</tbody>
			</table>
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
					<tr>
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
		width: 20px;
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
</style>
