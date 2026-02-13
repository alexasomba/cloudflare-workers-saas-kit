import { useField } from '@tanstack/react-form';
import type { AnyFormApi } from '@tanstack/react-form';
import { Input } from '@workspace/ui/components/input';
import { FieldLabel } from '@workspace/ui/components/field';

interface TextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  validators?: Record<string, unknown>;
  form: AnyFormApi;
}

export function TextField({
  name,
  label,
  placeholder,
  disabled,
  validators,
  form,
}: TextFieldProps) {
  const field = useField({ name, form, validators });
  const errorId = `${name}-error`;
  const errors = field.state.meta.errors;
  const errorText = errors
    ?.map((error) => (typeof error === 'string' ? error : error.message))
    .join(', ');
  const hasErrors = Boolean(errorText);

  return (
    <div className="grid gap-2">
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <div className="grid gap-2">
        <Input
          id={name}
          aria-invalid={hasErrors}
          aria-describedby={hasErrors ? errorId : undefined}
          value={String(field.state.value ?? '')}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          disabled={disabled || form.state.isSubmitting}
        />
        {errorText && (
          <p className="text-destructive-foreground text-xs" id={errorId}>
            {errorText}
          </p>
        )}
      </div>
    </div>
  );
}
