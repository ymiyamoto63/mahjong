<script type="ts">
	export let pastGathering;
</script>

{#if pastGathering.results.length > 0}
	<table>
		<thead>
			{#if pastGathering}
				<tr>
					<th>半荘数</th>
					<th>{pastGathering.player1}</th>
					<th>{pastGathering.player2}</th>
					<th>{pastGathering.player3}</th>
					<th>{pastGathering.player4}</th>
				</tr>
			{/if}
		</thead>
		<tbody>
			{#each pastGathering.results as result}
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
				<td>{pastGathering.results.reduce((sum, x) => sum + x.player1_point, 0)}</td>
				<td>{pastGathering.results.reduce((sum, x) => sum + x.player2_point, 0)}</td>
				<td>{pastGathering.results.reduce((sum, x) => sum + x.player3_point, 0)}</td>
				<td>{pastGathering.results.reduce((sum, x) => sum + x.player4_point, 0)}</td>
			</tr>
		</tbody>
	</table>
{/if}

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
