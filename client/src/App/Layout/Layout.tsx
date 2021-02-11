import React from 'react'
import { logOut } from 'User/service'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div>
      <div className="py-5 px-10 flex items-center justify-between">
        <div className="text-2xl font-bold">Tasker</div>
        <div>
          <button onClick={logOut} className="font-bold">
            Log Out
          </button>
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
