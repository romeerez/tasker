import React from 'react'
import { UseFormMethods } from 'react-hook-form/dist/types'
import { ErrorMessage as OriginalErrorMessage } from '@hookform/error-message'

export default function ErrorMessage({
  form,
  name,
  className = 'text-sm text-red-500 mt-2',
}: {
  // eslint-disable-next-line
  form: UseFormMethods<any>
  name: string
  className?: string
}) {
  return (
    <OriginalErrorMessage
      errors={form.errors}
      name={name}
      render={(error) => <div className={className}>{error.message}</div>}
    />
  )
}
