import { create } from 'zustand'
import { type Category, type Dish, type DishStatus } from '@/features/menu/model/types'

type MenuStoreState = {
  categories: Category[]
  dishes: Dish[]
  loading: boolean
  error: string | null
  /** TODO: 后端写接口与认证完成后，替换为真实 mutation */
  fetchMenu: () => Promise<void>
  /** TODO: 后端写接口与认证完成后，替换为真实 mutation */
  resetToSeed: () => void
  /** TODO: 后端写接口与认证完成后，替换为真实 mutation */
  addCategory: (input: Omit<Category, 'id'> & { id?: string }) => void
  /** TODO: 后端写接口与认证完成后，替换为真实 mutation */
  updateCategory: (id: string, patch: Partial<Omit<Category, 'id'>>) => void
  /** TODO: 后端写接口与认证完成后，替换为真实 mutation */
  deleteCategory: (id: string) => { ok: true } | { ok: false; reason: 'HAS_DISHES' }
  /** TODO: 后端写接口与认证完成后，替换为真实 mutation */
  addDish: (input: Omit<Dish, 'id'> & { id?: string }) => void
  /** TODO: 后端写接口与认证完成后，替换为真实 mutation */
  updateDish: (id: string, patch: Partial<Omit<Dish, 'id'>>) => void
  /** TODO: 后端写接口与认证完成后，替换为真实 mutation */
  deleteDish: (id: string) => void
  /** TODO: 后端写接口与认证完成后，替换为真实 mutation */
  setDishStatus: (id: string, status: DishStatus) => void
}

function todoWarn(action: string) {
  // eslint-disable-next-line no-console
  console.warn(`[menu-store TODO] ${action} 暂未接入后端写接口`)
}

export const useMenuStore = create<MenuStoreState>()(() => ({
  categories: [],
  dishes: [],
  loading: false,
  error: null,

  fetchMenu: async () => {
    todoWarn('fetchMenu')
  },

  resetToSeed: () => {
    todoWarn('resetToSeed')
  },

  addCategory: () => {
    todoWarn('addCategory')
  },

  updateCategory: () => {
    todoWarn('updateCategory')
  },

  deleteCategory: () => {
    todoWarn('deleteCategory')
    return { ok: true }
  },

  addDish: () => {
    todoWarn('addDish')
  },

  updateDish: () => {
    todoWarn('updateDish')
  },

  deleteDish: () => {
    todoWarn('deleteDish')
  },

  setDishStatus: () => {
    todoWarn('setDishStatus')
  },
}))
