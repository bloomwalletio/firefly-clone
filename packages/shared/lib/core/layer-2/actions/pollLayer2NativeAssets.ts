import { LAYER2_NATIVE_ASSETS_POLL_INTERVAL } from '../constants'
import { getLayer2NativeTokens } from './'

let pollInterval: number

export function pollLayer2NativeAssets(): void {
    getLayer2NativeTokens()
    pollInterval = window.setInterval(() => {
        getLayer2NativeTokens()
    }, LAYER2_NATIVE_ASSETS_POLL_INTERVAL)
}

export function clearLayer2NativeAssetsPoll(): void {
    clearInterval(pollInterval)
}
