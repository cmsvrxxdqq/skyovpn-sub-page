import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { vibrate } from '@shared/utils/vibrate'

function cn(...inputs: (string | undefined | null | false)[]): string {
    return inputs.filter(Boolean).join(' ')
}

const glassButtonVariants = cva('glass-button', {
    variants: {
        size: {
            default: 'glass-button--default',
            sm: 'glass-button--sm',
            lg: 'glass-button--lg',
            icon: 'glass-button--icon'
        }
    },
    defaultVariants: {
        size: 'default'
    }
})

const glassButtonTextVariants = cva('glass-button-text', {
    variants: {
        size: {
            default: 'glass-button-text--default',
            sm: 'glass-button-text--sm',
            lg: 'glass-button-text--lg',
            icon: 'glass-button-text--icon'
        }
    },
    defaultVariants: {
        size: 'default'
    }
})

export interface GlassButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof glassButtonVariants> {
    contentClassName?: string
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
    ({ className, children, size, contentClassName, onPointerDown, ...props }, ref) => {
        const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
            const span = e.currentTarget.querySelector(
                '.glass-button-text'
            ) as HTMLSpanElement | null
            if (span) {
                const rect = span.getBoundingClientRect()
                const diameter = Math.max(rect.width, rect.height) * 2.2
                const x = e.clientX - rect.left - diameter / 2
                const y = e.clientY - rect.top - diameter / 2
                const ripple = document.createElement('span')
                ripple.className = 'glass-ripple'
                ripple.style.cssText = `width:${diameter}px;height:${diameter}px;left:${x}px;top:${y}px;`
                span.appendChild(ripple)
                setTimeout(() => ripple.remove(), 600)
            }
            if (e.pointerType === 'touch') {
                vibrate('tap')
            }
            onPointerDown?.(e)
        }

        return (
            <div className={cn('glass-button-wrap', className)}>
                <button
                    className={cn(glassButtonVariants({ size }))}
                    ref={ref}
                    onPointerDown={handlePointerDown}
                    {...props}
                >
                    <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
                        {children}
                    </span>
                </button>
                <div className="glass-button-shadow" />
            </div>
        )
    }
)

GlassButton.displayName = 'GlassButton'

export { GlassButton, glassButtonVariants }
