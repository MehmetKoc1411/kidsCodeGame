export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

export type CommandType = 'FORWARD' | 'TURN_RIGHT' | 'TURN_LEFT' | 'REPEAT';

export interface CodeBlock {
  id: string;
  type: CommandType;
  value?: number;          // REPEAT için döngü sayısı (örn: 2, 3)
  children?: CodeBlock[];  // REPEAT bloğu içindeki alt komutlar
}

export interface Position {
  x: number;
  y: number;
}

export type GameStatus = 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';

export interface LevelConfig {
  id: number;
  title: string;
  gridSize: { rows: number; cols: number };
  start: Position & { direction: Direction };
  target: Position;
  walls: Position[];
  stars: Position[];
  availableBlocks: CommandType[];
  maxBlocks?: number;
}