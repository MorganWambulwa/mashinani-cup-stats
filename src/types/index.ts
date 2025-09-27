export interface Player {
  manager: string;
  totalPoints: number;
  transferPoints: number;
  netPoints: number;
  wins: number;
  gameweekHistory: GameweekData[];
  amountPaid: number;
  gameweeksPaid: number;
}

export interface GameweekData {
  gameweek: number;
  points: number;
  transferPoints: number;
  netPoints: number;
}

export interface GameweekWinner {
  gameweek: number;
  manager: string;
  netPoints: number;
}