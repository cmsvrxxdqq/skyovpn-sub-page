import { Box, Group, Stack, Text } from '@mantine/core'

import {
    formatDate,
    getExpirationTextUtil
} from '@shared/utils/config-parser'
import { useSubscription } from '@entities/subscription-info-store'
import { GlowingEffect } from '@shared/ui'
import { useTranslation } from '@shared/hooks'

interface IProps {
    isMobile: boolean
}

export const LiquidGlassSubscriptionInfo = ({ isMobile }: IProps) => {
    const { t, currentLang, baseTranslations } = useTranslation()
    const subscription = useSubscription()

    const { user } = subscription

    const getStatusInfo = () => {
        if (user.userStatus === 'ACTIVE' && user.daysLeft > 3) {
            return {
                class: 'status-active',
                color: 'var(--qd-status-active)',
                label: t(baseTranslations.active),
                highlight: false
            }
        }
        if (user.userStatus === 'ACTIVE' && user.daysLeft <= 3 && user.daysLeft > 0) {
            return {
                class: 'status-expiring',
                color: 'var(--qd-status-expiring)',
                label: t(baseTranslations.expiresIn),
                highlight: true
            }
        }
        if (user.userStatus === 'LIMITED') {
            return {
                class: 'status-limited',
                color: 'var(--qd-status-limited)',
                label: t(baseTranslations.inactive),
                highlight: true
            }
        }
        if (user.userStatus === 'DISABLED') {
            return {
                class: 'status-disabled',
                color: 'var(--qd-status-disabled)',
                label: t(baseTranslations.inactive),
                highlight: true
            }
        }
        return {
            class: 'status-expired',
            color: 'var(--qd-status-expired)',
            label: t(baseTranslations.expired),
            highlight: true
        }
    }

    const status = getStatusInfo()

    const formatBytes = (bytesStr: string | number): string => {
        const bytes = typeof bytesStr === 'string' ? parseFloat(bytesStr) : bytesStr
        if (isNaN(bytes) || bytes === 0) return '0 MB'
        const KB = 1024
        const MB = 1024 * KB
        const GB = 1024 * MB
        const TB = 1024 * GB
        if (bytes >= TB) return `${(bytes / TB).toFixed(2)} TB`
        if (bytes >= GB) return `${Math.round(bytes / GB)} GB`
        if (bytes >= MB) return `${Math.round(bytes / MB)} MB`
        return `${Math.round(bytes / 1024)} KB`
    }

    const bandwidthValue = (() => {
        const used = formatBytes(user.trafficUsedBytes)
        if (user.trafficLimitBytes === '0' || !user.trafficLimitBytes) return `${used} / ∞ GB`
        const limit = formatBytes(user.trafficLimitBytes)
        return `${used}/${limit}`
    })()

    return (
        <Box
            className="qd-card"
            style={{
                padding: isMobile ? '24px 20px' : '32px',
                width: '100%',
                border: 'none'
            }}
        >
            <GlowingEffect borderWidth={2} />
            <Stack gap={isMobile ? 20 : 24} align="center">
                {/* Status + Username */}
                <Stack gap={8} align="center" style={{ width: '100%' }}>
                    {/* Status dot + label */}
                    <Group gap={4} justify="center" wrap="nowrap" align="center">
                        <Box
                            className={status.class}
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: status.color,
                                animation: 'breathingPulse 3s ease-in-out infinite',
                                flexShrink: 0,
                                position: 'relative',
                                top: 0
                            }}
                        />
                        <Text
                            fw={600}
                            style={{
                                fontFamily: 'var(--qd-font-body)',
                                fontSize: '13px',
                                color: status.color,
                                letterSpacing: '0.0em',
                                textTransform: 'uppercase' as const
                            }}
                        >
                            {status.label}
                        </Text>
                    </Group>

                    {/* Username */}
                    <Text
                        fw={700}
                        ta="center"
                        style={{
                            fontFamily: 'var(--qd-font-display)',
                            fontSize: isMobile ? '18px' : '22px',
                            color: 'var(--qd-text-primary)',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.2,
                            wordBreak: 'break-all' as const,
                            maxWidth: '100%'
                        }}
                    >
                        {user.username}
                    </Text>

                    {/* Expiration subtitle */}
                    <Text
                        ta="center"
                        style={{
                            fontFamily: 'var(--qd-font-body)',
                            fontSize: '13px',
                            color: 'var(--qd-text-secondary)',
                            lineHeight: 1.4
                        }}
                    >
                        {getExpirationTextUtil(
                            user.expiresAt,
                            currentLang,
                            baseTranslations
                        )}
                    </Text>
                </Stack>

                {/* Metrics */}
                {isMobile ? (
                    // Mobile: vertical rows — label left, value right, no overflow possible
                    <Stack gap={0} style={{ width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--qd-surface-border)' }}>
                        {[
                            { label: t(baseTranslations.bandwidth), value: bandwidthValue, color: 'var(--qd-text-primary)' },
                            { label: t(baseTranslations.expires), value: formatDate(user.expiresAt, currentLang, baseTranslations), color: 'var(--qd-text-primary)' },
                            { label: t(baseTranslations.status), value: status.label, color: status.highlight ? status.color : 'var(--qd-text-primary)' }
                        ].map((item, i, arr) => (
                            <Box
                                key={item.label}
                                style={{
                                    background: 'var(--qd-surface-elevated)',
                                    borderBottom: i < arr.length - 1 ? '1px solid var(--qd-surface-border)' : 'none',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px'
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'var(--qd-font-body)',
                                        fontSize: '11px',
                                        fontWeight: 500,
                                        color: 'var(--qd-text-tertiary)',
                                        textTransform: 'uppercase' as const,
                                        letterSpacing: '0.06em',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0
                                    }}
                                >
                                    {item.label}
                                </Text>
                                <Text
                                    fw={700}
                                    style={{
                                        fontFamily: 'var(--qd-font-display)',
                                        fontSize: '13px',
                                        color: item.color,
                                        letterSpacing: '-0.02em',
                                        whiteSpace: 'nowrap',
                                        textAlign: 'right' as const
                                    }}
                                >
                                    {item.value}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    // Desktop: 3 columns
                    <Group gap={10} grow style={{ width: '100%' }} wrap="nowrap">
                        {[
                            { label: t(baseTranslations.bandwidth), value: bandwidthValue, color: 'var(--qd-text-primary)' },
                            { label: t(baseTranslations.expires), value: formatDate(user.expiresAt, currentLang, baseTranslations), color: 'var(--qd-text-primary)' },
                            { label: t(baseTranslations.status), value: status.label, color: status.highlight ? status.color : 'var(--qd-text-primary)' }
                        ].map((item) => (
                            <Box
                                key={item.label}
                                style={{
                                    background: 'var(--qd-surface-elevated)',
                                    border: '1px solid var(--qd-surface-border)',
                                    borderRadius: '14px',
                                    padding: '16px',
                                    textAlign: 'center' as const,
                                    flex: 1,
                                    minWidth: 0
                                }}
                            >
                                <Stack gap={4} align="center">
                                    <Text
                                        style={{
                                            fontFamily: 'var(--qd-font-body)',
                                            fontSize: '10px',
                                            fontWeight: 500,
                                            color: 'var(--qd-text-tertiary)',
                                            textTransform: 'uppercase' as const,
                                            letterSpacing: '0.06em',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {item.label}
                                    </Text>
                                    <Text
                                        fw={700}
                                        style={{
                                            fontFamily: 'var(--qd-font-display)',
                                            fontSize: '13px',
                                            color: item.color,
                                            letterSpacing: '-0.02em',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '100%'
                                        }}
                                    >
                                        {item.value}
                                    </Text>
                                </Stack>
                            </Box>
                        ))}
                    </Group>
                )}
            </Stack>
        </Box>
    )
}
