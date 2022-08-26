import { get } from 'svelte/store'
import { selectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { NativeTokenOptions, TransactionOptions } from '@iota/wallet'
import { Converter } from '@lib/converter'
import { showAppNotification } from '@lib/notifications'
import { activeProfile, ProfileType } from '@core/profile'
import { isTransferring } from '@lib/wallet'
import { handleLedgerErrors } from '@core/ledger'
import { Activity } from '../classes'
import { VerificationStatus } from '../enums'
import { buildPersistedAssetFromIrc30Metadata } from '../helpers'
import { IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'
import { addPersistedAsset } from '../stores/persisted-assets.store'
import { preprocessTransaction } from '../utils'

export async function mintNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata
): Promise<void> {
    try {
        isTransferring.set(true)
        const account = get(selectedAccount)
        const nativeTokenOptions: NativeTokenOptions = {
            accountAddress: account.depositAddress,
            maximumSupply: Converter.decimalToHex(maximumSupply, true),
            circulatingSupply: Converter.decimalToHex(circulatingSupply, true),
            foundryMetadata: Converter.utf8ToHex(JSON.stringify(metadata), true),
        }
        const transactionOptions: TransactionOptions = {
            remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
        }
        const mintTokenTransaction = await account.mintNativeToken(nativeTokenOptions, transactionOptions)
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromIrc30Metadata(
            mintTokenTransaction.tokenId,
            metadata,
            VerificationStatus.Verified
        )
        const processedTransaction = preprocessTransaction(mintTokenTransaction.transaction)
        addPersistedAsset(persistedAsset)
        addActivityToAccountActivitiesInAllAccountActivities(account.id, new Activity(processedTransaction, account))
        showAppNotification({
            type: 'success',
            message: localize('notifications.mintNativeToken.success'),
            alert: true,
        })
        isTransferring.set(false)
        return Promise.resolve()
    } catch (reason) {
        isTransferring.set(false)

        const _activeProfile = get(activeProfile)
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerErrors(reason.error)
        }

        return Promise.reject(reason)
    }
}
