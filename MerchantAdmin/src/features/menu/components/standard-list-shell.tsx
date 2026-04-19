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
      <Main fixed>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
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
          <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
            {toolbar}
          </div>
        ) : null}
        <div className='space-y-4'>{children}</div>
      </Main>
    </>
  )
}
