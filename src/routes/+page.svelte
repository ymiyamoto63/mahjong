<script lang="ts">
	import Auth from '$lib/Auth.svelte';
	import Gathering from '$lib/Gathering.svelte';
	import InputResult from '$lib/InputResult.svelte';
	import PastResults from '$lib/PastResults.svelte';
	import Results from '$lib/Results.svelte';
	import SelectPastGathering from '$lib/SelectPastGathering.svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { AuthSession } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

	let session: AuthSession;

	onMount(() => {
		supabase.auth.getSession().then(({ data }) => {
			session = data.session;
		});

		supabase.auth.onAuthStateChange((_event, _session) => {
			session = _session;
		});
	});

	let registeredGathering;
	let results = []; // 結果リスト
	let pastGathering;

	function registGathering(event) {
		registeredGathering = event.detail;
	}

	function addResult(event) {
		results = [...results, event.detail];
	}

	function deleteCookie(name) {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	}

	async function signOut(event) {
		deleteCookie('sb-refresh-token');
		deleteCookie('sb-access-token');
		await supabase.auth.signOut();
		window.location.reload();
	}
</script>

<div class="container" style="padding: 50px 0 100px 0">
	{#if !session}
		<Auth />
	{:else}
		<button type="button" class="button block" on:click={signOut}> Sign Out </button>
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
	{/if}
</div>
