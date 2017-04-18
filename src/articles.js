let Article=require('./model.js').Article
let Comment=require('./model.js').Comment
const isLoggedin=require('./auth.js').isLoggedin
let cookieKey = 'sid'
//add one article
const addArticle = (req, res) => {
  let newId
  if(req.body.text){
    Article.find().exec(function(err, arts) {
      newId=arts.length+1
      new Article({
      _id : newId,
      author: req.username,
      text: req.body.text,
      date: new Date(),
      img: null,
      comments: []
    }).save(function() {
      Article.find({_id:newId}).exec(function(err, arts) {
          res.send({articles:arts})
        })
      })
    })
  } else{
    res.status(400).send('Error: no article text')
  }
}
// get articles
const getArticles = (req, res) => {
  if(req.params.id){
    Article.find({_id : req.params.id}).exec(function(err, arts) {
      res.send({articles: arts})
    })
  } else {
    Article.find().exec(function(err, arts) {
      res.send({articles: arts})
    })
  }
}
//edit article, add comment or edit comment
const putArticle= (req, res) =>{
  if(!req.body.text){
  res.status(400).send('Error: no article text')
  return
  }
  Article.find({_id:req.params.id}).exec(function(err, arts){// check if id is valid
    if(arts == null || arts.length == 0) {
      res.status(401).send('Error: no such article')
      return
    }
    if(req.body.commentId){//put comment
      if(req.body.commentId==-1){//add comment
        let newId
        Comment.find().exec(function(err, comms) {
          newId = comms.length + 1
          new Comment({  commentId : newId,  author: req.username,  date: new Date(),  text: req.body.text  }).save(function(){
            Article.find({ _id : req.params.id }).exec(function(err, arts) {
              Comment.find({ commentId : newId }).exec(function(err, comms) {
                let newcomments=[...arts[0].comments, comms[0] ]
                Article.update({ _id : req.params.id }, { comments : newcomments}).exec(function(err, arts) {
                  Article.find({ _id : req.params.id }).exec(function(err, arts) {
                    res.send({ articles: arts })
                  })
                })
              }) 
            })
          })
        })
      }
      else{//edit comment
        Comment.update({ commentId : req.body.commentId }, { text : req.body.text}).exec(function(){
          Article.find({ _id : req.params.id }).exec(function(err, arts) {
            Comment.find({ commentId : req.body.commentId }).exec(function(err, comms) {
              let newcomments=arts[0].comments.map((c)=> c.commentId==req.body.commentId? {commentId: c.commentId, author: c.author, text: req.body.text}: c)
              Article.update({ _id : req.params.id }, { comments : newcomments}).exec(function(){
                Article.find({ _id : req.params.id }).exec(function(err, arts) {
                  res.send({ articles: arts })
                })
              })
            })
          })
        })
      }
    }
    else{//edit article
      Article.update({ _id : req.params.id }, { text : req.body.text}).exec(function(){
        Article.find({ _id : req.params.id }).exec(function(err, arts) {
          res.send({ articles: arts })
        })
      })
    }
  })
}

module.exports = (app) => {
  app.get('/articles/:id*?', getArticles)
  app.post('/article', addArticle)
  app.put('/articles/:id', putArticle)
}
