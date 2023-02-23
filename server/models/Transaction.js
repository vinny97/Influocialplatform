var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

var TransactionSchema = new mongoose.Schema({
  //purpose of payment
  name: {
    type: String,
    required: true,
  },
  //Name of currently logged in user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //Proposal fee
  price: {
    type: Number,
    required: true,
  },
  //Campaign ID
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  //Proposal ID
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
  },
  //PayPal response{Data}
  payPalData: {},
  status: {
    type: Number,
    default: 1,
    enum: [
      1, // Pending
      2, // Approved/Completed
      3, // Rejected
    ],
  },
});

TransactionSchema.plugin(mongoosePaginate);

function prePopulate(next) {
  this.populate("user");
  this.populate("campaign");
  this.populate("proposal");
  next();
}

TransactionSchema.pre("find", prePopulate);
TransactionSchema.pre("findOne", prePopulate);
TransactionSchema.pre("findById", prePopulate);

mongoose.model("Transaction", TransactionSchema);
