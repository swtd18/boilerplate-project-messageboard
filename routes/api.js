'use strict';
const BoardModel = require("../models").Board;
const ThreadModel = require("../models").Thread;
const RaplyModel = require("../models").Reply;



module.exports = function (app) {
  
  app.route('/api/threads/:board').post(function (req,res) {
    const {text, delete_password}=req.body;
    let board=req.body.board
    if(!board) {
      board=req.params.board;
    }
    const newThread=new ThreadModel({
      text:text,
      delete_password:delete_password,
      replys:[]
    })
    BoardModel.findOne({name:board}).then(data=> {
      if(!data) {
        const newBoard=new BoardModel({
          name:board,
          threads:[newThread]
        })
        newBoard.save().then(data=> {
          if(!data) {
            console.log("error saving data");
            res.send("there was error in saving data");
          }
          else {
            res.json(newThread);
          }
        })
      }
      else {
        BoardModel.threads.push(newThread);
        newBoard.save((err,data)=> {
          if(!data) {
            console.log("error saving data");
            res.send("there was error in saving data");
          }
          else {
            res.json(newThread);
          }
        })
      }
    })  

  }).get((req,res)=> {
    const board=req.params.body;
    console.log(board);
    BoardModel.findOne({name:board}).then(data=> {
     if(!data) {
       console.log("this thread does not exist"); 
     }
     else {
       const threads=data.threads.map(thread=> {
       const {
        _id,
        text,
        created_ond,
        bumped_on,
        delete_password,
        replies
        }=thread;
        return {
          _id,
          text,
          created_ond,
          bumped_on,
          delete_password,
          replies,
          replyCount:thread.replies.length,
        };
       })
       res.json(threads);
     }
    })

  })
 
  app.route('/api/replies/:board');
}
