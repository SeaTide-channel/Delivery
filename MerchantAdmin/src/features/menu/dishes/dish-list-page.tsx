import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { useForm, type Resolver } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Link } from '@tanstack/react-router'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { DataTablePagination } from '@/components/data-table/pagination'
import { cn } from '@/lib/utils'
import { DishThumbnail } from '@/features/menu/components/dish-thumbnail'
import { StandardListShell } from '@/features/menu/components/standard-list-shell'
import {
  type Dish,
  type DishStatus,
} from '@/features/menu/model/types'
import {
  categoryNameMap,
  nextDishSortOrder,
  selectSortedCategories,
  sortDishesForDisplay,
  useMenuStore,
} from '@/stores/menu-store'

const dishFormSchema = z.object({
  name: z.string().min(1, '请输入菜品名称').max(64),
  sortOrder: z.coerce.number().int().min(0, '排序不能为负数'),
  price: z.coerce.number().positive('价格必须大于 0'),
  categoryId: z.string().min(1, '请选择分类'),
  imageUrl: z
    .string()
    .min(1, '请填写图片地址')
    .refine(
      (s) => {
        try {
          // eslint-disable-next-line no-new
          new URL(s)
          return true
        } catch {
          return false
        }
      },
      { message: '请输入有效的图片 URL' }
    ),
  description: z.string().optional(),
  status: z.enum(['ON_SALE', 'SOLD_OUT']),
})

type DishFormValues = z.output<typeof dishFormSchema>

type DishRow = Dish & { categoryLabel: string }

