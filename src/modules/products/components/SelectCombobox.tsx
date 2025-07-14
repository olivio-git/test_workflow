import { useState, Fragment, useEffect, useRef } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'


interface ComboboxSelectProps {
  value: string | null
  onChange: (value: string) => void
  options: any
  placeholder?: string
  className?: string
  searchPlaceholder?: string
  optionTag?:string
}

export function ComboboxSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar',
  className, 
  optionTag
}: ComboboxSelectProps) { 
  const [query, setQuery] = useState('')
  const comboboxInputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = query === ''
    ? options
    : options.filter((option:any) =>
        option[optionTag as keyof typeof option].toLowerCase().includes(query.toLowerCase())
      )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  useEffect(() => {
    if (comboboxInputRef.current) {
      setTimeout(() => {
        comboboxInputRef.current?.focus() 
      }, 0)
    }
  }, [filteredOptions])

  return (
    <Combobox 
      value={value || ''} 
      onChange={(selectedValue) => {
        if (selectedValue !== null) {
          onChange(selectedValue)
        }
        setQuery('')
      }}
    >
      {({ open }) => (
        <div className={cn('relative', className)}>
          <div className="relative w-full">
            <Combobox.Button className="w-full">
              <Combobox.Input
                placeholder={placeholder}
                ref={comboboxInputRef}
                className={cn(
                  'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  'pr-10'
                )}
                displayValue={(value: string) => {
                  const selected = options.find((opt:any) => opt.id === value)
                  return selected ? selected[optionTag as keyof typeof selected] : placeholder
                }}
                onChange={handleInputChange}
                onFocus={() => {
                  if (!open && comboboxInputRef.current) {
                    comboboxInputRef.current.value===placeholder ? comboboxInputRef.current.value="":null
                    comboboxInputRef.current.click()
                  }
                }}
                onMouseDown={()=>{
                    if(open && comboboxInputRef.current){
                        comboboxInputRef.current.value !== placeholder ? null: comboboxInputRef.current.value==placeholder 
                    }
                }}
              />
            </Combobox.Button>
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown 
                className={cn(
                  "h-4 w-4 opacity-50 transition-transform",
                  open ? "rotate-180" : ""
                )} 
              />
            </Combobox.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options 
              static
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg border border-gray-200 focus:outline-none sm:text-sm"
            >

              {filteredOptions.length === 0 ? (
                <div className="relative cursor-default select-none px-4 py-2 text-muted-foreground">
                  {query ? 'No se encontraron resultados' : 'No hay opciones disponibles'}
                </div>
              ) : (
                filteredOptions.map((option:any) => (
                  <Combobox.Option
                    key={option.id}
                    value={option.id}
                    className={({ active }) =>
                      cn(
                        'relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-gray-100',
                        active ? 'bg-accent text-accent-foreground' : 'text-foreground'
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
                          {option[optionTag as keyof typeof option]}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      )}
    </Combobox>
  )
}