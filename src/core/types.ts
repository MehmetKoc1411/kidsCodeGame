export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

export type CommandType =
  | 'FORWARD'
  | 'TURN_RIGHT'
  | 'TURN_LEFT'
  | 'REPEAT'
  | 'IF_WALL'
  | 'FUNCTION'
  | 'CALL_FUNCTION';

export type GameStatus = 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';

export interface Position {
  x: number;
  y: number;
}

export interface PortalPair {
  entry: Position;
  exit: Position;
}

export interface TriggerPair {
  plate: Position;
  barrier: Position;
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
  triggers?: TriggerPair[];
  availableBlocks: CommandType[];
  maxBlocks: number;
}