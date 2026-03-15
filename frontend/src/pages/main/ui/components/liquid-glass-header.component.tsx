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
    children
}: IProps) => {
    return (
        <Box
            className="header-liquid-glass"
            style={{
                position: 'relative',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 44px',
                background: 'rgba(0, 0, 0, 0.01)',
                borderRadius: '60px',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
                filter: 'brightness(110%)'
            }}
        >
            <Group gap="sm" style={{ userSelect: 'none' }} wrap="nowrap">
                {hasCustomLogo ? (
                    <Image
                        alt="logo"
                        fit="contain"
                        src={logoUrl}
                        style={{
                            width: '42px',
                            height: '42px',
                            flexShrink: 0
                        }}
                    />
                ) : (
                    icon
                )}
                <Text
                    c="white"
                    fw={900}
                    size="32px"
                    style={{
                        fontFamily: 'Unbounded, sans-serif',
                        lineHeight: 'normal',
                        letterSpacing: '0'
                    }}
                >
                    {brandName}
                </Text>
            </Group>

            {children}
        </Box>
    )
}
