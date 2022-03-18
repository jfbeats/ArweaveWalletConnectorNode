import { PromiseController } from 'arweave-wallet-connector/lib/utils/PromiseController.js'
import { generateUrl } from 'arweave-wallet-connector/lib/utils/Utils.js'
import type { Connection, PostMessageOptions, ProtocolInfo, AppInfo } from 'arweave-wallet-connector/lib/types'

import { WebSocketServer } from 'ws'
import open from 'open'
import type { WebSocket } from 'ws'



export default class WebSocketsConnection implements Connection {
	private _url: URL
	private _serverPort: number
	private _wss?: WebSocketServer
	private _ws?: WebSocket
	private _promiseController = new PromiseController()

	constructor(connectToUrl: string | URL, appInfo?: AppInfo, serverPort?: number) {
		this._url = generateUrl(connectToUrl)
		const urlInfo = {
			origin: window.location.origin,
		} as any
		if (appInfo?.name) { urlInfo.name = appInfo.name }
		if (appInfo?.logo) { urlInfo.logo = appInfo.logo }
		this._url.hash = new URLSearchParams(urlInfo).toString()
		this._serverPort = serverPort || 1985
	}

	connect() {
		if (this._wss) { return }
		open(this._url.href)
		this._wss = new WebSocketServer({ port: this._serverPort })
		this._wss.on('connection', ws => {
			if (this._ws) { return }
			this._ws = ws
			ws.on('message', data => {
				const message = JSON.parse(data.toString())
				if (typeof data !== 'object') { return }
				const { method, params, id, result, error, session } = message as { [key: string]: unknown }
				console.log('received: %s', message)
				if (this._promiseController.processResponse(message)) { return }
				if (typeof method !== 'string') { return }
				// reserved methods
				if (method === 'ready') {
					// todo
					return
				}
				if (method === 'change') { return }
			})
		})
	}

	disconnect() {
		this._wss?.close()
		this._ws?.close()
		this._wss = undefined
		this._ws = undefined
	}

	postMessage(method: string, params?: any[], options?: PostMessageOptions & ProtocolInfo) {
		if (!this._ws) { throw 'no connection' }
		this._ws.send('something')
	}
}
