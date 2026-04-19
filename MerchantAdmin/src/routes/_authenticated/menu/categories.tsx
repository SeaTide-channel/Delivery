import { createFileRoute } from '@tanstack/react-router'
import { CategoryListPage } from '@/features/menu/categories/category-list-page'

export const Route = createFileRoute('/_authenticated/menu/categories')({
  component: CategoryListPage,
})
