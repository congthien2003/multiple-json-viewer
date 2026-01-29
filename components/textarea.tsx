import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-lg border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-sm px-3 py-2 text-base shadow-xs transition-all duration-300 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-white/30 dark:hover:border-white/20 hover:bg-white/15 dark:hover:bg-white/8',
        'focus-visible:border-blue-400 focus-visible:ring-blue-500/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
