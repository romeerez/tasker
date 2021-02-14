import React from 'react'
import Spinner from 'Shared/Spinner'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
}

export default function Button({
  children,
  type = 'button',
  loading,
  ...props
}: Props) {
  return (
    <button type={type} {...props}>
      {loading && (
        <div className="h-5 relative">
          <Spinner className="w-5 h-full -ml-7" />
        </div>
      )}
      {children}
    </button>
  )
}
