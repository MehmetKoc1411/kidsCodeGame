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

export interface PortalPair {
  entry: Position; // 🌀 Portal A
  exit: Position;  // 🌀 Portal B
}

export interface CodeBlock {
  id: string;
  type: CommandType;
  value?: number; // REPEAT döngü sayısı için
  children?: CodeBlock[]; // İç içe komutlar için (REPEAT veya IF)
}

export interface LevelConfig {
  id: number;
  title: string;
  gridSize: { rows: number; cols: number };
  start: Position & { direction: Direction };
  target: Position;
  walls: Position[];
  stars: Position[];
  doors?: Position[];
  keys?: Position[];
  portals?: PortalPair[]; // 🌀 31-40 Seviyeleri için Portal Mekaniği
  availableBlocks: CommandType[];
  maxBlocks: number;
}