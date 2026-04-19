import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='flex min-h-svh w-full flex-col items-center justify-center px-4 py-8 sm:px-8'>
      {/* 宽度只在这一层约束，避免 container + Card 双层 max-width 叠在一起看起来像没变宽 */}
      <div className='flex w-full max-w-sm flex-col justify-center space-y-2'>
        <div className='mb-4 flex items-center justify-center'>
          <Logo className='me-2' />
          <h1 className='text-xl font-medium'>商家管理</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
