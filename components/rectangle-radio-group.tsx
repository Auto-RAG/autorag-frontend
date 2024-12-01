"use client"


import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CustomRadioGroupProps {
  label: string
  options: { value: string; label: string }[],
  onValueChange: (value: string) => void
}

export default function RectangleRadioGroup({ label, options, onValueChange }: CustomRadioGroupProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor="radio-group">
        {label}
      </Label>
      <RadioGroup className="grid grid-cols-2 gap-2 p-1 rounded-lg border border-gray-200 dark:border-gray-800" id="radio-group" onValueChange={onValueChange}>
        {options.map((option) => (
          <div key={option.value} className="relative">
            <RadioGroupItem
              className="peer sr-only"
              id={option.value}
              value={option.value}
            />
            <Label
              className="flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted"
              htmlFor={option.value}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
