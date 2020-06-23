const Article = require('../models/article');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');

module.exports = {
	// Posts Index
	async aboutIndex(req, res, next) {
		const teamMembers = await User.find({ isTeamMember: { $eq: true } });
		res.render('about/about', { teamMembers, title: 'О нас', image: cloudinary.image, image_url: cloudinary.url });
	},
	
	aboutHistory(req, res, next) {
		res.render('about/history');
	},
	
	aboutTeam(req, res, next) {
		res.render('about/team');
	},

	aboutPress(req, res, next) {
		res.render('about/press');
	}
	
}