var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var collaborationSchema = new mongoose.Schema({
    proposalSubmittion: { type: Date },
    proposalAccepted: { type: Date },
    proposalRejected: { type: Date },
    contentSubmitted: { type: Date },
    contentApproved: { type: Date },
    contentPublished: { type: Date },
    outrightRequested: { type: Date },
    outrightRequestAccepted: { type: Date },
    outrightBidApproved: { type: Date },
    outrightBidRejected: { type: Date },
    publishedAt: { type: Date },
    proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number },
    hasRated: { type: Boolean, default: false },
    hasPublished: { type: Boolean, default: false }
}, { timestamps: true });

collaborationSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Collaboration', collaborationSchema);
