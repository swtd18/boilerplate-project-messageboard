'use strict';
const MessageModel = require("../models").Message;

function saveMessage(text,delete_password) {

  const newMessage = new MessageModel({
    _id: Math.floor((Math.random() * 100) + 1),
    text: text,
    created_on:String(new Date().getTime()),
    bumped_on : String(new Date().getTime()),
    reported :false,
    delete_password:delete_password,
    replies :""
  });
  const savedNew = newMessage.save();
}

module.exports = function (app) {
  
  app.route('/api/threads/:board').post(function (req,res) {
    const {text, delete_password}=req.body;
    console.log({text,delete_password});
    //saveMessage(text,delete_password);
    res.json({
      id: Math.floor((Math.random() * 100) + 1),
      text: text,
      created_on:String(new Date().getTime()),
      bumped_on : String(new Date().getTime()),
      reported :false,
      delete_password:delete_password,
      replies :""
  });
 
  app.route('/api/replies/:board');

});
}
