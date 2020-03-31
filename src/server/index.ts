import { Server } from './server'
import { WebSocket } from './websocket'

(new Server(new WebSocket())).start()