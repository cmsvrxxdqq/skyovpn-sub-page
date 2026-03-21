import {
    Badge,
    Box,
    CopyButton,
    Group,
    Image,
    ScrollArea,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { IconCheck, IconCopy, IconKey, IconQrcode } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'

import { useSubscription } from '@entities/subscription-info-store'
import { GlassButton } from '@shared/ui'
import { vibrate } from '@shared/utils/vibrate'
import { useTranslation } from '@shared/hooks'

import classes from './raw-keys.module.css'

interface ParsedLink {
    fullLink: string
    name: string
}

const parseLinks = (links: string[]): ParsedLink[] => {
    return links.map((link) => {
        const hashIndex = link.lastIndexOf('#')
        let name = 'Unknown'

        if (hashIndex !== -1) {
            const encodedName = link.substring(hashIndex + 1)
            try {
                name = decodeURIComponent(encodedName)
            } catch {
                name = encodedName
            }
        }

        return {
            name,
            fullLink: link
        }
    })
}

interface IProps {
    isMobile: boolean
}

export const RawKeysWidget = ({ isMobile }: IProps) => {
    const { t, baseTranslations } = useTranslation()
    const subscription = useSubscription()

    if (subscription.links.length === 0) return null

    const parsedLinks = parseLinks(subscription.links)

    const handleShowQr = (link: ParsedLink) => {
        const qrCode = renderSVG(link.fullLink, {
            whiteColor: '#0f0f11',
            blackColor: '#C5CDE0'
        })

        modals.open({
            centered: true,
            title: link.name,
            classNames: {
                content: classes.modalContent,
                header: classes.modalHeader,
                title: classes.modalTitle
            },
            children: (
                <Stack align="center">
                    <Image
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(qrCode)}`}
                        style={{ borderRadius: 'var(--mantine-radius-md)' }}
                    />
                    <Text c="dimmed" size="sm" ta="center">
                        {t(baseTranslations.scanToImport)}
                    </Text>
                </Stack>
            )
        })
    }

    return (
        <Box style={{ width: '100%' }}>
            <Box
                className="qd-card"
                style={{
                    position: 'relative',
                    padding: isMobile ? '20px' : '28px'
                }}
            >
                <Stack gap="md">
                    <Group gap="sm" justify="space-between">
                        <Title
                            c="var(--qd-text-primary)"
                            fw={700}
                            order={4}
                            size="18px"
                            style={{
                                fontFamily: 'var(--qd-font-display)',
                                letterSpacing: '-0.03em'
                            }}
                        >
                            {t(baseTranslations.connectionKeysHeader)}
                        </Title>
                        {parsedLinks.length > 1 && (
                            <Badge
                                color="gray"
                                size="sm"
                                variant="light"
                                style={{ fontFamily: 'var(--qd-font-body)' }}
                            >
                                {parsedLinks.length}
                            </Badge>
                        )}
                    </Group>

                <ScrollArea.Autosize mah={300} scrollbars="y">
                    <Stack gap={0}>
                        {parsedLinks.map((link, index) => (
                            <Box
                                className={classes.keyBox}
                                key={index}
                                px="sm"
                                py="xs"
                                style={{
                                    borderBottom: index < parsedLinks.length - 1
                                        ? '1px solid var(--qd-surface-border)'
                                        : 'none'
                                }}
                            >
                                <Box className={classes.keyRow}>
                                    <Box className={classes.keyInfo}>
                                        <IconKey
                                            size={isMobile ? 15 : 16}
                                            style={{
                                                color: 'rgba(197, 205, 224, 0.70)',
                                                flexShrink: 0
                                            }}
                                        />
                                        <Box className={classes.keyName}>
                                            <Text
                                                c="var(--qd-text-primary)"
                                                fw={500}
                                                size={isMobile ? 'xs' : 'sm'}
                                                span
                                                style={{ fontFamily: 'var(--qd-font-body)' }}
                                            >
                                                {link.name}
                                            </Text>
                                        </Box>
                                    </Box>

                                    <Group gap={4} wrap="nowrap">
                                        <CopyButton value={link.fullLink}>
                                            {({ copied, copy }) => (
                                                <GlassButton
                                                    size="icon"
                                                    onClick={() => {
                                                        vibrate('drop')
                                                        copy()
                                                    }}
                                                    style={{ color: copied ? '#2dd4bf' : undefined }}
                                                >
                                                    {copied ? (
                                                        <IconCheck size={isMobile ? 14 : 16} />
                                                    ) : (
                                                        <IconCopy size={isMobile ? 14 : 16} />
                                                    )}
                                                </GlassButton>
                                            )}
                                        </CopyButton>

                                        <GlassButton
                                            size="icon"
                                            onClick={() => {
                                                vibrate('tap')
                                                handleShowQr(link)
                                            }}
                                            style={{ color: 'rgba(197, 205, 224, 0.80)' }}
                                        >
                                            <IconQrcode size={isMobile ? 14 : 16} />
                                        </GlassButton>
                                    </Group>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </ScrollArea.Autosize>
                </Stack>
            </Box>
        </Box>
    )
}
