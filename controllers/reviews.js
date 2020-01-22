const Project =  require('../models/project');
const Review =  require('../models/review');


module.exports = {
    
    // Review Create
    async reviewCreate(req, res, next) {
        // find project by it's id
        let project = await Project.findById(req.params.id).populate('reviews').exec();
        let haveReviwed = project.reviews.filter(review => {
            return review.author.equals(req.user._id);
        }).length;

        if(haveReviwed) {
            req.session.error = 'Sorry you can only create one review per project'
            return res.redirect(`/projects/${project.id}`)
        }
		// create the review
		req.body.review.author = req.user._id;
		let review = await Review.create(req.body.review);
		// assign review to project
		project.reviews.push(review);
		// save the project
		project.save();
		// redirect to the project
		req.session.success = 'Review created successfully!';
		res.redirect(`/projects/${project.id}`);
    },
    // Review Update
    async reviewUpdate(req, res, next) {
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success = 'Review updated succesfully!';
        res.redirect(`/projects/${req.params.id}`);        
    },
    // Review Delete
    async reviewDestroy(req, res, next) {
        await Project.findByIdAndUpdate(req.params.id, {
           $pull: { reviews: req.params.review_id } 
        });

        await Review.findByIdAndRemove(req.params.review_id);
        req.session.success = 'Review delted succesfully!';
        res.redirect(`/projects/${req.params.id}`);

    }
}