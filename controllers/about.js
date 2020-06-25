const AboutGoals = require('../models/about-goals');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');

module.exports = {
	// Posts Index
	async aboutIndex(req, res, next) {
		const teamMembers = await User.find({ isTeamMember: { $eq: true } });
		const aboutGoalsData = await AboutGoals.find({})
		res.render('about/about', { teamMembers,aboutGoalsData, title: 'О нас', image: cloudinary.image, image_url: cloudinary.url });
	},
	aboutGoalsNew(req, res, next) {
		res.render('about/new-goals');
	},
	
	async aboutGoalsCreate(req, res, next) {
        // use req.body to create a new Article
        
        
        req.body.iconImage = [];
        
        for(const file of req.files) {
			
			req.body.iconImage.push({
				url: file.secure_url,
				public_id: file.public_id
			});
        }

		console.log(req.body)
        
        text = req.body.body;
        html = converter.makeHtml(text);
        req.body.body = html
        let aboutGoal = new AboutGoals(req.body);
        await aboutGoal.save();
        res.redirect(`/about`);
        
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