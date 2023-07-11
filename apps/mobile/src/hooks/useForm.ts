import React from 'react';
import zod from 'zod';

interface FormState {
  value: string;
  error?: string;
}

export default function useForm<TSchema>(validator: Zod.AnyZodObject) {
  const validation = React.useRef<Record<keyof TSchema, FormState>>(
    {} as Record<keyof TSchema, FormState>,
  );
  const [errors, setErrors] = React.useState<Record<keyof TSchema, string>>(
    {} as Record<keyof TSchema, string>,
  );
  const clearErrors = () => {
    for (const key in validation.current) {
      validation.current[key].error = '';
    }
    setErrors({} as Record<keyof TSchema, string>);
  };
  const setError = (errors: Partial<Record<keyof TSchema, string>>) => {
    setErrors((prev) => {
      const copy = { ...prev };
      for (const key in errors) {
        const val = errors[key];
        if (val != null) copy[key] = val;
      }
      return copy;
    });
  };
  const handleSubmit = (onSubmit: (e: TSchema) => void) => {
    return () => {
      clearErrors();
      for (const key in validation.current) {
        const result: zod.SafeParseReturnType<unknown, unknown> =
          validator.shape[key].safeParse(
            validation.current[key as keyof TSchema].value,
          );
        if (!result.success)
          validation.current[key as keyof TSchema].error =
            result.error.errors[0].message;
      }

      // Check if there are errors
      for (const key in validation.current) {
        if (validation.current[key].error)
          return setErrors(
            Object.entries<FormState>(validation.current).reduce(
              (prev, [key, value]) => {
                prev[key] = value.error || '';
                return prev;
              },
              {} as Record<string, string>,
            ) as Record<keyof TSchema, string>,
          );
      }

      onSubmit(
        Object.entries<FormState>(validation.current).reduce(
          (prev, [key, value]) => {
            prev[key] = value.value;
            return prev;
          },
          {} as Record<string, unknown>,
        ) as TSchema,
      );
    };
  };

  const register = (key: keyof TSchema) => {
    validation.current[key] =
      validation.current[key] ?? ({ value: '', error: '' } as FormState);
    return {
      onChangeText: (e: string) => {
        validation.current[key].value = e;
      },
      defaultValue: validation.current[key].value,
      error: errors[key],
    };
  };

  return { handleSubmit, register, setError, clearErrors };
}
