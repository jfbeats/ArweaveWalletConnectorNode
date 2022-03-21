# Arweave Wallet Connector for Node.js Applications

See the [Arweave Wallet Connector](https://github.com/jfbeats/ArweaveWalletConnector) for more information. The arweave interface is the same.

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

await wallet.connect()
await wallet.signTransaction(arweaveJsTransactionObject)
```