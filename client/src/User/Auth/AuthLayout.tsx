import React from 'react'
import cn from 'classnames'

type Props = {
  children: React.ReactNode
  className: string
}

export default function AuthLayout({ children, className }: Props) {
  return (
    <div className="w-full h-full flex-center">
      <div className={cn('box w-full', className)}>{children}</div>
    </div>
  )
}
