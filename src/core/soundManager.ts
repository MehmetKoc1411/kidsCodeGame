type SoundType = 'STEP' | 'STAR' | 'WIN' | 'FAIL';

class SoundManager {
  private static instance: SoundManager;

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public async play(type: SoundType) {
    // Native modül hatası vermemesi için şimdilik sessiz çalıştırıyoruz
    // console.log(`[Sound] ${type}`);
  }
}

export const sounds = SoundManager.getInstance();