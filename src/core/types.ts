export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

export type CommandType =
  | 'FORWARD'
  | 'TURN_RIGHT'
  | 'TURN_LEFT'
  | 'REPEAT'
  | 'IF_WALL';

export type GameStatus = 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';

export interface Position {
  x: number;
  y: number;
}

export interface CodeBlock {
  id: string;
  type: CommandType;
  value?: number;
  children?: CodeBlock[];
}

export interface LevelConfig {
  id: number;
  title: string;
  gridSize: { rows: number; cols: number };
  start: Position & { direction: Direction };
  target: Position;
  walls: Position[];
  stars: Position[];
  availableBlocks: CommandType[];
  maxBlocks: number;
}