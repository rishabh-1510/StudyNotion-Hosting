const mongoose = require("mongoose");   

const purchaseHistorySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
    },
    purchasedAt:{
        type:Date,
        default:Date.now,
    } 

})
module.exports = mongoose.model("PurchaseHistory", purchaseHistorySchema);  