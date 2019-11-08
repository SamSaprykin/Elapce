const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema ({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    }
});


module.exports = mongoose.model('Review', ReviewSchema);

UserSchema.plugin(passportLocalMongoose)