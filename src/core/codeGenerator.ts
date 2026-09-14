import { CodeBlock } from './types';

export type TargetLanguage = 'javascript' | 'python';

export const generateCodeFromBlocks = (
  blocks: CodeBlock[],
  language: TargetLanguage = 'javascript',
  indent: string = '  '
): string => {
  if (blocks.length === 0) {
    return language === 'javascript'
      ? '// Komut dizilimi bekleniyor...\n// Blokları buraya sürükleyin.'
      : '# Komut dizilimi bekleniyor...\n# Bloklari buraya surukleyin.';
  }

  const parseBlocks = (items: CodeBlock[], level: number): string[] => {
    const lines: string[] = [];
    const prefix = indent.repeat(level);

    items.forEach((b) => {
      if (b.type === 'FORWARD') {
        lines.push(`${prefix}bot.forward()${language === 'javascript' ? ';' : ''}`);
      } else if (b.type === 'TURN_RIGHT') {
        lines.push(`${prefix}bot.turnRight()${language === 'javascript' ? ';' : ''}`);
      } else if (b.type === 'TURN_LEFT') {
        lines.push(`${prefix}bot.turnLeft()${language === 'javascript' ? ';' : ''}`);
      } else if (b.type === 'REPEAT') {
        const count = b.value || 3;
        if (language === 'javascript') {
          lines.push(`${prefix}for (let i = 0; i < ${count}; i++) {`);
          if (b.children && b.children.length > 0) {
            lines.push(...parseBlocks(b.children, level + 1));
          } else {
            lines.push(`${prefix}${indent}// Komut yok`);
          }
          lines.push(`${prefix}}`);
        } else {
          lines.push(`${prefix}for i in range(${count}):`);
          if (b.children && b.children.length > 0) {
            lines.push(...parseBlocks(b.children, level + 1));
          } else {
            lines.push(`${prefix}${indent}pass`);
          }
        }
      } else if (b.type === 'IF_WALL') {
        if (language === 'javascript') {
          lines.push(`${prefix}if (bot.isWallAhead()) {`);
          if (b.children && b.children.length > 0) {
            lines.push(...parseBlocks(b.children, level + 1));
          } else {
            lines.push(`${prefix}${indent}// Komut yok`);
          }
          lines.push(`${prefix}}`);
        } else {
          lines.push(`${prefix}if bot.is_wall_ahead():`);
          if (b.children && b.children.length > 0) {
            lines.push(...parseBlocks(b.children, level + 1));
          } else {
            lines.push(`${prefix}${indent}pass`);
          }
        }
      }
    });

    return lines;
  };

  return parseBlocks(blocks, 0).join('\n');
};