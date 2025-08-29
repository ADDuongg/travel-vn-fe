import React from 'react';
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from 'react-hook-form';
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
import type { InputType } from '@interface/commons';

interface CustomInputProps {
  name: string;
  type?: InputType;
  label?: string | React.ReactNode;
  options?: { label: string; value: string }[];
  render?: (field: any) => React.ReactNode;
  labelPosition?: 'vertical' | 'horizontal';
  placeHolder?: string;
  rules?: RegisterOptions;
  [key: string]: any;
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
      className={props.className}
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
