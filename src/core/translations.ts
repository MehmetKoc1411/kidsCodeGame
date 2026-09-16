export type Language = 'tr' | 'en';

export interface TranslationStrings {
  levelPrefix: string;
  runCode: string;
  running: string; // <-- EKLENDİ
  stepNext: string;
  reset: string;
  clear: string;
  blocksLeft: string;
  availablePalette: string;
  workspaceTitle: string;
  emptyWorkspaceHint: string;
  cmdForward: string;
  cmdTurnRight: string;
  cmdTurnLeft: string;
  cmdRepeat: string;
  cmdIfWall: string;
  cmdFunction: string;
  cmdCallFunction: string;
  addChildHint: string;
  victoryTitle: string;
  victoryDesc: string;
  nextLevel: string;
  replay: string;
  shopTitle: string;
  achievementsTitle: string;
  themeTitle: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  tr: {
    levelPrefix: 'Bölüm',
    runCode: 'Kodu Çalıştır',
    running: 'Çalışıyor...', // <-- EKLENDİ
    stepNext: 'Adım At',
    reset: 'Sıfırla',
    clear: 'Temizle',
    blocksLeft: 'Kalan Blok Sınırı',
    availablePalette: 'Komut Paleti',
    workspaceTitle: 'Algoritma Alanı',
    emptyWorkspaceHint: 'Aşağıdaki komut paletinden blok ekleyerek kodunuzu yazın.',
    cmdForward: 'İLERİ GİT',
    cmdTurnRight: 'SAĞA DÖN',
    cmdTurnLeft: 'SOLA DÖN',
    cmdRepeat: 'TEKRARLA (Döngü)',
    cmdIfWall: 'EĞER ÖNÜNDE DUVAR VARSA',
    cmdFunction: 'FONKSİYON (F1)',
    cmdCallFunction: 'ÇALIŞTIR: F1()',
    addChildHint: '+ İçine Komut Ekle',
    victoryTitle: 'Harika İş Çıkardın!',
    victoryDesc: 'Bölümü başarıyla tamamladın.',
    nextLevel: 'Sonraki Bölüm',
    replay: 'Yeniden Oyna',
    shopTitle: 'Karakter Mağazası',
    achievementsTitle: 'Başarımlar & Rozetler',
    themeTitle: 'Zemin Teması',
  },
  en: {
    levelPrefix: 'Level',
    runCode: 'Run Code',
    running: 'Running...', // <-- EKLENDİ
    stepNext: 'Step Forward',
    reset: 'Reset',
    clear: 'Clear',
    blocksLeft: 'Blocks Left',
    availablePalette: 'Command Palette',
    workspaceTitle: 'Workspace',
    emptyWorkspaceHint: 'Tap blocks from the palette below to build your algorithm.',
    cmdForward: 'MOVE FORWARD',
    cmdTurnRight: 'TURN RIGHT',
    cmdTurnLeft: 'TURN LEFT',
    cmdRepeat: 'REPEAT (Loop)',
    cmdIfWall: 'IF WALL AHEAD',
    cmdFunction: 'FUNCTION (F1)',
    cmdCallFunction: 'CALL: F1()',
    addChildHint: '+ Add Child Block',
    victoryTitle: 'Awesome Job!',
    victoryDesc: 'You solved this puzzle successfully.',
    nextLevel: 'Next Level',
    replay: 'Play Again',
    shopTitle: 'Character Shop',
    achievementsTitle: 'Achievements',
    themeTitle: 'Grid Theme',
  },
};