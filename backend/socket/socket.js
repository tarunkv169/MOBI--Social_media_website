import express from "express";
import http from "http";

import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// socket server   from    http server
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','POST']
    },
})

// user:socket MAP;
const userSocketMap = {};

// extract "socketId" from "userSocketMap"---&--make func--so anyone want "Id"--can call this func
export const getReceiverSocketId=(receiverId)=>{
    return userSocketMap[receiverId];
}

// CONNECTION
io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId)
    {
        userSocketMap[userId]=socket.id;
        console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on('disconnect',()=>{
        if(userId)
        {
            console.log(`User ${userId} disconnected.`);
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})





// export all
export {app,server,io};