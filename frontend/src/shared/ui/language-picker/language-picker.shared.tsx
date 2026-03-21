import { getLanguageInfo, TSubscriptionPageLanguageCode } from '@remnawave/subscription-page-types'
import { ActionIcon, Menu, Text, useDirection } from '@mantine/core'
import { IconLanguage } from '@tabler/icons-react'
import { useEffect } from 'react'

import { vibrate } from '@shared/utils/vibrate'

interface IProps {
    currentLang: TSubscriptionPageLanguageCode
    locales: TSubscriptionPageLanguageCode[]
    onLanguageChange: (lang: TSubscriptionPageLanguageCode) => void
}

export function LanguagePicker(props: IProps) {
    const { locales, currentLang, onLanguageChange } = props

    const { toggleDirection, dir } = useDirection()

    useEffect(() => {
        if (currentLang === 'fa' && dir === 'ltr') {
            toggleDirection()
        }
        if (currentLang !== 'fa' && dir === 'rtl') {
            toggleDirection()
        }
    }, [currentLang])

    const changeLanguage = (value: TSubscriptionPageLanguageCode) => {
        onLanguageChange(value)
    }

    const items = locales.map((item) => {
        const localeInfo = getLanguageInfo(item)
        if (!localeInfo) return null
        return (
            <Menu.Item
                key={item}
                leftSection={<Text>{localeInfo.emoji}</Text>}
                onClick={() => {
                    vibrate('doubleTap')
                    changeLanguage(item)
                }}
            >
                {localeInfo.nativeName}
            </Menu.Item>
        )
    })

    if (locales.length === 1) return null

    return (
        <Menu
            position="bottom"
            width={150}
            withArrow={false}
            withinPortal
            styles={{
                dropdown: {
                    background: 'rgba(22, 22, 26, 0.97)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '14px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(255, 255, 255, 0.06) inset',
                    padding: '6px'
                },
                item: {
                    fontFamily: 'var(--qd-font-body)',
                    color: 'rgba(255, 255, 255, 0.80)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    padding: '8px 12px',
                    transition: 'background 0.15s ease, color 0.15s ease'
                }
            }}
        >
            <Menu.Target>
                <ActionIcon
                    color="gray"
                    radius="md"
                    size="xl"
                    style={{
                        background: 'rgba(28, 28, 32, 0.72)',
                        border: '1.5px solid rgba(255, 255, 255, 0.10)',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)'
                    }}
                    variant="default"
                >
                    <IconLanguage size={22} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown className="lang-picker-dropdown" mah={250} style={{ overflowY: 'auto' }}>{items}</Menu.Dropdown>
        </Menu>
    )
}
