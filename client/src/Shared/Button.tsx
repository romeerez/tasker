import React from 'react'
import Spinner from 'Shared/Spinner'

type Props = {
  children: React.ReactNode
  className: string
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
}

export default function Button({
  children,
  className,
  type = 'button',
  loading,
}: Props) {
  return (
    <button type={type} className={className}>
      {loading && (
        <div className="h-5 relative">
          <Spinner className="w-5 h-full -ml-7" />
        </div>
      )}
      {children}
    </button>
  )
}
