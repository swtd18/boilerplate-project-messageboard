const mongoose = require('mongoose');
const { Schema } = mongoose;
const date=new Date();
const ReplySchema = new Schema({
    text: { type: String},
    created_on: { type: Date, default: date},
    bumped_on : { type: Date, default: date },
    reported :{ type: Boolean, default: false },
    delete_password:{ type: String},
});

const reply = mongoose.model("Reply", ReplySchema);

const ThreadSchema = new Schema({
    text: { type: String, default: "" },
    created_on: { type: Date, default: date},
    bumped_on : { type: Date, default: date },
    reported :{ type: Boolean, default: false },
    delete_password:{ type: String},
    replies : { type: [ReplySchema]}
});

const thread = mongoose.model("Thread", ThreadSchema);

const BoardSchema = new Schema({
    name:{ type: String},
    threads: { type: [ThreadSchema]},
});

const board = mongoose.model("Board", BoardSchema);


exports.Board = board;
exports.Reply = reply;
exports.Thread = thread;