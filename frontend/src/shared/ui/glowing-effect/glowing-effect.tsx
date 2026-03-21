import classes from './glowing-effect.module.css'

interface GlowingEffectProps {
    borderWidth?: number
    speed?: number
}

export const GlowingEffect = ({ borderWidth = 1, speed = 8 }: GlowingEffectProps) => {
    return (
        <div
            className={classes.glowBorder}
            style={
                {
                    '--glow-border-width': `${borderWidth}px`,
                    '--glow-speed': `${speed}s`
                } as React.CSSProperties
            }
        />
    )
}
