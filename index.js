const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cookieParser = require('cookie-parser') 

const middlewareCORS = (req, res, next) => { 
	res.set('Access-Control-Allow-Origin', req.headers.origin)
	res.set('Access-Control-Allow-Credentials', true)
	res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
	res.set('Access-Control-Allow-Headers', 'Authorization, Content-type')
	if (req.method === 'OPTIONS') {
		res.send(200)
	} else {
		next()
	}
}

const isLoggedIn=require('./src/auth').isLoggedIn
const app = express()
app.use(logger('default'))
app.use(middlewareCORS)
app.use(bodyParser.json())
app.use(cookieParser())
app.use(isLoggedIn)

require('./src/articles')(app)
require('./src/profile')(app)
require('./src/following')(app)
require('./src/auth').app(app)

if (process.env.NODE_ENV !== "production") {
    require('dotenv').load()
}

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
	const addr = server.address()
	console.log(`Server listening at http://${addr.address}:${addr.port}`)
})
