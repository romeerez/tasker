import { useCallback } from 'react'
import { SchemaOf } from 'yup'
import { useForm as useFormOriginal } from 'react-hook-form'
import {
  FieldValues,
  UseFormMethods,
  UseFormOptions,
} from 'react-hook-form/dist/types'

const useYupValidationResolver = <T>(validationSchema?: SchemaOf<T>) =>
  useCallback(
    async (data) => {
      if (!validationSchema) return { values: data, errors: {} }

      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        })

        return {
          values,
          errors: {},
        }
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (
              allErrors: Record<string, unknown>,
              currentError: { path: string; type?: string; message: string },
            ) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {},
          ),
        }
      }
    },
    [validationSchema],
  )

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext extends Record<string, unknown> = Record<string, unknown>
>({
  schema,
  ...params
}: UseFormOptions<TFieldValues, TContext> & {
  schema?: SchemaOf<unknown>
} = {}): UseFormMethods<TFieldValues> {
  const resolver = useYupValidationResolver(schema)
  return useFormOriginal<TFieldValues, TContext>({ ...params, resolver })
}
