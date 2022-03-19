import { PromiseController } from 'arweave-wallet-connector/lib/utils/PromiseController.js'
import { generateUrl } from 'arweave-wallet-connector/lib/utils/Utils.js'
import type { Connection, PostMessageOptions, ProtocolInfo, AppInfo } from 'arweave-wallet-connector/lib/types'

import { WebSocketServer } from 'ws'
import open from 'open'
import type { WebSocket } from 'ws'

type ChannelController = {
	promise?: Promise<unknown>,
	resolve?: (value?: unknown) => void,
	reject?: (value?: unknown) => void,
}

export default class WebSocketsConnection implements Connection {
	private _url: URL
	private _serverPort: number
	private _wss?: WebSocketServer
	private _ws?: WebSocket
	private _channelController: ChannelController = {}
	private _promiseController = new PromiseController()

	constructor(connectToUrl: string | URL, appInfo?: AppInfo, serverPort?: number) {
		this._serverPort = serverPort || 1985
		this._url = generateUrl(connectToUrl)
		const urlInfo = {
			origin: 'ws://localhost:' + this._serverPort,
		} as any
		if (appInfo?.name) { urlInfo.name = appInfo.name }
		if (appInfo?.logo) { urlInfo.logo = appInfo.logo }
		this._url.hash = new URLSearchParams(urlInfo).toString()
	}

	connect() {
		if (this._wss) { return }
		
		const promise = new Promise((resolve, reject) => this._channelController = { resolve, reject })
		this._channelController.promise = promise
		
		this._wss = new WebSocketServer({ port: this._serverPort })
		this._wss.on('connection', ws => {
			if (this._ws) { return }
			this._ws = ws
			ws.on('message', data => {
				const message = JSON.parse(data.toString())
				console.log('received: %s', message)
				if (typeof data !== 'object') { return }
				if (this._promiseController.processResponse(message)) { return }
				const { method, params, id, result, error, session } = message as { [key: string]: unknown }
				if (typeof method !== 'string') { return }
				if (method === 'connect') { this._channelController?.resolve?.() }
			})
		})
		
		open(this._url.href)
	}

	disconnect() {
		this._channelController?.reject?.()
		this._wss?.close()
		this._ws?.close()
		this._wss = undefined
		this._ws = undefined
	}

	postMessage(method: string, params?: any[], options?: PostMessageOptions & ProtocolInfo) {
		if (!this._ws) { throw 'no connection' }
		const message = { method, params, protocol: options?.protocol, version: options?.version, jsonrpc: '2.0' }
		const promise = this._promiseController.newMessagePromise(message, options)
		this.deliverMessage(message, options)
		return promise
	}
	
	private deliverMessage (message: any, options?: PostMessageOptions) {
		this._channelController.promise = this._channelController?.promise
			?.then(() => this._ws?.send(JSON.stringify(message)))
			.catch(() => { return })
	}
}
