"use client"

import * as React from "react"
import { X, Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Option = {
  label: string
  value: string
  disabled?: boolean
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  maxDisplayItems?: number
  renderOption?: (option: Option) => React.ReactNode
  renderBadge?: (option: Option) => React.ReactNode
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  disabled = false,
  className,
  maxDisplayItems,
  renderOption,
  renderBadge,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (value: string) => {
    onChange(selected.filter((item) => item !== value))
  }

  const handleSelect = (value: string) => {
    const option = options.find((opt) => opt.value === value)
    if (option?.disabled) return

    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const selectedOptions = options.filter((option) => selected.includes(option.value))
  const displayedOptions =
    maxDisplayItems && selectedOptions.length > maxDisplayItems
      ? selectedOptions.slice(0, maxDisplayItems)
      : selectedOptions

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 items-center">
            {displayedOptions.length > 0 ? (
              <>
                {displayedOptions.map((option) => (
                  <Badge key={option.value} variant="secondary" className="mr-1 mb-1">
                    {renderBadge ? renderBadge(option) : option.label}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(option.value)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleUnselect(option.value)
                      }}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {option.label}</span>
                    </button>
                  </Badge>
                ))}
                {maxDisplayItems && selectedOptions.length > maxDisplayItems && (
                  <Badge variant="secondary">+{selectedOptions.length - maxDisplayItems} more</Badge>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      option.disabled && "cursor-not-allowed opacity-60",
                      "flex items-center justify-between",
                    )}
                  >
                    <div className="flex-1">{renderOption ? renderOption(option) : option.label}</div>
                    {isSelected && <Check className="h-4 w-4 ml-2" />}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
