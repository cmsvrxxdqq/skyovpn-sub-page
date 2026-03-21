import { useRef } from 'react'
import { MeshGradient } from '@paper-design/shaders-react'

import classes from './animated-background.module.css'

export function AnimatedBackground() {
    const frame = useRef(Math.random() * 100_000)

    return (
        <div className={classes.container}>
            <MeshGradient
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                colors={['#000000', '#1a1a1a', '#333333', '#ffffff']}
                speed={0.4}
                frame={frame.current}
            />
        </div>
    )
}
