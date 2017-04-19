let Article=require('./model.js').Article
let Comment=require('./model.js').Comment
let Profile=require('./model.js').Profile
let Uer=require('./model.js').Uer
let cookieKey = 'sid'
//get following
const getFollowing=(req,res)=>{
	Profile.find({username: req.params.user||req.username}).exec(function(err, pros) {
		if (err) {
			res.status(401).send('Failed to get following list')
		}
		else{
			if(pros[0]){
				res.send({
					username: pros[0].username,
					following: pros[0].following
				})
			}else{
				res.status(401).send('You have not loggedin or no such user')
			}
		}
	})
}
// add following
const putFollowing=(req,res)=>{
	Profile.find({username: req.username}).exec(function(err, pros) {
		if (err) {
			res.status(401).send('Failed to add follower')
		}
		else{
			if (!pros[0].following.includes(req.params.user)) {// if not exist
				Profile.update({username:req.username},{following:[...pros[0].following, req.params.user]}).exec(function(){
					Profile.find({username: req.username}).exec(function(err, pros) { 
						if (err) {
							res.status(401).send('Failed to add follower')
						}
						else{
							res.send({
								username: pros[0].username,
								following: pros[0].following
							})
						}
					})
				})
			}	
		}
	})
}
//delete following
const deleteFollowing=(req,res)=>{
	Profile.find({username: req.username}).exec(function(err, pros) {
		if (err) {
			res.status(401).send('Failed to delete follower')
		}
		else{
			let newfollowing = pros[0].following.filter((f) => f != req.params.user)// delete the following
			Profile.update({username:req.username},{following: newfollowing}).exec(function(){
				Profile.find({username: req.username}).exec(function(err, pros) {
					if (err) {
						res.status(401).send('Failed to delete follower')
					}
					else{
						res.send({
							username: pros[0].username,
							following: pros[0].following
						})
					}
				})
			})	
		}
	})
}
module.exports = (app) => {
	app.get('/following/:user?', getFollowing)
	app.put('/following/:user', putFollowing)
	app.delete('/following/:user', deleteFollowing)
}
