# Arweave Wallet Connector for Node.js Applications

Let you connect to wallet provider websites and sign transactions in node.js CLI, servers, utilities, etc. See [Arweave Wallet Connector](https://github.com/jfbeats/ArweaveWalletConnector) for more information. The arweave specific api is the same as the browser connector. Native applications can also use a local WebSocket server to connect to wallet providers like [arweave.app](https://arweave.app)

## How to use

Install from NPM:

```
npm i arweave-wallet-connector-node
```

Import / Create instance / Connect:

```js
import { ArweaveWebSockets } from 'arweave-wallet-connector-node'

const providerURL = 'arweave.app' // Or others
const yourApplicationInfo = { // Optional
	name: 'Your application name',
	logo: 'URL of your logo to be displayed to users'
}

const wallet = new ArweaveWebSockets(providerURL, yourApplicationInfo)

const address = await wallet.connect()
await wallet.signTransaction(arweaveJsTransactionObject)
```