export function DishListPage() {
  const categories = useMenuStore((s) => s.categories)
  const dishes = useMenuStore((s) => s.dishes)
  const loading = useMenuStore((s) => s.loading)
  const error = useMenuStore((s) => s.error)
  const addDish = useMenuStore((s) => s.addDish)
  const updateDish = useMenuStore((s) => s.updateDish)
  const deleteDish = useMenuStore((s) => s.deleteDish)
  const resetToSeed = useMenuStore((s) => s.resetToSeed)
  const fetchMenu = useMenuStore((s) => s.fetchMenu)

  // 组件加载时从后端获取数据
  React.useEffect(() => {
    fetchMenu()
  }, [fetchMenu])

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
  }, [dishes, nameLookup, sortedCategories])

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

  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Dish | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState<Dish | null>(null)

  const [needCategoryOpen, setNeedCategoryOpen] = React.useState(false)

  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishFormSchema) as Resolver<DishFormValues>,
    defaultValues: {
      name: '',
      sortOrder: 10,
      price: 0,
      categoryId: '',
      imageUrl: 'https://picsum.photos/seed/custom/400/400',
      description: '',
      status: 'ON_SALE',
    },
  })

  const openCreate = () => {
    if (sortedCategories.length === 0) {
      setNeedCategoryOpen(true)
      return
    }
    setEditing(null)
    const firstCat = sortedCategories[0]?.id ?? ''
    form.reset({
      name: '',
      sortOrder: nextDishSortOrder(dishes, firstCat),
      price: 18,
      categoryId: firstCat,
      imageUrl: 'https://picsum.photos/seed/custom/400/400',
      description: '',
      status: 'ON_SALE',
    })
    setSheetOpen(true)
  }

  const openEdit = (row: DishRow) => {
    const dish: Dish = {
      id: row.id,
      categoryId: row.categoryId,
      name: row.name,
      sortOrder: row.sortOrder,
      price: row.price,
      imageUrl: row.imageUrl,
      status: row.status,
      description: row.description,
    }
    setEditing(dish)
    form.reset({
      name: dish.name,
      sortOrder: dish.sortOrder,
      price: dish.price,
      categoryId: dish.categoryId,
      imageUrl: dish.imageUrl,
      description: dish.description ?? '',
      status: dish.status,
    })
    setSheetOpen(true)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (sortedCategories.length === 0) {
      toast.error('请先添加分类')
      setNeedCategoryOpen(true)
      return
    }
    if (!nameLookup.has(values.categoryId)) {
      toast.error('所选分类不存在，请重新选择')
      return
    }

    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 180))
    try {
      const payload = {
        name: values.name,
        sortOrder: values.sortOrder,
        price: values.price,
        categoryId: values.categoryId,
        imageUrl: values.imageUrl,
        status: values.status,
        ...(values.description?.trim()
          ? { description: values.description.trim() }
          : {}),
      }

      if (editing) {
        updateDish(editing.id, payload)
        toast.success('菜品已更新')
      } else {
        addDish(payload)
        toast.success('菜品已添加')
      }
      setSheetOpen(false)
    } finally {
      setSubmitting(false)
    }
  })

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
        id: 'status',
        header: '在售',
        cell: ({ row }) => (
          <Switch
            checked={row.original.status === 'ON_SALE'}
            onCheckedChange={(on) =>
              useMenuStore.getState().setDishStatus(
                row.original.id,
                on ? 'ON_SALE' : 'SOLD_OUT'
              )
            }
          />
        ),
      },
      {
        id: 'actions',
        header: () => <span className='sr-only'>操作</span>,
        cell: ({ row }) => (
          <div className='flex justify-end gap-1'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-8'
              onClick={() => openEdit(row.original)}
            >
              <PencilIcon className='size-4' />
              <span className='sr-only'>编辑</span>
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-8 text-destructive hover:text-destructive'
              onClick={() => {
                setDeleting(row.original)
                setDeleteOpen(true)
              }}
            >
              <Trash2Icon className='size-4' />
              <span className='sr-only'>删除</span>
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const confirmDelete = () => {
    if (!deleting) return
    deleteDish(deleting.id)
    toast.success('菜品已删除')
    setDeleteOpen(false)
    setDeleting(null)
  }

  return (
    <>
      <StandardListShell
        title='菜品列表'
        description='管理店铺在售与估清菜品；列表按分类顺序与本分类内排序展示（数字越小越靠前）。'
        actions={
          <>
            <Button type='button' variant='outline' onClick={() => resetToSeed()}>
              重置演示数据
            </Button>
            <Button
              type='button'
              onClick={openCreate}
              disabled={sortedCategories.length === 0}
              title={
                sortedCategories.length === 0
                  ? '请先添加分类'
                  : undefined
              }
            >
              <PlusIcon className='me-1 size-4' />
              添加菜品
            </Button>
            {sortedCategories.length === 0 ? (
              <Button
                type='button'
                variant='secondary'
                onClick={() => setNeedCategoryOpen(true)}
              >
                去分类设置
              </Button>
            ) : null}
          </>
        }
        toolbar={
          <>
            <div className='relative max-w-sm flex-1'>
              <SearchIcon className='text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2' />
              <Input
                placeholder='按菜品名称搜索…'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn('ps-9')}
              />
            </div>
            <Select
              value={filterCategoryId}
              onValueChange={setFilterCategoryId}
            >
              <SelectTrigger className='w-[180px]'>
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
              <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder='状态' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>全部状态</SelectItem>
                <SelectItem value='ON_SALE'>在售</SelectItem>
                <SelectItem value='SOLD_OUT'>估清</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      >
        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <Loader2Icon className='size-8 animate-spin text-muted-foreground' />
            <span className='ml-2 text-muted-foreground'>加载中...</span>
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <p className='text-destructive mb-2'>加载失败</p>
              <p className='text-muted-foreground text-sm'>{error}</p>
              <Button
                type='button'
                variant='outline'
                className='mt-4'
                onClick={fetchMenu}
              >
                重试
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
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
                        className='h-24 text-center text-muted-foreground'
                      >
                        暂无符合条件的菜品。
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <DataTablePagination table={table} />
          </>
        )}
      </StandardListShell>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side='right'
          className='flex w-full flex-col gap-0 border-s p-0 sm:max-w-lg'
        >
          <SheetHeader className='border-b p-4'>
            <SheetTitle>{editing ? '编辑菜品' : '新增菜品'}</SheetTitle>
            <SheetDescription>
              分类为必填；排序仅在同一分类内生效。图片 URL 仅供演示，后续可接入上传并自动裁切展示。
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className='flex flex-1 flex-col overflow-hidden'
            >
              <div className='flex-1 space-y-4 overflow-y-auto px-4 py-4'>
                <FormField
                  control={form.control}
                  name='categoryId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>分类</FormLabel>
                      <Select
                        onValueChange={(v) => {
                          field.onChange(v)
                          form.setValue(
                            'sortOrder',
                            nextDishSortOrder(
                              editing
                                ? dishes.filter((d) => d.id !== editing.id)
                                : dishes,
                              v
                            )
                          )
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='选择分类' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sortedCategories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>菜品名称</FormLabel>
                      <FormControl>
                        <Input placeholder='例如：葱油拌面' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='sortOrder'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>排序</FormLabel>
                      <FormControl>
                        <Input type='number' min={0} step={1} {...field} />
                      </FormControl>
                      <p className='text-muted-foreground text-xs'>
                        仅在本分类内比较；数字越小，在菜单中越靠前。
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>价格（元）</FormLabel>
                      <FormControl>
                        <Input type='number' min={0.01} step={0.01} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>图片 URL</FormLabel>
                      <FormControl>
                        <Input placeholder='https://…' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>描述（选填）</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                      <div className='space-y-0.5'>
                        <FormLabel>在售</FormLabel>
                        <p className='text-muted-foreground text-xs'>
                          关闭表示估清
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === 'ON_SALE'}
                          onCheckedChange={(on) =>
                            field.onChange(on ? 'ON_SALE' : 'SOLD_OUT')
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <SheetFooter className='border-t bg-background p-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setSheetOpen(false)}
                >
                  取消
                </Button>
                <Button type='submit' disabled={submitting}>
                  {submitting ? (
                    <Loader2Icon className='size-4 animate-spin' />
                  ) : null}
                  保存
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除菜品？</AlertDialogTitle>
            <AlertDialogDescription>
              将删除「{deleting?.name ?? ''}」，此操作可在演示数据中恢复（重置演示数据）。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={confirmDelete}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={needCategoryOpen} onOpenChange={setNeedCategoryOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>请先创建分类</AlertDialogTitle>
            <AlertDialogDescription>
              新增菜品前需要至少一个分类。请先到「分类设置」中添加分类，再回到本页添加菜品。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>稍后</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link to='/menu/categories'>去分类设置</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
