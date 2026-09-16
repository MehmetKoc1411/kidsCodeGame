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

export interface TriggerPair {
  plate: Position;   // 🔘 Basınç Plakası
  barrier: Position; // 🚧 Açılacak Bariyer/Köprü
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
  doors?: Position[];
  keys?: Position[];
  portals?: PortalPair[];
  triggers?: TriggerPair[]; // 🔘 41-50 Seviyeleri için Tetikleyici Mekaniği
  availableBlocks: CommandType[];
  maxBlocks: number;
}