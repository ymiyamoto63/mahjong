export type Gathering = {
	genten: number;
	kaeshi: number;
	uma1: number;
	uma2: number;
	player1: string;
	player2: string;
	player3: string;
	player4: string;
};

export type RegisteredGathering = {
	id: string;
	created_at: Date;
	genten: number;
	kaeshi: number;
	uma1: number;
	uma2: number;
	player1: string;
	player2: string;
	player3: string;
	player4: string;
};

export type PlayerPoint = {
	player: string;
	player_point: number;
};
