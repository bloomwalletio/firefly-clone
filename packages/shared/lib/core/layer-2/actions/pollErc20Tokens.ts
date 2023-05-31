import { LAYER2_NATIVE_ASSETS_POLL_INTERVAL } from '../constants'
import { getAndUpdateSelectedAccountLayer2Tokens } from './getAndUpdateSelectedAccountLayer2Tokens'

let pollInterval: number

export function pollErc20Tokens(): void {
    clearErc20TokensPoll()
    void getAndUpdateSelectedAccountLayer2Tokens()
    pollInterval = window.setInterval(() => {
        void getAndUpdateSelectedAccountLayer2Tokens()
    }, LAYER2_NATIVE_ASSETS_POLL_INTERVAL)
}

export function clearErc20TokensPoll(): void {
    clearInterval(pollInterval)
}
