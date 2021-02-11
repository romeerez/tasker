import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="w-full h-full flex-center">
      <div className="box">{children}</div>
    </div>
  )
}
