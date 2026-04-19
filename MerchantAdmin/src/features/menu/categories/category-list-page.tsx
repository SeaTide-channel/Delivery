import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from 'lucide-react'
import { useForm, type Resolver } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table/pagination'
import { cn } from '@/lib/utils'
import { StandardListShell } from '@/features/menu/components/standard-list-shell'
import { type Category } from '@/features/menu/model/types'
import {
  selectSortedCategories,
  useMenuStore,
} from '@/stores/menu-store'

const categoryFormSchema = z.object({
  name: z.string().min(1, '请输入分类名称').max(64, '名称过长'),
  sortOrder: z.coerce.number().int().min(0, '排序不能为负数'),
})

type CategoryFormValues = z.output<typeof categoryFormSchema>

export function CategoryListPage() {
  const categories = useMenuStore((s) => s.categories)
  const addCategory = useMenuStore((s) => s.addCategory)
  const updateCategory = useMenuStore((s) => s.updateCategory)
  const deleteCategory = useMenuStore((s) => s.deleteCategory)
  const resetToSeed = useMenuStore((s) => s.resetToSeed)

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

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Category | null>(null)

  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState<Category | null>(null)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(
      categoryFormSchema
    ) as Resolver<CategoryFormValues>,
    defaultValues: { name: '', sortOrder: 100 },
  })

  const openCreate = () => {
    setEditing(null)
    form.reset({ name: '', sortOrder: 100 })
    setDialogOpen(true)
  }

  const openEdit = (row: Category) => {
    setEditing(row)
    form.reset({ name: row.name, sortOrder: row.sortOrder })
    setDialogOpen(true)
  }

  const [submitting, setSubmitting] = React.useState(false)

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 150))
    try {
      if (editing) {
        updateCategory(editing.id, {
          name: values.name,
          sortOrder: values.sortOrder,
        })
        toast.success('分类已更新')
      } else {
        addCategory({ name: values.name, sortOrder: values.sortOrder })
        toast.success('分类已添加')
      }
      setDialogOpen(false)
    } finally {
      setSubmitting(false)
    }
  })

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
    const result = deleteCategory(deleting.id)
    if (!result.ok && result.reason === 'HAS_DISHES') {
      toast.error('该分类下仍有菜品，请先移动或删除菜品后再删分类')
    } else {
      toast.success('分类已删除')
    }
    setDeleteOpen(false)
    setDeleting(null)
  }

  return (
    <>
      <StandardListShell
        title='分类设置'
        description='管理菜品分类与展示排序（数字越小越靠前）。'
        actions={
          <>
            <Button type='button' variant='outline' onClick={() => resetToSeed()}>
              重置演示数据
            </Button>
            <Button type='button' onClick={openCreate}>
              <PlusIcon className='me-1 size-4' />
              新增分类
            </Button>
          </>
        }
        toolbar={
          <div className='relative max-w-sm flex-1'>
            <SearchIcon className='text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2' />
            <Input
              placeholder='按名称搜索…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn('ps-9')}
            />
          </div>
        }
      >
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
                    暂无分类，请点击「新增分类」。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </StandardListShell>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{editing ? '编辑分类' : '新增分类'}</DialogTitle>
            <DialogDescription>
              排序数字越小，在菜单中展示越靠前。
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分类名称</FormLabel>
                    <FormControl>
                      <Input placeholder='例如：招牌热菜' {...field} />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type='submit' disabled={submitting}>
                  {submitting ? (
                    <Loader2Icon className='size-4 animate-spin' />
                  ) : null}
                  保存
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除分类？</AlertDialogTitle>
            <AlertDialogDescription>
              将删除「{deleting?.name ?? ''}」。若该分类下仍有菜品，操作将被拒绝。
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
    </>
  )
}
