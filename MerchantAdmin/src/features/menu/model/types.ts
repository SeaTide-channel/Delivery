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
  price: number
  imageUrl: string
  status: DishStatus
  description?: string
}
