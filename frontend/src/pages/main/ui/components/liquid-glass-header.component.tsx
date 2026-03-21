import { Box, Group, Image, Text } from '@mantine/core'
import { ReactNode } from 'react'

interface IProps {
    brandName: string
    children: ReactNode
    hasCustomLogo: boolean
    icon: ReactNode
    isMobile: boolean
    logoUrl: string
}

export const LiquidGlassHeader = ({
    brandName,
    hasCustomLogo,
    logoUrl,
    icon,
    isMobile,
    children
}: IProps) => {
    const logoSize = isMobile ? 34 : 28
    const fontSize = isMobile ? '18px' : 'clamp(13px, 2.6vw, 17px)'

    return (
        <Box
            className="header-liquid-glass"
            style={{
                position: 'relative',
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 10px 0 16px'
            }}
        >
            <Group gap={isMobile ? 12 : 10} style={{ userSelect: 'none', flexShrink: 0, position: 'relative', zIndex: 1 }} wrap="nowrap">
                {hasCustomLogo ? (
                    <Image
                        alt="logo"
                        fit="contain"
                        src={logoUrl}
                        style={{
                            width: `${logoSize}px`,
                            height: `${logoSize}px`,
                            flexShrink: 0
                        }}
                    />
                ) : (
                    icon
                )}
                <Text
                    fw={700}
                    style={{
                        fontFamily: 'var(--qd-font-display)',
                        fontSize,
                        lineHeight: 'normal',
                        letterSpacing: '-0.04em',
                        whiteSpace: 'nowrap',
                        color: 'var(--qd-text-primary)'
                    }}
                >
                    {brandName}
                </Text>
            </Group>

            <div className="header-actions-pill">
                {children}
            </div>
        </Box>
    )
}
