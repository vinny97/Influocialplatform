var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var NotificationSchema = new mongoose.Schema({
    title: String,
    type: {
        type: Number,
        // 1 system
        // 2 trade
        // 3 tournament
        // 4 lobby
        // 5 p2p - request
        enum: [1, 2, 3, 4, 5],
        required: true

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    sentTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    isRead: {
        type: Boolean,
        default: false,
    },
    data: {},
}, { timestamps: true });

NotificationSchema.plugin(mongoosePaginate);

mongoose.model('Notification', NotificationSchema);