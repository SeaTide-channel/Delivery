import { createFileRoute } from '@tanstack/react-router'
import { DishListPage } from '@/features/menu/dishes/dish-list-page'

export const Route = createFileRoute('/_authenticated/menu/dishes')({
  component: DishListPage,
})
