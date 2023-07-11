import React from 'react';
import zod from 'zod';

interface FormState {
  value: string;
  error?: string;
}

export default function useForm<TSchema>(
  validator: Zod.AnyZodObject | Zod.ZodEffects<Zod.AnyZodObject>,
) {
  const validation = React.useRef<Record<keyof TSchema, string>>(
    {} as Record<keyof TSchema, string>,
  );
  const [errors, setErrors] = React.useState<Record<keyof TSchema, string>>(
    {} as Record<keyof TSchema, string>,
  );
  const clearErrors = () => {
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
      const result = validator.safeParse(validation.current);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors as Record<
          keyof TSchema,
          string[]
        >;
        setErrors((prev) => {
          const copy = { ...prev };
          for (const key in fieldErrors) {
            copy[key] = fieldErrors[key][0];
          }
          return copy;
        });
      } else onSubmit(validation.current as TSchema);
    };
  };

  const register = <T extends keyof TSchema>(key: T) => {
    validation.current[key] = validation.current[key] ?? '';
    return {
      onChangeText: (e: string) => {
        validation.current[key] = e;
      },
      defaultValue: validation.current[key] as TSchema[T],
      error: errors[key],
    };
  };

  return { handleSubmit, register, setError, clearErrors };
}
