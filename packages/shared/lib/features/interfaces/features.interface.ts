import { ICollectiblesFeatures } from './collectibles-features.interface'
import { IFeatureFlag } from './feature-flag.interface'
import { IGovernanceFeatures } from './governance-features.interface'
import { OnboardingFeatures } from './onboarding-features.interface'
import { ISettingsFeatures } from './settings-features.interface'
import { IWalletFeatures } from './wallet-features.interface'

export interface IFeatures {
    onboarding: OnboardingFeatures
    settings: ISettingsFeatures
    wallet: IWalletFeatures
    collectibles: ICollectiblesFeatures
    governance: IGovernanceFeatures
    developerTools: unknown & IFeatureFlag
    electron?: unknown
}
