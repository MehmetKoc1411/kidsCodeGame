export interface TutorialHint {
  levelId: number;
  icon: string;
  titleTR: string;
  titleEN: string;
  descTR: string;
  descEN: string;
}

export const TUTORIAL_HINTS: TutorialHint[] = [
  {
    levelId: 1,
    icon: '🚀',
    titleTR: 'Hoş Geldin Küçük Kodlayıcı!',
    titleEN: 'Welcome Little Coder!',
    descTR: 'Komut paletinden "İLERİ GİT" bloğuna dokun ve robotunu bayrağa ulaştırmak için "Kodu Çalıştır"a bas!',
    descEN: 'Tap the "MOVE FORWARD" block from the palette and hit "Run Code" to guide your bot to the flag!',
  },
  {
    levelId: 11,
    icon: '🔁',
    titleTR: 'Süper Güç: Döngüler!',
    titleEN: 'Superpower: Loops!',
    descTR: 'Aynı adımı defalarca yazmak yerine "TEKRARLA" kutusunun içine koy. Robotun onu senin için tekrar etsin!',
    descEN: 'Instead of typing the same command over and over, put it inside "REPEAT". Your bot loops it for you!',
  },
  {
    levelId: 21,
    icon: '🔑',
    titleTR: 'Kilitli Kapı Uyarısı!',
    titleEN: 'Locked Door Alert!',
    descTR: 'Kapalı kapıdan geçmek için önce yerdeki altın anahtarı alman gerek. Anahtarı kap, yolu aç!',
    descEN: 'To pass the door, you must collect the gold key first. Grab the key and unlock the pathway!',
  },
  {
    levelId: 31,
    icon: '🌀',
    titleTR: 'Solucan Deliği: Portallar!',
    titleEN: 'Wormholes: Portals!',
    descTR: 'Bir portala bastığında anında diğer portaldan çıkarsın! Uzamsal sıçramayı rotanda akıllıca kullan.',
    descEN: 'Step into a portal and teleport out the other side instantly! Use spatial jumps in your route.',
  },
  {
    levelId: 41,
    icon: '🔘',
    titleTR: 'Tetikleyici: Basınç Plakası!',
    titleEN: 'Trigger: Pressure Plates!',
    descTR: 'Yoldaki kırmızı bariyer kapalı! Önce yuvarlak düğmeye basıp köprüyü açmalısın.',
    descEN: 'The red barrier is blocked! Step on the round button to open the path bridge.',
  },
  {
    levelId: 51,
    icon: '🧩',
    titleTR: 'Usta Yazılımcı: Fonksiyonlar!',
    titleEN: 'Senior Dev: Functions!',
    descTR: 'Tekrar eden komut kalıbını FONKSİYON (F1) kutusuna koy. Ana kodunda tek tıkla F1() çağırarak blok tasarrufu yap!',
    descEN: 'Bundle your recurring pattern inside FUNCTION (F1). Call F1() in your main code to save blocks!',
  },
];