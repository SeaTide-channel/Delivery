import { type Category, type Dish } from './types'

/** Stable IDs for seed data (mock phase). New rows use crypto.randomUUID() at runtime. */
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-hot', name: '招牌热菜', sortOrder: 10 },
  { id: 'cat-noodle', name: '面食主食', sortOrder: 20 },
  { id: 'cat-drink', name: '酒水饮料', sortOrder: 30 },
]

/** picsum.photos with fixed seed path for stable thumbnails across reloads */
export const INITIAL_DISHES: Dish[] = [
  {
    id: 'dish-1',
    categoryId: 'cat-hot',
    name: '红烧肉',
    sortOrder: 10,
    price: 48,
    imageUrl: 'https://picsum.photos/seed/seatide-1/400/400',
    status: 'ON_SALE',
    description: '家常红烧，偏甜口',
  },
  {
    id: 'dish-2',
    categoryId: 'cat-hot',
    name: '清炒时蔬',
    sortOrder: 20,
    price: 22,
    imageUrl: 'https://picsum.photos/seed/seatide-2/400/400',
    status: 'ON_SALE',
  },
  {
    id: 'dish-3',
    categoryId: 'cat-noodle',
    name: '葱油拌面',
    sortOrder: 10,
    price: 16,
    imageUrl: 'https://picsum.photos/seed/seatide-3/400/400',
    status: 'SOLD_OUT',
    description: '小葱现熬葱油',
  },
  {
    id: 'dish-4',
    categoryId: 'cat-noodle',
    name: '番茄鸡蛋面',
    sortOrder: 20,
    price: 18,
    imageUrl: 'https://picsum.photos/seed/seatide-4/400/400',
    status: 'ON_SALE',
  },
  {
    id: 'dish-5',
    categoryId: 'cat-drink',
    name: '酸梅汤',
    sortOrder: 10,
    price: 8,
    imageUrl: 'https://picsum.photos/seed/seatide-5/400/400',
    status: 'ON_SALE',
  },
]
