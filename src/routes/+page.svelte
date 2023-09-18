<script lang="ts">
	import Gathering from '$lib/Gathering.svelte';
	import InputResult from '$lib/InputResult.svelte';
	import PastResults from '$lib/PastResults.svelte';
	import Results from '$lib/Results.svelte';
	import SelectPastGathering from '$lib/SelectPastGathering.svelte';

	let registeredGathering;
	let results = []; // 結果リスト
	let pastGathering;

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
	<InputResult {registeredGathering} on:addResult={addResult} />
</div>
<div>
	<Results {registeredGathering} {results} />
</div>
<hr />
<div>
	<SelectPastGathering
		on:setPastGathering={(event) => {
			pastGathering = event.detail;
		}}
	/>
</div>
{#if pastGathering}
	<div>
		<PastResults {pastGathering} />
	</div>
{/if}
