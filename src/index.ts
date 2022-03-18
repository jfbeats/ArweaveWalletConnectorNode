import { ArweaveApi } from 'arweave-wallet-connector/lib/Arweave.js'
import WebSockets from './WebSocket.js'

export const ArweaveWebSockets: any = ArweaveApi(WebSockets)
