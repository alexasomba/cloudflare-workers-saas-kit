import { useField } from '@tanstack/react-form';
import type { AnyFormApi } from '@tanstack/react-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { FieldLabel } from '@workspace/ui/components/field';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  validators?: Record<string, unknown>;
  onValueChange?: (value: string) => void;
  form: AnyFormApi;
}

export function SelectField({
  name,
  label,
  options,
  placeholder,
  disabled,
  validators,
  onValueChange,
  form,
}: SelectFieldProps) {
  const field = useField({ name, form, validators });
  const errorText = field.state.meta.errors
    ?.map((error) => (typeof error === 'string' ? error : error.message))
    .join(', ');
  const errorId = `${name}-error`;

  return (
    <div className="grid gap-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="grid gap-2">
        <Select
          value={String(field.state.value ?? '')}
          onValueChange={(v) => {
            const nextValue = v ?? '';
            field.handleChange(nextValue);
            onValueChange?.(nextValue);
          }}
          disabled={disabled || form.state.isSubmitting}
        >
          <SelectTrigger>
            {String(field.state.value ?? '') ? (
              <SelectValue />
            ) : (
              <span className="text-muted-foreground" data-placeholder>
                {placeholder ?? 'Select'}
              </span>
            )}
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorText && (
          <p className="text-destructive-foreground text-xs" id={errorId}>
            {errorText}
          </p>
        )}
      </div>
    </div>
  );
}
