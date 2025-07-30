import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EditableFieldProps {
  value: string | number;
  onSubmit: (value: string | number) => void;
  type?: 'text' | 'number' | 'email' | 'tel';
  numberProps?: {
    min?: number;
    max?: number;
    step?: number;
  };
  validate?: (value: string) => boolean;
  formatter?: (value: string | number) => string;
  parser?: (value: string) => string | number;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  showEditIcon?: boolean;
  variant?: 'ghost' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  /** Prefijo para mostrar (ej: $, €) */
  prefix?: string;
  /** Sufijo para mostrar (ej: %, kg) */
  suffix?: string;
  onEditStart?: () => void;
  onEditCancel?: () => void;
  onEditConfirm?: (value: string | number) => void;
  autoSelect?: boolean;
  confirmOnEnter?: boolean;
  cancelOnEscape?: boolean;
  confirmOnBlur?: boolean;
  editOnFocus?: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSubmit,
  type = 'text',
  numberProps,
  validate,
  formatter,
  parser,
  placeholder,
  className,
  buttonClassName,
  inputClassName,
  disabled = false,
  showEditIcon = true,
  variant = 'ghost',
  size = 'sm',
  prefix,
  suffix,
  onEditStart,
  onEditCancel,
  onEditConfirm,
  autoSelect = true,
  confirmOnEnter = true,
  cancelOnEscape = true,
  confirmOnBlur = true,
  editOnFocus = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const getDisplayValue = (val: string | number): string => {
    if (formatter) {
      return formatter(val);
    }
    
    if (type === 'number' && typeof val === 'number') {
      return val.toFixed(numberProps?.step ? 2 : 0);
    }
    
    return val.toString();
  };

  const parseValue = (val: string): string | number => {
    if (parser) {
      return parser(val);
    }
    
    if (type === 'number') {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? value : parsed;
    }
    
    return val;
  };

  const validateValue = (val: string): boolean => {
    if (validate) {
      return validate(val);
    }
    
    if (type === 'number') {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) return false;
      
      if (numberProps?.min !== undefined && parsed < numberProps.min) return false;
      if (numberProps?.max !== undefined && parsed > numberProps.max) return false;
    }
    
    return true;
  };

  const startEditing = () => {
    if (disabled) return;
    
    setIsEditing(true);
    setTempValue(value.toString());
    setError('');
    onEditStart?.();
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setTempValue('');
    setError('');
    onEditCancel?.();
  };

  const confirmEditing = () => {
    if (!validateValue(tempValue)) {
      setError('Valor inválido');
      return;
    }
    
    const parsedValue = parseValue(tempValue);
    setIsEditing(false);
    setError('');
    onEditConfirm?.(parsedValue);
    onSubmit(parsedValue);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (autoSelect) {
        inputRef.current.select();
      }
    }
  }, [isEditing, autoSelect]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (confirmOnEnter && e.key === 'Enter') {
      e.preventDefault();
      confirmEditing();
    }
    
    if (cancelOnEscape && e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  };

  const handleBlur = () => {
    if (confirmOnBlur) {
      confirmEditing();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.value);
    setError(''); // Limpiar error al escribir
  };

  const displayValue = getDisplayValue(value);
  const fullDisplayValue = `${prefix || ''}${displayValue}${suffix || ''}`;

  if (isEditing) {
    return (
      <div className={cn('relative', className)}>
        <Input
          ref={inputRef}
          type={type}
          value={tempValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            error && 'border-red-500 focus:border-red-500',
            inputClassName
          )}
          {...(type === 'number' && numberProps)}
        />
        {error && (
          <div className="absolute top-full left-0 mt-1 text-xs text-red-500">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={startEditing}
      disabled={disabled}
      onFocus={editOnFocus ? startEditing : undefined}
      className={cn(
        buttonClassName
      )}
    >
      <span className="flex-1 text-left">
        {fullDisplayValue}
      </span>
      {showEditIcon && !disabled && (
        <Edit3 className="h-3 w-3 text-gray-400 ml-1" />
      )}
    </Button>
  );
};
