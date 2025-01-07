import { cn } from '@/lib/utils'
import Spinner from '@/components/spinner/spinner'
import { VariantProps, cva } from 'class-variance-authority'
import { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 focus:z-10',
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                stylish: 'bg-accent/10 px-3 py-1 text-sm font-normal leading-6 text-primary border border-primary/10',
                icon: 'text-primary bg-[#E0E0EC] dark:bg-background border border-border dark:text-dark h-12 px-5 py-2.5',
                activeIcon: 'text-white bg-gradient-to-br from-primary via-primary/90 to-primary/50 h-12 px-5 py-2.5 font-medium border-0 border-border dark:text-[#F2F3F9] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                menuItem: 'justify-between px-1.5 hover:bg-indigo-400/10 hover:text-foreground/80 rounded-sm cursor-default',
            },
            size: {
                'x-lg': 'h-13 py-[0.8rem] px-[1.1rem]',
                lg: 'h-11 py-3 px-4 text-md',
                default: 'h-10 py-2 px-4',
                icon: "size-12",
                sm: 'h-9 px-3 py-2',
                'x-sm': 'h-8 px-3 py-2',
            },
            linkDisabled: {
                true: 'opacity-50 pointer-events-none',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            linkDisabled: false,
        },
    }
)

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean
    asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            children,
            variant,
            isLoading,
            size,
            linkDisabled,
            asChild = false,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button"

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, linkDisabled }), className)}
                ref={ref}
                disabled={isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    children
                )}
            </Comp>
        )
    }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
export type { ButtonProps }