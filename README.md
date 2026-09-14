# 🤖 KidsCode - Çocuklar İçin Görsel Kodlama Oyunu

Çocuklara temel algoritma mantığını, yön kavramlarını ve döngü (loop) prensiplerini öğretmek amacıyla geliştirilmiş açık kaynaklı mobil kodlama platformu.

## ✨ Öne Çıkan Özellikler

- **Görsel Komut Blokları:** İleri git, sağa/sola dön ve döngü (loop) blokları.
- **Sürükle & Bırak Mimarisi:** `react-native-gesture-handler` ve `react-native-reanimated` ile 60 FPS akıcı parmak takibi.
- **Interpreter Motoru (AST Parsing):** Kullanıcının dizdiği komut ağacını adım adım çözümleyen ve yürütülen bloğu arayüzde eşzamanlı parlatarak takip ettiren yorumlayıcı.
- **Seviye ve Görev Sistemi:** Artan zorluk derecesi, engeller, toplanabilir yıldızlar ve hedef koordinat kontrolleri.

## 🛠️ Kullanılan Teknolojiler

- **Çatı:** React Native (Expo)
- **Dil:** TypeScript
- **Durum Yönetimi:** Zustand
- **Jest ve Animasyon:** React Native Reanimated, Gesture Handler
- **İkonografi:** @expo/vector-icons

## 🚀 Kurulum

```bash
git clone https://github.com/MehmetKoc1411/kidsCodeGame.git

cd kids-code-game
npm install
npx expo start