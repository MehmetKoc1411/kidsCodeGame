export interface CharacterSkin {
  id: string;
  name: string;
  icon: string;
  price: number;
  description: string;
}

export const CHARACTER_SKINS: CharacterSkin[] = [
  {
    id: 'ROBOT',
    name: 'Robo',
    icon: '🤖',
    price: 0,
    description: 'Sadık kodlama yardımcın.',
  },
  {
    id: 'CAT',
    name: 'Mimi',
    icon: '🐱',
    price: 10,
    description: 'Meraklı siber kedi.',
  },
  {
    id: 'DOG',
    name: 'Barky',
    icon: '🐶',
    price: 25,
    description: 'Hızlı ve dikkatli kod avcısı.',
  },
  {
    id: 'UFO',
    name: 'UFO',
    icon: '🛸',
    price: 40,
    description: 'Galaksiler arası keşif aracı.',
  },
];