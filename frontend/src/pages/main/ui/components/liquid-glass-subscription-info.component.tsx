import {
    IconArrowsUpDown,
    IconCalendar,
    IconCheck,
    IconCircleCheck,
    IconUser
} from '@tabler/icons-react'
import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core'

import {
    formatDate,
    getExpirationTextUtil
} from '@shared/utils/config-parser'
import { useSubscription } from '@entities/subscription-info-store'
import { useTranslation } from '@shared/hooks'

interface IProps {
    isMobile: boolean
}

export const LiquidGlassSubscriptionInfo = ({ isMobile }: IProps) => {
    const { t, currentLang, baseTranslations } = useTranslation()
    const subscription = useSubscription()

    const { user } = subscription

    const getStatusClass = () => {
        if (user.userStatus === 'ACTIVE' && user.daysLeft > 3) {
            return 'status-active'
        }
        if (user.userStatus === 'ACTIVE' && user.daysLeft <= 3 && user.daysLeft > 0) {
            return 'status-expiring'
        }
        return 'status-expired'
    }

    const isActive = user.userStatus === 'ACTIVE'
    const statusClass = getStatusClass()
    const bandwidthValue =
        user.trafficLimit === '0'
            ? `${user.trafficUsed} / ∞`
            : `${user.trafficUsed} / ${user.trafficLimit}`

    return (
        <Box
            className="liquid-glass"
            style={{
                position: 'relative',
                padding: isMobile ? '28px' : '38px 70px',
                maxWidth: '900px',
                margin: '0 auto',
                width: '100%'
            }}
        >
            <Stack gap={isMobile ? 'sm' : 'md'}>
                <Box
                    className={statusClass}
                    style={{
                        borderRadius: '90px',
                        padding: isMobile ? '12px 24px' : '16px 32px',
                        position: 'relative'
                    }}
                >
                    <Group gap="md" wrap="nowrap">
                        <IconCircleCheck color="white" size={isMobile ? 36 : 48} />
                        <Stack gap={4}>
                            <Text
                                c="white"
                                fw={900}
                                lh={1.2}
                                size={isMobile ? 'lg' : 'xl'}
                                style={{
                                    fontFamily: 'Unbounded, sans-serif',
                                    wordBreak: 'break-word'
                                }}
                            >
                                {user.username}
                            </Text>
                            <Text
                                c="white"
                                fw={900}
                                lh={1.2}
                                size={isMobile ? 'md' : 'lg'}
                                style={{
                                    fontFamily: 'Unbounded, sans-serif'
                                }}
                            >
                                {getExpirationTextUtil(
                                    user.expiresAt,
                                    currentLang,
                                    baseTranslations
                                )}
                            </Text>
                        </Stack>
                    </Group>
                </Box>

                <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md" verticalSpacing="md">
                    <Box
                        className="info-tile info-tile-username"
                        style={{
                            padding: isMobile ? '16px' : '20px 24px'
                        }}
                    >
                        <Group gap="xs" mb={4} wrap="nowrap">
                            <IconUser color="rgba(255, 255, 255, 0.6)" size={20} />
                            <Text
                                c="rgba(255, 255, 255, 0.6)"
                                fw={300}
                                lh={1}
                                size="15px"
                                style={{
                                    fontFamily: 'Unbounded, sans-serif'
                                }}
                            >
                                {t(baseTranslations.name)}
                            </Text>
                        </Group>
                        <Text
                            c="white"
                            fw={900}
                            pl={isMobile ? 0 : 20}
                            size={isMobile ? 'lg' : '26px'}
                            style={{
                                fontFamily: 'Unbounded, sans-serif',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {user.username}
                        </Text>
                    </Box>

                    <Box
                        className="info-tile info-tile-status"
                        style={{
                            padding: isMobile ? '16px' : '20px 24px'
                        }}
                    >
                        <Group gap="xs" mb={4} wrap="nowrap">
                            <IconCheck color="rgba(255, 255, 255, 0.6)" size={20} />
                            <Text
                                c="rgba(255, 255, 255, 0.6)"
                                fw={300}
                                lh={1}
                                size="15px"
                                style={{
                                    fontFamily: 'Unbounded, sans-serif'
                                }}
                            >
                                {t(baseTranslations.status)}
                            </Text>
                        </Group>
                        <Text
                            c="white"
                            fw={900}
                            pl={isMobile ? 0 : 20}
                            size={isMobile ? 'lg' : '26px'}
                            style={{
                                fontFamily: 'Unbounded, sans-serif',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {isActive ? t(baseTranslations.active) : t(baseTranslations.inactive)}
                        </Text>
                    </Box>

                    <Box
                        className="info-tile info-tile-expires"
                        style={{
                            padding: isMobile ? '16px' : '20px 24px'
                        }}
                    >
                        <Group gap="xs" mb={4} wrap="nowrap">
                            <IconCalendar color="rgba(255, 255, 255, 0.6)" size={20} />
                            <Text
                                c="rgba(255, 255, 255, 0.6)"
                                fw={300}
                                lh={1}
                                size="15px"
                                style={{
                                    fontFamily: 'Unbounded, sans-serif'
                                }}
                            >
                                {t(baseTranslations.expires)}
                            </Text>
                        </Group>
                        <Text
                            c="white"
                            fw={900}
                            pl={isMobile ? 0 : 20}
                            size={isMobile ? 'lg' : '26px'}
                            style={{
                                fontFamily: 'Unbounded, sans-serif',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {formatDate(user.expiresAt, currentLang, baseTranslations)}
                        </Text>
                    </Box>

                    <Box
                        className="info-tile info-tile-bandwidth"
                        style={{
                            padding: isMobile ? '16px' : '20px 24px'
                        }}
                    >
                        <Group gap="xs" mb={4} wrap="nowrap">
                            <IconArrowsUpDown color="rgba(255, 255, 255, 0.6)" size={20} />
                            <Text
                                c="rgba(255, 255, 255, 0.6)"
                                fw={300}
                                lh={1}
                                size="15px"
                                style={{
                                    fontFamily: 'Unbounded, sans-serif'
                                }}
                            >
                                {t(baseTranslations.bandwidth)}
                            </Text>
                        </Group>
                        <Text
                            c="white"
                            fw={900}
                            pl={isMobile ? 0 : 20}
                            size={isMobile ? 'lg' : '26px'}
                            style={{
                                fontFamily: 'Unbounded, sans-serif',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {bandwidthValue}
                        </Text>
                    </Box>
                </SimpleGrid>
            </Stack>
        </Box>
    )
}
