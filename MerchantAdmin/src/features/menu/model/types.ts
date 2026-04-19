export interface Category {
  id: string
  name: string
  sortOrder: number
}

export type DishStatus = 'ON_SALE' | 'SOLD_OUT'

export interface Dish {
  id: string
  categoryId: string
  name: string
  /** 同一分类内的展示顺序，数值越小越靠前（与外卖菜单内顺序一致） */
  sortOrder: number
  price: number
  imageUrl: string
  status: DishStatus
  description?: string
}
