import { IconCloudRain } from '@tabler/icons-react'
import { Box, Center, Stack } from '@mantine/core'
import { TSubscriptionPagePlatformKey } from '@remnawave/subscription-page-types'

import {
    AccordionBlockRenderer,
    CardsBlockRenderer,
    InstallationGuideConnector,
    MinimalBlockRenderer,
    RawKeysWidget,
    SubscriptionLinkWidget,
    TimelineBlockRenderer
} from '@widgets/main'
import { useAppConfig, useAppConfigStoreActions, useCurrentLang } from '@entities/app-config-store'
import { LanguagePicker } from '@shared/ui/language-picker/language-picker.shared'
import { Page } from '@shared/ui'

import { LiquidGlassHeader } from './liquid-glass-header.component'
import { LiquidGlassSubscriptionInfo } from './liquid-glass-subscription-info.component'

interface IMainPageComponentProps {
    isMobile: boolean
    platform: TSubscriptionPagePlatformKey | undefined
}

const BLOCK_RENDERERS = {
    cards: CardsBlockRenderer,
    timeline: TimelineBlockRenderer,
    accordion: AccordionBlockRenderer,
    minimal: MinimalBlockRenderer
} as const

export const MainPageComponent = ({ isMobile, platform }: IMainPageComponentProps) => {
    const config = useAppConfig()
    const currentLang = useCurrentLang()
    const { setLanguage } = useAppConfigStoreActions()

    const brandName = config.brandingSettings.title
    let hasCustomLogo = !!config.brandingSettings.logoUrl

    if (hasCustomLogo) {
        if (config.brandingSettings.logoUrl.includes('docs.rw')) {
            hasCustomLogo = false
        }
    }

    const hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean> = {
        ios: Boolean(config.platforms.ios?.apps.length),
        android: Boolean(config.platforms.android?.apps.length),
        linux: Boolean(config.platforms.linux?.apps.length),
        macos: Boolean(config.platforms.macos?.apps.length),
        windows: Boolean(config.platforms.windows?.apps.length),
        androidTV: Boolean(config.platforms.androidTV?.apps.length),
        appleTV: Boolean(config.platforms.appleTV?.apps.length)
    }

    const atLeastOnePlatformApp = Object.values(hasPlatformApps).some((value) => value)

    return (
        <Page>
            <div className="header-wrapper animate-header" onAnimationEnd={(e) => { e.currentTarget.style.animation = 'none'; e.currentTarget.style.willChange = 'auto' }}>
                <LiquidGlassHeader
                    brandName={brandName}
                    hasCustomLogo={hasCustomLogo}
                    icon={<IconCloudRain size={isMobile ? 34 : 28} />}
                    isMobile={isMobile}
                    logoUrl={config.brandingSettings.logoUrl}
                >
                    <SubscriptionLinkWidget
                        hideGetLink={config.baseSettings.hideGetLinkButton}
                        supportUrl={config.brandingSettings.supportUrl}
                    />
                </LiquidGlassHeader>
            </div>

            <Box
                pb="lg"
                px={0}
                mt={20}
                style={{ position: 'relative', zIndex: 1 }}
            >
                <Stack gap={20}>
                    <div className="animate-card-1" onAnimationEnd={(e) => { e.currentTarget.style.animation = 'none'; e.currentTarget.style.willChange = 'auto' }}>
                        <LiquidGlassSubscriptionInfo isMobile={isMobile} />
                    </div>

                    {atLeastOnePlatformApp && (
                        <div className="animate-card-2" onAnimationEnd={(e) => { e.currentTarget.style.animation = 'none'; e.currentTarget.style.willChange = 'auto' }}>
                        <InstallationGuideConnector
                            BlockRenderer={
                                BLOCK_RENDERERS[config.uiConfig.installationGuidesBlockType]
                            }
                            hasPlatformApps={hasPlatformApps}
                            isMobile={isMobile}
                            platform={platform}
                        />
                        </div>
                    )}

                    <div className="animate-card-3" onAnimationEnd={(e) => { e.currentTarget.style.animation = 'none'; e.currentTarget.style.willChange = 'auto' }}>
                        <RawKeysWidget isMobile={isMobile} />
                    </div>

                    <Center>
                        <LanguagePicker
                            currentLang={currentLang}
                            locales={config.locales}
                            onLanguageChange={setLanguage}
                        />
                    </Center>

                    <Center pb="md">
                        <span className="skyovpn-watermark">⛈️ SkyoVPN | 2026</span>
                    </Center>
                </Stack>
            </Box>
        </Page>
    )
}
