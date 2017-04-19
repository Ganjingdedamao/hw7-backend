let Article=require('./model.js').Article
let Comment=require('./model.js').Comment
let Profile=require('./model.js').Profile
let Uer=require('./model.js').Uer

let cookieKey = 'sid'
const getHeadlines = (req, res) => {
	Profile.find({ username : req.params.user||req.username}).exec(function(err, pros) {
		if (err) {
			res.status(401).send('Failed to get headlines')
		} else {
			if(pros[0])
			{
				res.send({ headlines: [ {
					username: pros[0].username,
					headline: pros[0].headline
				}]})
			}
			else{
				res.status(401).send('You have not loggedin or no such user')
			}
		}
	})
}

const putHeadline = (req, res) => {
	if (req.body.headline != null && req.body.headline != "") {
		Profile.update({username: req.username},{headline:req.body.headline}).exec(function(err, pros) {
			if (err) {
				res.status(401).send('Failed to update headlines')
			} else {
				Profile.find({ username : req.username}).exec(function(err, pros) {
					if (err) {
						res.status(401).send('Failed to update headlines')
					} else {
						res.send({ 
							username: pros[0].username,
							headline: pros[0].headline
						})
					}
				})
			}
		})
	} else{
		res.status(400).send('There is no headline')
	}
}

const getEmail = (req, res) => {
	Profile.find({ username : req.params.user||req.username}).exec(function(err, pros) {
		if (err) {
			res.status(401).send('Failed to get email')
		} else {
			if(pros[0])
			{
				res.send( {
					username: pros[0].username,
					email: pros[0].email
				})
			} else{
				res.status(401).send('You have not loggedin or no such user')
			}
		}
	})	
}

const putEmail = (req, res) => {
	if (req.body.email != null && req.body.email != "") {
		Profile.update({username:req.username},{email:req.body.email}).exec(function(err, pros) {
			if (err) {
				res.status(401).send('Failed to update email')
			} else {
				Profile.find({ username : req.username}).exec(function(err, pros) {
					if (err) {
						res.status(401).send('Failed to update email')
					} else {
						res.send( {
							username: pros[0].username,
							email: pros[0].email
						})
					}
				})
			}
		})
	} else{
		res.status(400).send('There is no email')
	}
}

const getZipcode = (req, res) => {
	Profile.find({ username : req.params.user||req.username}).exec(function(err, pros) {
		if (err) {
			res.status(401).send('Failed to get zipcode')
		} else {
			if(pros[0])
			{
				res.send( {
					username: pros[0].username,
					zipcode: pros[0].zipcode
				})
			} else{
				res.status(401).send('You have not loggedin or no such user')
			}
		}
	})		
}

const putZipcode = (req, res) => {
	if (req.body.zipcode != null && req.body.zipcode != "") {
		Profile.update({username:req.username},{zipcode:req.body.zipcode}).exec(function(err, pros) {
			if (err) {
				res.status(401).send('Failed to update zipcode')
			} else {
				Profile.find({ username : req.username}).exec(function(err, pros) {
					if (err) {
						res.status(401).send('Failed to update zipcode')
					} else {
						res.send( {
							username: pros[0].username,
							zipcode: pros[0].zipcode
						})
					}
				})
			}
		})	
	} else{
		res.status(400).send('There is no zipcode')
	}
}

const getAvatars = (req, res) => {
	Profile.find({ username : req.params.user||req.username}).exec(function(err, pros) {
		if (err) {
			res.status(401).send('Failed to get avatars')
		} else {
			if(pros[0])
			{
				res.send({ avatars: [ {
					username: pros[0].username,
					avatar: pros[0].avatar
				}]})
			} else{
				res.status(401).send('You have not loggedin or no such user')
			}
		}
	})	
}
const putAvatar = (req, res) => {
	if (req.body.avatar != null && req.body.avatar != "") {
		Profile.update({username: req.username},{avatar:req.body.avatar}).exec(function(err, pros) {
			if (err) {
				res.status(401).send('Failed to update avatars')
			} else {
				Profile.find({ username : req.username}).exec(function(err, pros) {
					if (err) {
						res.status(401).send('Failed to update avatars')
					} else {
						res.send({ 
							username: pros[0].username,
							avatar: pros[0].avatar
						})
					}
				})
			}
		})	
	} else{
		res.status(400).send('There is no zipcode')
	}
}

const getDob = (req, res) => {
	Profile.find({ username : req.params.user||req.username}).exec(function(err, pros) {
		if (err) {
			res.status(401).send('Failed to get dob')
		} else {
			if(pros[0])
			{
				res.send( {
					username: pros[0].username,
					dob: pros[0].dob
				})
			} else{
				res.status(401).send('You have not loggedin or no such user')
			}
		}
	})
}

module.exports = app => {
	app.get('/headlines/:user?', getHeadlines)
	app.put('/headline', putHeadline)
	app.get('/email/:user?', getEmail)
	app.put('/email', putEmail)
	app.get('/zipcode/:user?', getZipcode)
	app.put('/zipcode', putZipcode)
	app.get('/avatars/:user?', getAvatars)
	app.put('/avatar', putAvatar)
	app.get('/dob', getDob)
}