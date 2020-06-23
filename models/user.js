const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    email: { type: String, unique: true, required: true },
	image: { 
		secure_url: {type: String, default: '/images/profile.jpg'},
		public_id: String
	},
	favoriteLinks: [{
        url:String,
        id:String
    }],
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	isTeamMember: { type: Boolean, default:false },
	department: { type: String, default:false },
	position: { type: String, default:false },
	createdArticles: [{
		url:String,
		id:String
	}]
});


UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema);

