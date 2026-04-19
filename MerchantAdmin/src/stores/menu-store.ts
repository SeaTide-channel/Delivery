import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  INITIAL_CATEGORIES,
  INITIAL_DISHES,
} from '@/features/menu/model/mock-seed'
import { type Category, type Dish, type DishStatus } from '@/features/menu/model/types'

/** Bump when persisted shape changes to drop old sessionStorage payload */
export const MENU_MOCK_SCHEMA_VERSION = 1

const STORAGE_KEY = `seatide-menu-mock-v${MENU_MOCK_SCHEMA_VERSION}`

function cloneSeed(): { categories: Category[]; dishes: Dish[] } {
  return {
    categories: INITIAL_CATEGORIES.map((c) => ({ ...c })),
    dishes: INITIAL_DISHES.map((d) => ({ ...d })),
  }
}

type MenuStoreState = {
  categories: Category[]
  dishes: Dish[]
  /** Replace all data with hardcoded seed */
  resetToSeed: () => void
  addCategory: (input: Omit<Category, 'id'> & { id?: string }) => void
  updateCategory: (id: string, patch: Partial<Omit<Category, 'id'>>) => void
  deleteCategory: (id: string) => { ok: true } | { ok: false; reason: 'HAS_DISHES' }
  addDish: (input: Omit<Dish, 'id'> & { id?: string }) => void
  updateDish: (id: string, patch: Partial<Omit<Dish, 'id'>>) => void
  deleteDish: (id: string) => void
  setDishStatus: (id: string, status: DishStatus) => void
}

export const useMenuStore = create<MenuStoreState>()(
  persist(
    (set, get) => ({
      ...cloneSeed(),

      resetToSeed: () => set(cloneSeed()),

      addCategory: (input) => {
        const row: Category = {
          id: input.id ?? crypto.randomUUID(),
          name: input.name,
          sortOrder: input.sortOrder,
        }
        set((s) => ({ categories: [...s.categories, row] }))
      },

      updateCategory: (id, patch) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        })),

      deleteCategory: (id) => {
        const hasDishes = get().dishes.some((d) => d.categoryId === id)
        if (hasDishes) return { ok: false, reason: 'HAS_DISHES' }
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
        }))
        return { ok: true }
      },

      addDish: (input) => {
        const row: Dish = {
          id: input.id ?? crypto.randomUUID(),
          categoryId: input.categoryId,
          name: input.name,
          price: input.price,
          imageUrl: input.imageUrl,
          status: input.status,
          ...(input.description !== undefined
            ? { description: input.description }
            : {}),
        }
        set((s) => ({ dishes: [...s.dishes, row] }))
      },

      updateDish: (id, patch) =>
        set((s) => ({
          dishes: s.dishes.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),

      deleteDish: (id) =>
        set((s) => ({ dishes: s.dishes.filter((d) => d.id !== id) })),

      setDishStatus: (id, status) =>
        set((s) => ({
          dishes: s.dishes.map((d) => (d.id === id ? { ...d, status } : d)),
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        categories: state.categories,
        dishes: state.dishes,
      }),
      version: MENU_MOCK_SCHEMA_VERSION,
    }
  )
)

export function selectSortedCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function categoryNameMap(categories: Category[]): Map<string, string> {
  return new Map(categories.map((c) => [c.id, c.name]))
}
