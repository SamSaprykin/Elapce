const Project =  require('../models/project');
const User =  require('../models/user');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary');

module.exports = {
    
    // Project Index
    async projectIndex(req, res, next) {
        
        const { dbQuery } = res.locals;
        
        delete res.locals.dbQuery 
        let projects = await Project.paginate(dbQuery, {
            page: req.query.page || 1,
            limit:12,
            sort: {'_id': -1}
        });
        
        projects.page = Number(projects.page);
        if (!projects.docs.length && res.locals.query) {
            res.locals.error = "Не найдены результаты по Вашему запросу."
        }
        
        res.render('projects/index', { projects, title: 'Список объектов', mapBoxToken, image: cloudinary.image, image_url: cloudinary.url })
    },
    // New Project
    projectNew(req, res, next) {
        
        
    res.render('projects/new');
       
        
    },
    // Project Create
    async projectCreate(req, res, next) {
        // use req.body to create new project
        req.body.project.images = [];
    
        for(const file of req.files) {
			console.log(file)
			req.body.project.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
            
        }
        
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.project.location,
                limit:1,
                language: ['ru-Ru']
						
            })
            .send();
        req.body.project.geometry = response.body.features[0].geometry;
        req.body.project.author =  req.user._id;
        let project = new Project(req.body.project)
        project.properties.description = `<strong><a href="/projects/${project._id}">${project.title}</a></strong><p>${project.location}</p><p>${project.description.substring(0, 20)}...</p>`;
		await project.save();
        req.session.success = 'Проект успешно создан'
		res.redirect(`/projects/${project.id}`);
        
        
    },
    async projectShow(req, res, next) {
        let project = await Project.findById(req.params.id).populate({
            path:'reviews',
            options: { sort: { '_id': -1}},
            populate: {
                path:'author',
                model:'User'
            }
        });
        const floorRating = project.calculateAverageRating();
        const projectsMore = await Project.aggregate([{ $sample: { size: 3 } }]);
        
        res.render('projects/show', {project,mapBoxToken,floorRating, projectsMore,  image: cloudinary.image, image_url: cloudinary.url})
    },
    projectEdit(req, res, next) {
        
        
        res.render('projects/edit');
    },
    async projectUpdate(req, res, next) {
        const {project} = res.locals;
        
        if(req.body.deleteImages && req.body.deleteImages.length ) {
            let deleteImages = req.body.deleteImages;

            for(const public_id of deleteImages) {
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);    
                for(const image of project.images) {
                    if (image.public_id === public_id) {
                        let index = project.images.indexOf(image);
                        project.images.splice(index,1);
                    }
                }            
            }
        }

        if(req.files) {
            for(const file of req.files) {
                project.images.push({
                    url: file.secure_url,
                    public_id: file.public_id
                });
            }
        }
        // check if location was updated
        if( req.body.project.location != project.location ) {
            let response = await geocodingClient
                .forwardGeocode({
                    query: req.body.project.location,
                    limit:1,
                    language: ['ru-Ru']
                })
                .send();
            project.geometry = response.body.features[0].geometry;
            project.location = req.body.project.location;
        }
        
        
        project.title = req.body.project.title;
        project.description = req.body.project.description;
        project.price = req.body.project.price;
        project.seaDistance = req.body.project.seaDistance;
        project.bedrooms = req.body.project.bedrooms;
        project.appointment = req.body.project.appointment;
        project.type = req.body.project.type;
        project.properties.description = `<strong><a href="/projects/${project._id}">${project.title}</a></strong><p>${project.location}</p><p>${project.description.substring(0, 20)}...</p>`;

        project.save();

        res.redirect(`/projects/${project.id}`);
    },
    async projectDestroy(req, res, next) {

        const { project } = res.locals;
        for(const image of project.images) {
            await cloudinary.v2.uploader.destroy(image.public_id); 
        }
        await project.remove();
        req.session.success = 'Проект успешно удален'
        res.redirect('/projects');
    },
    async addProjectToFavourite(req, res, next) {
        let projectId = await Project.findById(req.params.id);
        
        let user = await User.findById(req.user._id)
        
        user.favoriteLinks.push({
            url: projectId.title,
            id: projectId._id
        });
        
        req.session.success = 'Вы добавили объектв в закладки'
        
        

        user.save();
        res.redirect(`/projects/${projectId._id}`);
    }
}