import * as Haptics from 'expo-haptics';

class HapticManager {
  private static instance: HapticManager;

  private constructor() {}

  public static getInstance(): HapticManager {
    if (!HapticManager.instance) {
      HapticManager.instance = new HapticManager();
    }
    return HapticManager.instance;
  }

  // Blok bırakıldığında veya butona basıldığında hafif tık
  public triggerDrop() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }

  // Yıldız toplandığında orta seviye titreşim
  public triggerStar() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  }

  // Zafer kazanıldığında başarı titreşimi
  public triggerSuccess() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  }

  // Duvara çarpıldığında sert hata uyarısı
  public triggerError() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  }
}

export const haptics = HapticManager.getInstance();