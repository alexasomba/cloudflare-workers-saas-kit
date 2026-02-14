import { useField } from '@tanstack/react-form';
import type { AnyFormApi } from '@tanstack/react-form';
import { Textarea } from '@workspace/ui/components/textarea';
import { FieldLabel } from '@workspace/ui/components/field';

interface TextareaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  validators?: Record<string, unknown>;
  form: AnyFormApi;
}

export function TextareaField({
  name,
  label,
  placeholder,
  disabled,
  validators,
  form,
}: TextareaFieldProps) {
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
        <Textarea
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
