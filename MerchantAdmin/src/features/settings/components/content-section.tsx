import { Separator } from '@/components/ui/separator'

type ContentSectionProps = {
  title: string
  desc: string
  children: React.ReactNode
}

export function ContentSection({ title, desc, children }: ContentSectionProps) {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{desc}</p>
      </div>
      <Separator />
      {children}
    </div>
  )
}
