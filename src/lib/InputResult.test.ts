import { calculatePoint } from '$lib/calculatePoint';
import { describe, expect, it } from 'vitest';

describe('calculatePoint', () => {
	it('normal pattern1', () => {
		const playerPoints = [
			{ player: 'player1', player_point: 32000 },
			{ player: 'player2', player_point: 18000 },
			{ player: 'player3', player_point: 26000 },
			{ player: 'player4', player_point: 24000 }
		];

		const registeredGathering = {
			id: crypto.randomUUID(),
			created_at: new Date(),
			genten: 25000,
			kaeshi: 30000,
			uma1: 20,
			uma2: 10,
			player1: 'player1',
			player2: 'player2',
			player3: 'player3',
			player4: 'player4'
		};

		const actual = calculatePoint(playerPoints, registeredGathering);

		const expected = [
			{ player: 'player1', player_point: 42 },
			{ player: 'player3', player_point: 6 },
			{ player: 'player4', player_point: -16 },
			{ player: 'player2', player_point: -32 }
		];
		expect(actual).toEqual(expected);
	});
});

describe('calculatePoint', () => {
	it('normal pattern2', () => {
		const playerPoints = [
			{ player: 'player1', player_point: 19200 },
			{ player: 'player2', player_point: -2800 },
			{ player: 'player3', player_point: 26500 },
			{ player: 'player4', player_point: 57100 }
		];

		const registeredGathering = {
			id: crypto.randomUUID(),
			created_at: new Date(),
			genten: 25000,
			kaeshi: 30000,
			uma1: 20,
			uma2: 10,
			player1: 'player1',
			player2: 'player2',
			player3: 'player3',
			player4: 'player4'
		};

		const actual = calculatePoint(playerPoints, registeredGathering);

		const expected = [
			{ player: 'player4', player_point: 68 },
			{ player: 'player3', player_point: 6 },
			{ player: 'player1', player_point: -21 },
			{ player: 'player2', player_point: -53 }
		];
		expect(actual).toEqual(expected);
	});
});
