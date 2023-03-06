const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
    _id: { type: Number, required: true },
    text: { type: String, default: "" },
    created_on: { type: String, default: ""},
    bumped_on : { type: String, default: "" },
    reported :{ type: Boolean, default: false },
    delete_password:{ type: String, default: "" },
    replies : { type: String, default: [] }
});
const Message = mongoose.model("Message", MessageSchema);

exports.Message = Message;