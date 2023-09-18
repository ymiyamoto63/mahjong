<script type="ts">
	import { supabase } from '$lib/supabaseClient';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	let pastGatherings;
	let selected;

	onMount(async () => {
		const fetchPastGatherings = async () => {
			try {
				const { data, error } = await supabase
					.from('gatherings')
					.select(
						`id,created_at,genten,kaeshi,uma1,uma2,player1,player2,player3,player4,results(game_count,player1_point,player2_point,player3_point,player4_point)`
					)
					.order('created_at', { ascending: false });
				// console.log(data);
				return data;
			} catch (error) {
				if (error instanceof Error) {
					alert(error.message);
				}
			}
		};

		pastGatherings = await fetchPastGatherings();
	});

	const handleChange = () => {
		dispatch(
			'setPastGathering',
			pastGatherings.find((x) => x.id === selected)
		);
	};
</script>

{#if pastGatherings}
	<label
		>過去データを参照
		<select bind:value={selected} on:change={handleChange}>
			{#each pastGatherings as gathering}
				<option value={gathering.id}>{gathering.created_at}</option>
			{/each}
		</select>
	</label>
{/if}

<!-- <form on:submit|preventDefault={handleSubmit}>
	<select bind:value={selected} on:change={() => (answer = '')}>
		{#each questions as question}
			<option value={question}>
				{question.text}
			</option>
		{/each}
	</select>

	<input bind:value={answer} />

	<button disabled={!answer} type="submit"> Submit </button>
</form> -->
