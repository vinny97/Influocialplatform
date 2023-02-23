var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


var FriendSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: Number,
        default: 1,
        enum: [
            1, // 1: Friend
            2, // 2: Unfriend
        ]
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },

    chatMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }],

}, { timestamps: true });

FriendSchema.plugin(mongoosePaginate);
mongoose.model('Friend', FriendSchema);