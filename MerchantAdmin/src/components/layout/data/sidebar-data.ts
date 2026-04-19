import { LayoutDashboard, LayoutList, Store, UtensilsCrossed } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: '演示门店',
    email: 'merchant@example.com',
    avatar: '',
  },
  navGroups: [
    {
      title: '概览',
      items: [
        {
          title: '数据看板',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: '商品管理',
      items: [
        {
          title: '菜品列表',
          url: '/menu/dishes',
          icon: UtensilsCrossed,
        },
        {
          title: '分类设置',
          url: '/menu/categories',
          icon: LayoutList,
        },
      ],
    },
    {
      title: '门店',
      items: [
        {
          title: '店铺设置',
          url: '/store/profile',
          icon: Store,
        },
      ],
    },
  ],
}
