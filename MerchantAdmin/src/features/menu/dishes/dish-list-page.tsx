import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Loader2Icon, RefreshCwIcon, SearchIcon } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table/pagination'
import { cn } from '@/lib/utils'
import { DishThumbnail } from '@/features/menu/components/dish-thumbnail'
import { useMerchantMenu } from '@/features/menu/hooks/use-merchant-menu'
import {
  categoryNameMap,
  selectSortedCategories,
  sortDishesForDisplay,
} from '@/features/menu/model/menu-display'
import { type Category, type Dish, type DishStatus } from '@/features/menu/model/types'

type DishRow = Dish & { categoryLabel: string }
const EMPTY_CATEGORIES: Category[] = []
const EMPTY_DISHES: Dish[] = []

export function DishListPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useMerchantMenu()
  const categories = data?.categories ?? EMPTY_CATEGORIES
  const dishes = data?.dishes ?? EMPTY_DISHES

  const sortedCategories = React.useMemo(
    () => selectSortedCategories(categories),
    [categories]
  )

  const nameLookup = React.useMemo(
    () => categoryNameMap(categories),
    [categories]
  )

  const rows = React.useMemo<DishRow[]>(() => {
    const ordered = sortDishesForDisplay(dishes, sortedCategories)
    return ordered.map((d) => ({
      ...d,
      categoryLabel: nameLookup.get(d.categoryId) ?? '—',
    }))
  }, [dishes, sortedCategories, nameLookup])

  const [search, setSearch] = React.useState('')
  const [filterCategoryId, setFilterCategoryId] = React.useState<string>('all')
  const [filterStatus, setFilterStatus] = React.useState<'all' | DishStatus>(
    'all'
  )

  const filtered = React.useMemo(() => {
    let list = rows
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((d) => d.name.toLowerCase().includes(q))
    }
    if (filterCategoryId !== 'all') {
      list = list.filter((d) => d.categoryId === filterCategoryId)
    }
    if (filterStatus !== 'all') {
      list = list.filter((d) => d.status === filterStatus)
    }
    const dishRows = list.map(({ categoryLabel: _, ...rest }) => rest)
    const reordered = sortDishesForDisplay(dishRows, sortedCategories)
    return reordered.map((d) => ({
      ...d,
      categoryLabel: nameLookup.get(d.categoryId) ?? '—',
    }))
  }, [rows, search, filterCategoryId, filterStatus, sortedCategories, nameLookup])

  const columns = React.useMemo<ColumnDef<DishRow>[]>(
    () => [
      {
        id: 'thumb',
        header: '图',
        cell: ({ row }) => (
          <DishThumbnail src={row.original.imageUrl} alt={row.original.name} />
        ),
      },
      {
        accessorKey: 'name',
        header: '菜品名称',
        cell: ({ row }) => (
          <span className='font-medium'>{row.original.name}</span>
        ),
      },
      {
        accessorKey: 'categoryLabel',
        header: '分类',
      },
      {
        accessorKey: 'sortOrder',
        header: '排序',
        cell: ({ row }) => (
          <span className='tabular-nums text-muted-foreground'>
            {row.original.sortOrder}
          </span>
        ),
      },
      {
        accessorKey: 'price',
        header: '价格',
        cell: ({ row }) => (
          <span className='tabular-nums'>¥{row.original.price.toFixed(2)}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: '状态',
        cell: ({ row }) => (
          <Badge
            variant={row.original.status === 'ON_SALE' ? 'secondary' : 'outline'}
          >
            {row.original.status === 'ON_SALE' ? '在售' : '估清'}
          </Badge>
        ),
      },
    ],
    []
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed className='flex h-full flex-col overflow-hidden py-4'>
        <div className='mb-4 flex flex-none items-start justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>菜品列表</h1>
            <p className='text-muted-foreground mt-1 text-sm'>
              菜品数据来自后端接口，当前为只读模式。列表按分类顺序与分类内排序展示。
            </p>
          </div>
          <Button type='button' variant='outline' onClick={() => refetch()}>
            <RefreshCwIcon
              className={cn('me-2 size-4', isFetching ? 'animate-spin' : '')}
            />
            刷新
          </Button>
        </div>

        <div className='mb-4 flex flex-none items-center gap-2'>
          <div className='relative max-w-sm flex-1'>
            <SearchIcon className='text-muted-foreground absolute inset-s-3 top-1/2 size-4 -translate-y-1/2' />
            <Input
              placeholder='按菜品名称搜索…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn('ps-9')}
            />
          </div>
          <Select value={filterCategoryId} onValueChange={setFilterCategoryId}>
            <SelectTrigger className='w-45'>
              <SelectValue placeholder='分类' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>全部分类</SelectItem>
              {sortedCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as 'all' | DishStatus)}
          >
            <SelectTrigger className='w-35'>
              <SelectValue placeholder='状态' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>全部状态</SelectItem>
              <SelectItem value='ON_SALE'>在售</SelectItem>
              <SelectItem value='SOLD_OUT'>估清</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex min-h-0 flex-1 flex-col gap-4'>
          {isPending ? (
            <div className='flex flex-1 items-center justify-center rounded-md border'>
              <Loader2Icon className='text-muted-foreground size-8 animate-spin' />
              <span className='text-muted-foreground ml-2'>加载中...</span>
            </div>
          ) : isError ? (
            <div className='flex flex-1 items-center justify-center rounded-md border'>
              <div className='text-center'>
                <p className='text-destructive mb-2'>加载失败</p>
                <p className='text-muted-foreground text-sm'>
                  {error instanceof Error ? error.message : '未知错误'}
                </p>
                <Button
                  type='button'
                  variant='outline'
                  className='mt-4'
                  onClick={() => refetch()}
                >
                  重试
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className='relative flex-1 overflow-y-auto rounded-md border'>
                <Table>
                  <TableHeader className='sticky top-0 z-10 bg-background shadow-sm'>
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id}>
                        {hg.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className='text-muted-foreground h-24 text-center'
                        >
                          暂无符合条件的菜品。
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className='flex-none'>
                <DataTablePagination table={table} />
              </div>
            </>
          )}
        </div>
      </Main>
    </>
  )
}
