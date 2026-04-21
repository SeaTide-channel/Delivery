import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'

type StandardListShellProps = {
  title: string
  description?: string
  actions?: React.ReactNode
  toolbar?: React.ReactNode
  children: React.ReactNode
}

export function StandardListShell({
  title,
  description,
  actions,
  toolbar,
  children,
}: StandardListShellProps) {
  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main fixed className='min-h-0 py-4'>
        <div className='flex min-h-0 flex-1 flex-col gap-4'>
          <div className='flex flex-none flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
              {description ? (
                <p className='text-muted-foreground text-sm'>{description}</p>
              ) : null}
            </div>
            {actions ? (
              <div className='flex shrink-0 flex-wrap gap-2'>{actions}</div>
            ) : null}
          </div>
          {toolbar ? (
            <div className='flex flex-none flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
              {toolbar}
            </div>
          ) : null}
          <div className='min-h-0 flex-1'>{children}</div>
        </div>
      </Main>
    </>
  )
}
