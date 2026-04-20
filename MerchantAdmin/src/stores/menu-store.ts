import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { type Category, type Dish, type DishStatus } from '@/features/menu/model/types'

/** Bump when persisted shape changes to drop old sessionStorage payload */
export const MENU_MOCK_SCHEMA_VERSION = 2

const STORAGE_KEY = `seatide-menu-mock-v${MENU_MOCK_SCHEMA_VERSION}`

type MenuStoreState = {
  categories: Category[]
  dishes: Dish[]
  loading: boolean
  error: string | null
  /** 从后端 API 获取菜单数据 */
  fetchMenu: () => Promise<void>
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
      categories: [],
      dishes: [],
      loading: false,
      error: null,

      fetchMenu: async () => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('http://localhost:8080/api/merchantadmin/merchants/1/menu')
          if (!response.ok) {
            throw new Error('Failed to fetch menu data')
          }
          const data = await response.json()
          set({
            categories: data.categories || [],
            dishes: data.dishes || [],
            loading: false
          })
        } catch (error) {
          console.error('Error fetching menu:', error)
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false
          })
        }
      },

      resetToSeed: () => set({
        categories: [],
        dishes: []
      }),

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
          sortOrder: input.sortOrder,
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

/** 按分类排序 → 分类内菜品 sortOrder → id，用于列表与预览菜单顺序 */
export function sortDishesForDisplay(
  dishes: Dish[],
  sortedCategories: Category[]
): Dish[] {
  const catRank = new Map(sortedCategories.map((c) => [c.id, c.sortOrder]))
  return [...dishes].sort((a, b) => {
    const ao = catRank.get(a.categoryId) ?? Number.MAX_SAFE_INTEGER
    const bo = catRank.get(b.categoryId) ?? Number.MAX_SAFE_INTEGER
    if (ao !== bo) return ao - bo
    const d = a.sortOrder - b.sortOrder
    if (d !== 0) return d
    return a.id.localeCompare(b.id)
  })
}

/** 新增菜品时默认排序：该分类现有最大 sortOrder + 10；无菜品时从 10 开始 */
export function nextDishSortOrder(
  dishes: Dish[],
  categoryId: string
): number {
  let max = 0
  for (const d of dishes) {
    if (d.categoryId === categoryId) max = Math.max(max, d.sortOrder)
  }
  return max === 0 ? 10 : max + 10
}
