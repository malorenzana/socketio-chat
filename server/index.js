import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import {PORT} from "./config.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";


const app = express();  //server de la app express
const __dirname = dirname(fileURLToPath(import.meta.url)); //ruta absoluta 
console.log(__dirname);
const server = http.createServer(app);  //este tiene la conexion con socket.io

// io escucha los eventos
const io = new SocketServer(server, {
    // cors, que otros servidores se pueden conectar
    cors: {
        origin: 'http://localhost:3000'
    }
});

//MIDDLEWUARE
app.use(cors())
app.use(morgan('dev'))


// evento on se dispara a la hora que alguien se conecte a la app (client) 
io.on('connection', (socket) => {
    console.log(socket.id);

    //todo recibiendo el evento del frontend
    socket.on('messageFrontend', (data) => {
        console.log(data);
        socket.broadcast.emit('messageBackend', {
            body: data,
            from: socket.id +":  "+"Remitente" 
        }) //!emitiendo evento para el fronted
    });
});

//sirviendo archivos staticos html, css... de la carpeta build del cliente
app.use(express.static(join(__dirname, '../client/build')));


server.listen(PORT)
console.log("server on port", PORT);