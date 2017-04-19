let redis = require('redis').createClient('redis://h:p469983abf264fc42a1facaba6e8870a8ad3c0c1650bc404c1a92479255e2f8a7@ec2-34-206-56-140.compute-1.amazonaws.com:19619')
let Profile=require('./model.js').Profile
let User=require('./model.js').User
const md5=require('md5')
let myUser = {users: []}
let sessionUser=[]
let cookieKey = 'sid'
let session_id=0

const index = (req, res) => {
	res.send({ hello: 'world' })
}
function login(req,res){//login
	let username = req.body.username
	let password = req.body.password
	if(!username || !password){
		res.sendStatus(400)
		return
	}
	getUser(username, function(err, userObj) {//get user
		if (err) {
		} else {
			if(!userObj ||!isAuthorized(req, userObj)){
				res.sendStatus(401)
				return
			}
			const sid=md5(username)
			redis.hmset(sid, {username})
			res.cookie(cookieKey, sid,{maxAge: 3600*1000,//set cookie
			httpOnly: true})
			let msg={username: username, result:'success'}
			res.send(msg)
		}
	})
}

function isAuthorized(req, auth){
	return auth.hash === md5(auth.salt + req.body.password)
}
//check if logged in, otherwise return default user 'wl49test'
function isLoggedIn(req, res, next){
	let sid=req.cookies[cookieKey]
	if(!sid){
		req.username='********'
		next()
		return
	}
	else{
		redis.hgetall(sid, function(err, userObj){
			if(userObj){
				req.username=userObj.username
				next()
			}else{
				res.status(401).send('this user does not exist')
			}
		})
	}
}
function logout(req,res){//logout
	const sid=req.cookies[cookieKey]
	if(sid){
		redis.del(sid)
		res.clearCookie(cookieKey)
		res.status(200).send('OK')
	}else{
		res.status(401).send('you have not logged in')
	}
}

function register(req, res){// register
	let username=req.body.username
	let password=req.body.password
	if(!username||!password||!req.body.email||!req.body.dob||!req.body.zipcode){
		res.sendStatus(400)
		return
	}
	let salt = ""
	let generateSaltString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	for(let i=0; i < 5; i++ ){
		salt =salt+generateSaltString.charAt(Math.floor(Math.random()*generateSaltString.length))
	}

	let hash = md5(salt + password)
	new User({username: username, salt: salt, hash: hash }).save(function(){
		new Profile({ username: username, email: req.body.email, phone: req.body.phone||'713-560-0000', dob: req.body.dob, zipcode: req.body.zipcode, headline: 'Your default headline', 
		avatar: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Official_portrait_of_Barack_Obama.jpg', following: [] }).save(function(){
			res.send({username: username, result: 'success'})
		})
	})
}
function getUser(username, callback){
	User.find({ username : username }).exec(function(err, users){
		if (err) {
			callback(err, null)
		} else {
			callback(null, users[0])
		}
	})
}
//change password and create new salt
function putPassword(req, res){
	if(!req.body.password){
		res.status(400).send('There is no password')
		return
	}
	let salt = ""
	let generateSaltString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	for(let i=0; i < 5; i++ ){
		salt =salt+generateSaltString.charAt(Math.floor(Math.random()*generateSaltString.length))
	}
	let hash = md5(salt + req.body.password)
	User.update({username: req.username}, {salt: salt, hash: hash}).exec(function(err, users) {
		if (err) {
			res.status(401).send('Failed to change password')
		} else {
			res.send({
				username: req.username,
				password: req.body.password
			})
		}
	})
}

module.exports ={
	app:(app) => {
		app.get('/',index)
		app.post('/login', login)
		app.post('/register', register)
		app.put('/password', putPassword)
		app.put('/logout', logout)
	},
	isLoggedIn
}
	
