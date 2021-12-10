const config = require('./utils/config')
//const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
require('express-async-errors')
const app = express()
const cors = require('cors')
const userRouter = require('./controllers/users')
const blogRouter = require('./controllers/blogposts.js')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')


logger.info("Connecting to ... ",  config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("Connected to MongoDB")
    })
    .catch((error) => {
        logger.info("Error connecting to MongoDB: ", error.message)
    })


app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/users', userRouter)
app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use('/api/login', loginRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app