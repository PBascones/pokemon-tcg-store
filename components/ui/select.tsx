import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const selectVariants = cva(
  "flex w-full items-center justify-between rounded-lg border bg-white text-sm transition-all duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default: "border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
        outline: "border-2 border-primary-200 hover:border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-primary-50/30",
        ghost: "border-transparent bg-gray-50 hover:bg-gray-100 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-primary-500/20",
      },
      size: {
        default: "h-11 px-4 py-2.5 text-sm",
        sm: "h-9 px-3 py-2 text-xs",
        lg: "h-12 px-5 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, children, placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    
    return (
      <div className="relative group">
        <select
          className={cn(
            selectVariants({ variant, size }),
            "appearance-none cursor-pointer pr-10 font-medium",
            isFocused && "ring-2 ring-primary-500/20 border-primary-500",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-gray-500">
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-all duration-200",
              isFocused 
                ? "text-primary-500 transform rotate-180" 
                : "text-gray-400 group-hover:text-gray-600"
            )} 
          />
        </div>
        
        {/* Decorative gradient border on focus */}
        <div 
          className={cn(
            "absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 transition-opacity duration-200 pointer-events-none -z-10",
            isFocused && "opacity-10"
          )}
        />
      </div>
    )
  }
)
Select.displayName = "Select"

// Componente para las opciones
export interface SelectOptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {}

const SelectOption = React.forwardRef<HTMLOptionElement, SelectOptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option
        className={cn(
          "py-2.5 px-4 text-sm font-medium bg-white hover:bg-primary-50 focus:bg-primary-100 transition-colors duration-150",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </option>
    )
  }
)
SelectOption.displayName = "SelectOption"

export { Select, SelectOption, selectVariants }
