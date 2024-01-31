import express from 'express'
import { engine } from 'express-handlebars'
import homeRouter from './routes/home.router.js'
import http from 'http'
import {Server} from 'socket.io'

import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
const PORT = 8080||process.env.PORT

let arrMsg = []

//server http
const server = http.createServer(app)

//public
app.use(express.static(path.join(__dirname, 'public')));

//engine
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname +'/views')

//routes
app.use('/home', homeRouter)

//socket server
const io = new Server(server) //servidor creado con http
io.on('connection',(socket)=>{
    console.log('nuevo cliente')
    socket.emit('wellcome','bienvenido cliente')

    socket.on('new-message', (data)=>{
        arrMsg.push(data)
        socket.emit('message-all',arrMsg)
    })
})


server.listen(PORT, () =>{
    console.log('listening on 8080')
})