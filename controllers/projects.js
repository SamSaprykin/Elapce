const Project =  require('../models/project');

const cloudinary =  require('cloudinary');
cloudinary.config({
    cloud_name:'dawgmnc0e',
    api_key:'835384519498396',
    api_secret: process.env.CLOUDINARY_SECRET
})


module.exports = {
    // Project Index
    async projectIndex(req, res, next) {
        let projects = await Project.find({});
        res.render('projects/index', { projects })
    },
    // New Project
    projectNew(req, res, next) {
        res.render('projects/new');
    },
    // Project Create
    async projectCreate(req, res, next) {
        // use req.body to create new post
        req.body.project.images = []; 
        for(const file of req.files) {
			let image = await cloudinary.v2.uploader.upload(file.path);
			req.body.project.images.push({
				url: image.secure_url,
				public_id: image.public_id
			});
		}
        let project = await Project.create(req.body.project);
		res.redirect(`/projects/${project.id}`);
        
    },
    async projectShow(req, res, next) {
        let project = await Project.findById(req.params.id);
        res.render('projects/show', {project})
    },
    async projectEdit(req, res, next) {
        let project = await Project.findById(req.params.id);
        res.render('projects/edit', {project})
    },
    async projectUpdate(req, res, next) {
        let project = await Project.findByIdAndUpdate(req.params.id, req.body.project, {new: true});
        res.redirect(`/projects/${project.id}`);
    },
    async projectDestroy(req, res, next) {
        await Project.findByIdAndRemove(req.params.id);
        res.redirect('/projects')
    }
}