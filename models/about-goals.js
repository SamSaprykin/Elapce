const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AboutGoalsSchema = new Schema ({
    title: String,
    introduction: String,
    services:[String],
    iconImage: [{
        url:String,
        public_id:String
    }],
	body: String,
});



module.exports = mongoose.model('AboutGoals', AboutGoalsSchema);