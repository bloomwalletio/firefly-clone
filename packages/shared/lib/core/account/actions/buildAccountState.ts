import { AccountBalance } from '@iota/wallet'

import { getDepositAddress } from '@core/account/utils'

import { IAccount, IAccountMetadata, IAccountState } from '../interfaces'

export async function buildAccountState(account: IAccount, metadata: IAccountMetadata): Promise<IAccountState> {
    let balances: AccountBalance = {
        baseCoin: {
            total: '0',
            available: '0',
        },
        requiredStorageDeposit: {
            alias: '0',
            basic: '0',
            foundry: '0',
            nft: '0',
        },
        nativeTokens: [],
        nfts: [],
        foundries: [],
        potentiallyLockedOutputs: {},
        aliases: [],
    }
    let depositAddress: string
    let votingPower: string
    try {
        balances = await account.getBalance()
        depositAddress = await getDepositAddress(account)
        // temporally hidden for testing branch, remove before publish PR!
        // votingPower = await account.getVotingPower()
    } catch (err) {
        console.error(err)
    }

    return {
        ...account,
        ...metadata,
        depositAddress,
        balances,
        hasVotingPowerTransactionInProgress: false,
        hasVotingTransactionInProgress: false,
        isTransferring: false,
        votingPower,
    }
}
