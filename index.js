require('dotenv').config();
const express = require('express');
const {createServer}= require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const {dbconnect} = require('./config/dbconnect');
const {router} = require('./routes/routes');
const port = process.env.PORT || 3000;



const app = express();
const server = createServer(app);
const io = socketIo(server,{
    cors:{
        origin:"*",
        methods:['GET','POST'],
    }
});
const chatNamespace = io.of('/chat');
chatNamespace.on('connection',(socket)=>{
    console.log(' new socket user connected :');
    socket.on('join',(username)=>{
        //attached the username to the socket object 
        socket.username= username;
        socket.broadcast.emit('user joined',socket.username);
        console.log(`${username} has joined the chat`);
    })
    socket.on('chat message',(msg)=>{
        console.log(msg); 
        socket.broadcast.emit('send message', {username:socket.username,message:msg});
        
    });
    
    socket.on('disconnect',()=>{
        socket.broadcast.emit('left',socket.username);
        console.log('socket user disconnected');
    }); 
  });
  //database connection
dbconnect();
//setting view engine to ejs
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//setting up our session middleware
app.use(session({
       secret:process.env.SECRET_KEY,
       resave:false,
       saveUninitialized:true,
       cookie:{
        path:'/'
       }
    }
    ));
    //accessing our routes file.
app.use(router);   
// MOST important in SOCKET.IO connection
// to use socket.io change this app.listen to http created server.listen() 
// app.listen(port,()=>{
//     console.log(`server started at port ${port}`);
// });
server.listen(port,()=>{
    console.log(`server started at port ${port}`);
});