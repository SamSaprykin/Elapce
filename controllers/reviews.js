const Project =  require('../models/project');
const Review =  require('../models/review');
var moment = require('moment');
require('moment/locale/ru');

module.exports = {
    
    // Review Create
    async reviewCreate(req, res, next) {
        // find project by it's id
        let project = await Project.findById(req.params.id).populate('reviews').exec();
        let haveReviwed = project.reviews.filter(review => {
            return review.author.equals(req.user._id);
        }).length;

        if(haveReviwed) {
            req.session.error = 'Вы можете создать только один отзыва для объекта'
            return res.redirect(`/projects/${project.id}`)
        }
		// create the review
        req.body.review.author = req.user._id;
        moment.locale('ru');
        let date = moment().format('DD MMMM');
        req.body.review.date = date
		let review = await Review.create(req.body.review);
		// assign review to project
		project.reviews.push(review);
		// save the project
		project.save();
		// redirect to the project
		req.session.success = 'Отзыв успешно создан';
		res.redirect(`/projects/${project.id}`);
    },
    // Review Update
    async reviewUpdate(req, res, next) {
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success = 'Отзыв обновлен';
        res.redirect(`/projects/${req.params.id}`);        
    },
    // Review Delete
    async reviewDestroy(req, res, next) {
        await Project.findByIdAndUpdate(req.params.id, {
           $pull: { reviews: req.params.review_id } 
        });

        await Review.findByIdAndRemove(req.params.review_id);
        req.session.success = 'Отзыв успешно удален';
        res.redirect(`/projects/${req.params.id}`);

    }
}