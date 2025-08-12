import { useState, Fragment, useRef, useMemo } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
    id: string | number
    [key: string]: any
}

interface ComboboxSelectProps {
    value: string | number | undefined
    onChange: (value: string | number) => void
    options: Option[]
    placeholder?: string
    className?: string
    optionTag: string // Requerido para evitar errores
    allowClear?: boolean // Nueva prop para permitir limpiar selección
    disabled?: boolean
    error?: boolean
    enableAllOption?: boolean
    searchPlaceholder?: string //quitar este campo si no se usa
}

export function ComboboxSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Seleccionar...',
    className,
    optionTag,
    allowClear = false,
    disabled = false,
    error = false,
    enableAllOption
}: ComboboxSelectProps) {
    const internalValue = !value
        ? enableAllOption ? 'all' : ''
        : value

    const [query, setQuery] = useState('')
    const comboboxInputRef = useRef<HTMLInputElement>(null)

    // Validación temprana
    if (!optionTag) {
        console.warn('ComboboxSelect: optionTag is required')
        return null
    }

    const baseOptions = enableAllOption
        ? [{ id: "all", [optionTag]: "TODAS" }, ...options]
        : options

    const filteredOptions =
        query === ''
            ? baseOptions
            : baseOptions.filter((option: Option) => {
                const optionValue = option[optionTag]
                return optionValue?.toString().toLowerCase().includes(query.toLowerCase())
            })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange('')
        setQuery('')
    }

    const selectedOption = useMemo(() => {
        return baseOptions.find((opt) => opt.id.toString() === internalValue.toString()) ?? null
    }, [internalValue, baseOptions])

    return (
        <Combobox
            value={internalValue.toString()}
            onChange={(selectedValue: any) => {
                if (selectedValue !== null) {
                    onChange(selectedValue)
                }
                setQuery('')
            }}
            disabled={disabled}
        >
            {({ open }) => (
                <div className={cn('relative', className)}>
                    <div className="relative w-full">
                        <ComboboxButton className="w-full" disabled={disabled}>
                            <ComboboxInput
                                ref={comboboxInputRef}
                                placeholder={placeholder}
                                className={cn(
                                    'flex h-8 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                    error ? 'border-red-500 focus:ring-red-500' : 'border-input',
                                    'pr-10'
                                )}
                                displayValue={() => selectedOption?.[optionTag] || (enableAllOption ? 'TODAS' : '')}
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                        </ComboboxButton>

                        {/* Botón para limpiar selección */}
                        {allowClear && internalValue && !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute inset-y-0 right-8 flex items-center pr-1 hover:text-red-500 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}

                        {/* Ícono chevron */}
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2" disabled={disabled}>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 opacity-50 transition-transform duration-200",
                                    open ? "rotate-180" : "",
                                    disabled ? "opacity-25" : ""
                                )}
                            />
                        </ComboboxButton>
                    </div>

                    <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <ComboboxOptions
                            static
                            className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md bg-popover p-1 text-sm shadow-lg border border-gray-200 focus:outline-none sm:text-sm"
                        >
                            {filteredOptions.length === 0 ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-muted-foreground text-center">
                                    {query ? (
                                        <>
                                            No se encontraron resultados para "{query}"
                                        </>
                                    ) : (
                                        'No hay opciones disponibles'
                                    )}
                                </div>
                            ) : (
                                filteredOptions.map((option: Option) => (
                                    <ComboboxOption
                                        key={option.id}
                                        value={option.id.toString()}
                                        className={({ focus }) =>
                                            cn(
                                                'relative cursor-pointer select-none py-1.5 pl-10 pr-4 transition-colors rounded',
                                                focus ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-gray-50'
                                            )
                                        }
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span className={cn(
                                                    'block truncate',
                                                    selected ? 'font-medium' : 'font-normal'
                                                )}>
                                                    {option[optionTag]}
                                                </span>
                                                {selected && (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                        <Check className="h-4 w-4" />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </ComboboxOption>
                                ))
                            )}
                        </ComboboxOptions>
                    </Transition>
                </div>
            )}
        </Combobox>
    )
}