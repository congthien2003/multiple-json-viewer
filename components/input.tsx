import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-blue-500/50 selection:text-foreground h-9 w-full min-w-0 rounded-lg border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-sm px-3 py-1 text-base shadow-xs transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-white/30 dark:hover:border-white/20 hover:bg-white/15 dark:hover:bg-white/8',
        'focus-visible:border-blue-400 focus-visible:ring-blue-500/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
