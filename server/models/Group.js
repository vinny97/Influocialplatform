var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var GroupSchema = new mongoose.Schema({
    title: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    description: { type: String, default: null },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
}, { timestamps: true });

GroupSchema.plugin(mongoosePaginate);

mongoose.model('Group', GroupSchema);