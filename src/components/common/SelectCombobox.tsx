import { useState, Fragment, useRef, useMemo, useEffect } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react'
import { Check, ChevronDown, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDebounce } from 'use-debounce'

interface Option {
    id: string | number
    [key: string]: string | number | null | undefined
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
    isLoadingData?: boolean
    searchPlaceholder?: string //quitar este campo si no se usa
    onSearch?: (query: string) => void // Función para realizar búsqueda externa
    isSearching?: boolean // Estado de carga durante búsqueda
    searchDebounceMs?: number // Tiempo de debounce para la búsqueda (por defecto 300ms)
    enableExternalSearch?: boolean // Habilitar/deshabilitar búsqueda externa
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
    enableAllOption,
    isLoadingData = false,
    onSearch,
    isSearching = false,
    searchDebounceMs = 500,
    enableExternalSearch = false,
}: ComboboxSelectProps) {
    const internalValue = !value
        ? enableAllOption ? 'all' : ''
        : value

    const [query, setQuery] = useState('')
    const [dropdownPosition, setDropdownPosition] = useState({
        top: true,
        left: true,
        maxHeight: 288 // 18rem por defecto
    })

    const comboboxInputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const baseOptions = useMemo(() => {
        return enableAllOption
            ? [{ id: "all", [optionTag]: "TODAS" }, ...options]
            : options
    }, [enableAllOption, options, optionTag])

    const [debouncedQuery] = useDebounce(query, searchDebounceMs)

    useEffect(() => {
        if (enableExternalSearch && onSearch) {
            onSearch(debouncedQuery)
        }
    }, [debouncedQuery, enableExternalSearch, onSearch])

    const filteredOptions = useMemo(() => {
        if (enableExternalSearch) {
            return baseOptions
        }

        return query === ''
            ? baseOptions
            : baseOptions.filter((option: Option) => {
                const optionValue = option[optionTag]
                return optionValue?.toString().toLowerCase().includes(query.toLowerCase())
            })
    }, [enableExternalSearch, baseOptions, query, optionTag])

    const calculatePosition = () => {
        if (!comboboxInputRef.current) return

        const inputRect = comboboxInputRef.current.getBoundingClientRect()
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        const spaceBelow = viewport.height - inputRect.bottom
        const spaceAbove = inputRect.top
        const spaceRight = viewport.width - inputRect.left
        const spaceLeft = inputRect.left

        const estimatedDropdownHeight = Math.min(288, filteredOptions.length * 36 + 16) // ~36px por opción + padding

        const shouldShowAbove = spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow

        const shouldShowLeft = spaceRight < 200 && spaceLeft > spaceRight

        // Calcular altura máxima disponible
        const maxHeight = shouldShowAbove
            ? Math.min(spaceAbove - 8, 288)
            : Math.min(spaceBelow - 8, 288)

        setDropdownPosition({
            top: !shouldShowAbove,
            left: !shouldShowLeft,
            maxHeight: maxHeight
        })
    }

    useEffect(() => {
        calculatePosition()
    }, [filteredOptions.length])

    useEffect(() => {
        const handleResize = () => calculatePosition()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange('')
        setQuery('')

        if (enableExternalSearch && onSearch) {
            onSearch('')
        }
    }

    const selectedOption = useMemo(() => {
        return baseOptions.find((opt) => opt.id.toString() === internalValue.toString()) ?? null
    }, [internalValue, baseOptions])

    // Validación temprana
    if (!optionTag) {
        console.warn('ComboboxSelect: optionTag is required')
        return null
    }

    const showLoading = isLoadingData || (enableExternalSearch && isSearching)

    return (
        <Combobox
            value={internalValue.toString()}
            onChange={(selectedValue: string) => {
                if (selectedValue !== null) {
                    onChange(selectedValue)
                }
                setQuery('')

                if (enableExternalSearch && onSearch) {
                    onSearch('')
                }
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
                                displayValue={() => String(selectedOption?.[optionTag] || (enableAllOption ? 'TODAS' : ''))}
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

                        {/* Ícono chevron o loading durante búsqueda */}
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2" disabled={disabled}>
                            {enableExternalSearch && isSearching ? (
                                <Loader2 className="h-4 w-4 opacity-50 animate-spin" />
                            ) : (
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 opacity-50 transition-transform duration-200",
                                        open ? "rotate-180" : "",
                                        disabled ? "opacity-25" : ""
                                    )}
                                />
                            )}
                        </ComboboxButton>
                    </div>

                    <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => {
                            setQuery('')
                            // Limpiar búsqueda externa al cerrar
                            if (enableExternalSearch && onSearch) {
                                onSearch('')
                            }
                        }}
                        beforeEnter={calculatePosition}
                    >
                        <ComboboxOptions
                            ref={dropdownRef}
                            static
                            className={cn(
                                "absolute z-[9999] w-full overflow-auto rounded-md bg-popover p-1 text-sm shadow-lg border border-gray-200 focus:outline-none sm:text-sm",
                                dropdownPosition.top ? "mt-1" : "mb-1 bottom-full"
                            )}
                            style={{
                                maxHeight: `${dropdownPosition.maxHeight}px`
                            }}
                        >
                            {
                                showLoading ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-muted-foreground text-center flex justify-center items-center gap-2">
                                        <Loader2 className='size-4 animate-spin' />
                                        {enableExternalSearch && isSearching ? 'Buscando...' : 'Cargando datos'}
                                    </div>
                                ) : filteredOptions.length === 0 ? (
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