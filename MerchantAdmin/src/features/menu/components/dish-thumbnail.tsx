import * as React from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type DishThumbnailProps = {
  src: string
  alt: string
  className?: string
}

export function DishThumbnail({ src, alt, className }: DishThumbnailProps) {
  const [failed, setFailed] = React.useState(false)

  return (
    <div
      className={cn(
        'relative size-12 shrink-0 overflow-hidden rounded-md bg-muted',
        className
      )}
    >
      {failed ? (
        <div className='flex size-full items-center justify-center text-muted-foreground'>
          <ImageOff className='size-5' aria-hidden />
          <span className='sr-only'>图片加载失败</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading='lazy'
          decoding='async'
          className='size-full object-cover'
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
