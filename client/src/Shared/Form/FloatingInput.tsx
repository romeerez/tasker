import React from 'react'
import ErrorMessage from 'Shared/Form/ErrorMessage'
import { UseFormMethods } from 'react-hook-form'
import cn from 'classnames'

type Props = {
  // eslint-disable-next-line
  form: UseFormMethods<any>
  name: string
  label: string
  type?: string
  className?: string
}

export default function FloatingInput({
  form,
  className,
  name,
  label,
  type,
}: Props) {
  return (
    <div className={cn('floating-input-group mt-6', className)}>
      <input
        ref={form.register}
        type={type}
        name={name}
        className="floating-input"
        placeholder=" "
      />
      <label htmlFor={name} className="floating-label">
        {label}
      </label>
      <ErrorMessage form={form} name={name} />
    </div>
  )
}
