const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AboutHistorySchema = new Schema ({
    title: String,
    historyPoints: [{
        pointImage: [{
            url:String,
            public_id:String
        }],
        date: Date,
        textPoint: String,
        reversed: Boolean,
        icon: String,
    }]
});



module.exports = mongoose.model('AboutHistory', AboutHistorySchema);