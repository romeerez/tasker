import React from 'react'
import cn from 'classnames'
import style from './style.module.css'

type Props = {
  className?: string
}

export default function Spinner({ className }: Props) {
  return (
    <div className={cn(className, style.loader)}>
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}
