<script lang="ts">
	import Gathering from '$lib/Gathering.svelte';
	import InputResult from '$lib/InputResult.svelte';

	let registeredGathering;
	let results = []; // 結果リスト

	function registGathering(event) {
		registeredGathering = event.detail;
	}

	function addResult(event) {
		results = [...results, event.detail];
	}
</script>

<div>
	<Gathering on:registGathering={registGathering} />
</div>
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

<style>
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
