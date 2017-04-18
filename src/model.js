// this is model.js 
var mongoose = require('mongoose')
require('./db.js')

var userSchema = new mongoose.Schema({
	username: String,
	salt: String,
	hash: String
})

var profileSchema = new mongoose.Schema({
	username: String,
	email: String,
	phone: String,
	dob: String,
	zipcode: Number,
	avatar: String,
	headline: String,
	following: [String]
})

var commentSchema = new mongoose.Schema({
	commentId: Number, author: String, date: Date, text: String
})
var articleSchema = new mongoose.Schema({
	_id: Number, author: String, img: String, date: Date, text: String,
	comments: [ commentSchema ]
})

exports.Article = mongoose.model('article', articleSchema)
exports.User = mongoose.model('user', userSchema)
exports.Profile=mongoose.model('profile', profileSchema)
exports.Comment=mongoose.model('comment', commentSchema)