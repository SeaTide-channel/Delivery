import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = useLocation({ select: (l) => l.pathname })

  return (
    <nav className={cn('flex flex-col gap-1', className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href && 'bg-muted hover:bg-muted'
          )}
        >
          <span className='flex items-center gap-2'>
            {item.icon}
            {item.title}
          </span>
        </Link>
      ))}
    </nav>
  )
}
