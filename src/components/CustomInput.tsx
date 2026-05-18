import React, { useState } from 'react';
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { MultiSelect } from './ui/multiple-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from './ui/label';
import { DatePicker } from './ui/datepicker';
import * as I from '@/types/commons';

interface CustomInputProps {
  name: string;
  type?: I.InputType;
  label?: string | React.ReactNode;
  options?: { label: string; value: string }[];
  render?: (field: any) => React.ReactNode;
  labelPosition?: 'vertical' | 'horizontal';
  placeHolder?: string;
  rules?: RegisterOptions;
  [key: string]: any;
}

type PasswordFieldProps = {
  field: Record<string, unknown>;
  name: string;
  className?: string;
  [key: string]: unknown;
};

function PasswordField({ field, name, className, ...props }: PasswordFieldProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        {...props}
        {...field}
        name={name}
        type={visible ? 'text' : 'password'}
        className={cn(className, 'pr-12')}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((current) => !current)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label={
          visible
            ? t('input.hide_password', { defaultValue: 'Hide password' })
            : t('input.show_password', { defaultValue: 'Show password' })
        }
      >
        {visible ? (
          <EyeOff className="size-5" aria-hidden />
        ) : (
          <Eye className="size-5" aria-hidden />
        )}
      </button>
    </div>
  );
}

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  type,
  label,
  options = [],
  labelPosition = 'vertical',
  placeHolder = 'Chọn...',
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const renderInput = (field: any) => {
    switch (type) {
      case 'date':
        return (
          <DatePicker
            value={field.value}
            onChange={field.onChange}
            {...props}
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center gap-4">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="shadow-md"
              {...props}
            />
            {label &&
              (typeof label === 'string' ? (
                <Label>{label}</Label>
              ) : (
                <div className="text-sm text-gray-600 leading-5">{label}</div>
              ))}
          </div>
        );
      case 'multi-select':
        return (
          <MultiSelect
            name={name}
            options={options}
            isMulti
            {...props}
            {...field}
          />
        );
      case 'select':
        return (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger {...props} classNameContainer="w-full">
              <SelectValue placeholder={placeHolder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'autocomplete':
        return (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger {...props}>
              <SelectValue placeholder={placeHolder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'password':
        return <PasswordField field={field} name={name} {...props} />;
      case 'custom-input':
        if (props.render) {
          return props.render(field);
        }
        return null;
      case 'text':
      default:
        return <Input {...props} {...field} name={name} type="text" />;
    }
  };

  const getErrorMessage = (): string | undefined => {
    if (errors[name]) {
      const error = errors[name];
      if (typeof error === 'string') {
        return error;
      } else if ('message' in error && typeof error.message === 'string') {
        return error.message;
      }
    }
    return undefined;
  };
  const isRequired =
    typeof props.rules?.required === 'string' || props.rules?.required === true;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: labelPosition === 'horizontal' ? 'row' : 'column',
        alignItems: 'start',
        ...props.style,
      }}
      className={cn('w-full', props.className)}
    >
      {/* Chỉ render label nếu không phải checkbox */}
      {label && type !== 'checkbox' && (
        <Label
          style={{
            marginRight: labelPosition === 'horizontal' ? '8px' : '0',
            marginBottom: labelPosition === 'vertical' ? '8px' : '0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {label}
          {isRequired && <span style={{ color: 'red' }}>*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        rules={props.rules}
        render={({ field }) => (
          <>
            {renderInput(field)}
            {getErrorMessage() && (
              <p style={{ color: 'red' }}>{getErrorMessage()}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default CustomInput;
