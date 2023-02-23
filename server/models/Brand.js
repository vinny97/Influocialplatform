var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var BrandSchema = new mongoose.Schema({
    name: String,
    image: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    campaigns: []
}, { timestamps: true });

BrandSchema.plugin(mongoosePaginate);

mongoose.model('Brand', BrandSchema);