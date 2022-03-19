import { ArweaveApi } from 'arweave-wallet-connector/lib/Arweave.js'
import WebSockets from './WebSocket.js'

export const ArweaveWebSockets = ArweaveApi(WebSockets)

const test = new ArweaveWebSockets('http://localhost:8080')
test.connect()
setInterval(() => test.getArweaveConfig().then(res => console.log(res)), 10000)