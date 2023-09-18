import type { PlayerPoint, RegisteredGathering } from './types';

export const calculatePoint = (
	playerPoints: PlayerPoint[],
	registeredGathering: RegisteredGathering
): PlayerPoint[] => {
	// 点数の降順にソート
	const playerPointsDesc = playerPoints.sort((a, b) => {
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
};
