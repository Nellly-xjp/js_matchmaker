// ============================================================
//  Глобальне сховище даних + алгоритм підбору пари
// ============================================================

export type Interest =
  | 'Подорожі' | 'Спорт' | 'Кіно' | 'Музика' | 'Кулінарія'
  | 'Читання' | 'Природа' | 'Мистецтво' | 'Технології' | 'Танці';

export const ALL_INTERESTS: Interest[] = [
  'Подорожі', 'Спорт', 'Кіно', 'Музика', 'Кулінарія',
  'Читання', 'Природа', 'Мистецтво', 'Технології', 'Танці',
];

export type Gender = 'Чоловік' | 'Жінка';
export type LookingFor = 'Чоловіка' | 'Жінку' | 'Будь-кого';

export type Profile = {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  photo: string;
  gender: Gender;
  lookingFor: LookingFor;
  interests: Interest[];
};

// ============================================================
//  Початкові профілі
// ============================================================
export const INITIAL_PROFILES: Profile[] = [
  {
    id: '1', name: 'Анна', age: 24, city: 'Київ',
    bio: 'Люблю подорожі та каву ☕ Шукаю людину з яскравою душею.',
    photo: 'https://picsum.photos/id/1011/400/500',
    gender: 'Жінка', lookingFor: 'Чоловіка',
    interests: ['Подорожі', 'Кулінарія', 'Мистецтво'],
  },
  {
    id: '2', name: 'Олександр', age: 27, city: 'Львів',
    bio: 'Шукаю щиру дівчину. Захоплююсь горами і музикою 🎸',
    photo: 'https://picsum.photos/id/64/400/500',
    gender: 'Чоловік', lookingFor: 'Жінку',
    interests: ['Музика', 'Природа', 'Спорт'],
  },
  {
    id: '3', name: 'Марія', age: 22, city: 'Одеса',
    bio: 'Мрію про велике кохання ❤️ Люблю море і танці.',
    photo: 'https://picsum.photos/id/1027/400/500',
    gender: 'Жінка', lookingFor: 'Чоловіка',
    interests: ['Танці', 'Музика', 'Подорожі'],
  },
  {
    id: '4', name: 'Дмитро', age: 29, city: 'Харків',
    bio: 'Займаюсь спортом і люблю природу 🌲 IT-спеціаліст.',
    photo: 'https://picsum.photos/id/201/400/500',
    gender: 'Чоловік', lookingFor: 'Жінку',
    interests: ['Спорт', 'Технології', 'Природа'],
  },
  {
    id: '5', name: 'Софія', age: 23, city: 'Ужгород',
    bio: 'Люблю гори та тихі вечори 🏔️ Читаю книги, дивлюсь кіно.',
    photo: 'https://picsum.photos/id/102/400/500',
    gender: 'Жінка', lookingFor: 'Чоловіка',
    interests: ['Читання', 'Кіно', 'Природа'],
  },
  {
    id: '6', name: 'Максим', age: 31, city: 'Дніпро',
    bio: 'Кухар за покликанням 👨‍🍳 Люблю готувати та подорожувати.',
    photo: 'https://picsum.photos/id/338/400/500',
    gender: 'Чоловік', lookingFor: 'Жінку',
    interests: ['Кулінарія', 'Подорожі', 'Мистецтво'],
  },
  {
    id: '7', name: 'Вікторія', age: 26, city: 'Полтава',
    bio: 'Художниця та мрійниця 🎨 Шукаю того, хто розуміє мистецтво.',
    photo: 'https://picsum.photos/id/1066/400/500',
    gender: 'Жінка', lookingFor: 'Чоловіка',
    interests: ['Мистецтво', 'Музика', 'Читання'],
  },
];

// ============================================================
//  Алгоритм підбору пари (за відсотком сумісності)
// ============================================================
export function calcCompatibility(me: Profile, other: Profile): number {
  // 1. Стать — якщо не підходить, 0%
  if (me.lookingFor !== 'Будь-кого' && other.gender !== me.lookingFor) return 0;
  if (other.lookingFor !== 'Будь-кого' && me.gender !== other.lookingFor) return 0;

  // 2. Спільні інтереси (50 балів макс)
  const shared = me.interests.filter(i => other.interests.includes(i)).length;
  const maxInterests = Math.max(me.interests.length, other.interests.length, 1);
  const interestScore = (shared / maxInterests) * 50;

  // 3. Різниця у віці (30 балів макс)
  const ageDiff = Math.abs(me.age - other.age);
  const ageScore = ageDiff <= 2 ? 30 : ageDiff <= 5 ? 20 : ageDiff <= 10 ? 10 : 0;

  // 4. Місто (20 балів)
  const cityScore = me.city === other.city ? 20 : 0;

  return Math.round(interestScore + ageScore + cityScore);
}

export function getMatches(me: Profile, all: Profile[]): (Profile & { compatibility: number })[] {
  return all
    .filter(p => p.id !== me.id)
    .map(p => ({ ...p, compatibility: calcCompatibility(me, p) }))
    .filter(p => p.compatibility > 0)
    .sort((a, b) => b.compatibility - a.compatibility);
}
