'use strict';

const { then } = require("../db-connection");

const BoardModel = require("../models").Board;
const ThreadModel = require("../models").Thread;
const ReplyModel = require("../models").Reply;



module.exports = function (app) {

 

  app.route('/api/threads/:board').post(function (req,res) {
    const {text, delete_password}=req.body;
    const date=new Date();
    let board=req.body.board
    if(!board) {
      board=req.params.board;
    }
    const newThread=new ThreadModel({
      text:text,
      created_on:date,
      bumped_on:date,
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
        data.threads.push(newThread);
        data.save().then(data=> {
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
    const board=req.params.board;
    BoardModel.findOne({name:board}).then(data=> {
     if(!data) {
       console.log("this thread does not exist"); 
     }
     else {
       const threads=data.threads.map(thread=> {
       const {
        _id,
        text,
        created_on,
        bumped_on,
        delete_password,
        replies
        }=thread;
        return {
          _id,
          text,
          created_on,
          bumped_on,
          delete_password,
          replies,
          replyCount:thread.replies.length,
        };
       })
       res.json(threads);
     }
    })
    

  }).delete((req,res)=>{
    const{thread_id,delete_password}=req.body;
    let board=req.body.board;
    if(!board) {
      board=req.params.board;
    }
    BoardModel.findOne({name:board}).then((data)=>{
      if(!data) {
        console.log("board is not found");
      }
      else {
        let threadToDelete=data.threads.id(thread_id);
        if(threadToDelete.delete_password===delete_password) {
          //threadToDelete.deleteOne();
          data.save().then((data)=>{
            if(!data) {
              console.log("error updating in database");
            }
            else {
              res.send("success");
            }
          });
        }
        else {
          res.send("incorrect password");
        }
      }
    });
  }).put((req,res)=>{
    const{thread_id}=req.body;
    let board=req.body.board;
    if(!board) {
      board=req.params.board;
    }

    BoardModel.findOne({name:board}).then((data)=>{
      if(!data) {
        console.log("board is not found");
      }
      else {
        let threadReported=data.threads.id(thread_id);
        threadReported.reported=true;
        threadReported.bumped_on=new Date();
        data.save().then((data)=>{
            if(!data) {
              console.log("error updating in database");
            }
            else {
              res.send("reported");
            }
          });
        }  
    });
  });
 
  app.route('/api/replies/:board').post((req,res)=>{
    const {text,delete_password,thread_id}=req.body;
    const date=new Date();
    let board=req.body.board
    if(!board) {
      board=req.params.board;
    }
    const newReply=new ReplyModel({
      text:text,
      created_on:date,
      delete_password:delete_password
    });
    BoardModel.findOne({name:board}).then((data)=>{
      if(!data) {
        console.log('this board is not found');
      }
      else {
        const foundthread=data.threads.id(thread_id);
         foundthread.bumped_on=date;
         foundthread.replies.push(newReply);
         data.save().then((data)=>{
          if(!data){
            console.log("the data couldn't be saved");
          }
          else {
            res.json(foundthread);
          }
         })
         }
        })
      })
      .get((req,res)=>{
        let board=req.body.board
        if(!board) {
          board=req.params.board;
        }
        BoardModel.findOne({name:board}).then((data)=>{
          if(!data) {
            console.log('this board is not found');
          }
          else {
            const thread=data.threads.id(req.query.thread_id);
            const repliesToReturn=thread.replies.map(reply=> {
              const {
               _id,
               text,
               created_on,
               bumped_on,
               }=reply;
               return {
                 _id,
                 text,
                 created_on,
                 bumped_on,
               };
              })
              const threadToReturn= {
                _id:req.query.thread_id,
                text:thread.text,
                created_on:thread.created_on,
                bumped_on:thread.bumped_on,
                replies:repliesToReturn
              };
              res.json(threadToReturn);
             }
         })
      }).put((req,res)=>{
        const{thread_id,reply_id}=req.body;
        let board=req.body.board;
        if(!board) {
          board=req.params.board;
        }
        BoardModel.findOne({name:board}).then((data)=>{
          if(!data) {
            console.log("board is not found");
          }
          else {
            let thread=data.threads.id(thread_id);
            let reportedReply=thread.replies.id(reply_id);
            reportedReply.reported=true;
            reportedReply.bumped_on=new Date();
            data.save().then((data)=>{
                if(!data) {
                  console.log("error updating in database");
                }
                else {
                  res.send("reported");
                }
              });
            }  
        });
      }).delete((req,res)=>{
        const{thread_id,reply_id,delete_password}=req.body;
        let board=req.body.board;
        if(!board) {
          board=req.params.board;
        }
        BoardModel.findOne({name:board}).then((data)=>{
          if(!data) {
            console.log("board is not found");
          }
          else {
            let thread=data.threads.id(thread_id);
            let replyToDelete=thread.replies.id(reply_id);
            if(replyToDelete.delete_password===delete_password) {
              //replyToDelete.deleteOne();
              replyToDelete.text='[deleted]';
              data.save().then((data)=>{
                if(!data) {
                  console.log("error updating in database");
                }
                else {
                  res.send("success");
                }
              });
            }
            else {
              res.send("incorrect password");
            }
          }
        });
      })

      app.route('/api/replies/:board/thread_id=:thread_id').get((req,res)=>{

        console.log("hello");
    
     });
}
