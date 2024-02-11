
require('dotenv').config();
require('express-async-errors');

require("dotenv").config();

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const socketModule = require('./controllers/socket'); 

// const config = require('./db/config')

// console.log(config.MONGO_URL)


const notFoundMiddleware = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const connectDB = require('./db/connect');
const accountRouter = require('./routes/account');
const chatsRouter = require('./routes/chatRoutes');
const messageRouter = require('./routes/messageRoute');
const authMiddleware = require('./middlewares/authentication');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
// const { rateLimit } = require('express-rate-limit');

/// Set limit on api for each userss
// app.set('trust proxy', false)
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//     validate: {xForwardedForHeader: false}
// })

// app.use('/tmp', express.static('tmp'));


app.use(express.json());

app.use(xss());
app.use(helmet());
app.use(cors({origin: '*', credentials:true, optionSuccessStatus:200}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


/// Routes
app.use('/api/v1/auth', accountRouter)
app.use('/api/v1/chats', authMiddleware, chatsRouter);
app.use('/api/v1/messages', authMiddleware, messageRouter);

app.get('/', (req, res) =>{
    res.send('<h1>Mern App Documentation</h1>'); 
})


/// Middlewares

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
    try { 
        await connectDB(process.env.MONGO_URL)
        server.listen(port, () => console.log(`Server is listening on port : ${port}`))
        
        socketModule(server);

    } catch (error) {
        console.log(error);
    }
}

start();
