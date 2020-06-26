const AboutGoals = require('../models/about-goals');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');
const showdown  = require('showdown');

converter = new showdown.Converter();

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
        // use req.body to create a new About goal page
        
        
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
	
	async aboutGoaslEdit(req, res, next) {
		const aboutGoalsData = await AboutGoals.find({})
		const aboutGoal = aboutGoalsData[0]
        res.render('about/edit-goals', {aboutGoal});
	},
	async aboutGoaslUpdate(req, res, next) {

		const {aboutGoal} = res.locals;

		if(req.body.deleteImages && req.body.deleteImages.length ) {
            let deleteImages = req.body.deleteImages;

            for(const public_id of deleteImages) {
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);    
                for(const image of aboutGoal.iconImage) {
                    if (image.public_id === public_id) {
                        let index = aboutGoal.iconImage.indexOf(image);
                        aboutGoal.iconImage.splice(index,1);
                    }
                }            
            }
        }

        if(req.files) {
            for(const file of req.files) {
                
                aboutGoal.iconImage.push({
                    url: file.secure_url,
                    public_id: file.public_id
                });
            }
        }
        
		
		aboutGoal.title = req.body.title;
		aboutGoal.introduction =  req.body.introduction;



		text = req.body.body;
        html = converter.makeHtml(text);
		aboutGoal.body = html;
		
		aboutGoal.save();
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