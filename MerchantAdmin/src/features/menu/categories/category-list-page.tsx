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
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { useMerchantMenu } from '@/features/menu/hooks/use-merchant-menu'
import { selectSortedCategories } from '@/features/menu/model/menu-display'
import { type Category } from '@/features/menu/model/types'

const EMPTY_CATEGORIES: Category[] = []

export function CategoryListPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useMerchantMenu()
  const categories = data?.categories ?? EMPTY_CATEGORIES

  const sorted = React.useMemo(
    () => selectSortedCategories(categories),
    [categories]
  )

  const [search, setSearch] = React.useState('')
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sorted
    return sorted.filter((c) => c.name.toLowerCase().includes(q))
  }, [sorted, search])

  const columns = React.useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '分类名称',
        cell: ({ row }) => (
          <span className='font-medium'>{row.original.name}</span>
        ),
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
            <h1 className='text-2xl font-bold tracking-tight'>分类设置</h1>
            <p className='text-muted-foreground mt-1 text-sm'>
              分类数据来自后端接口，当前为只读模式。排序数字越小越靠前。
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
              placeholder='按名称搜索…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn('ps-9')}
            />
          </div>
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
                          暂无符合条件的分类。
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
