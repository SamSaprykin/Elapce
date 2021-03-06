const Guide = require('../models/guide');
const moment = require('moment');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken});
const showdown  = require('showdown');

converter = new showdown.Converter();

module.exports = {
	// Posts Index
	async gudiesIndex(req, res, next) {
        const { dbQuery } = res.locals;
        delete res.locals.dbQuery 
        
        let guides = await Guide.paginate(dbQuery, {
            page: req.query.page || 1,
            limit:10,
            sort: {'_id': -1}
        });
        guides.page = Number(guides.page);
        if (!guides.docs.length && res.locals.query) {
            res.locals.error = "Не найдены результаты по Вашему запросу."
        }
		res.render('guides/index', {guides, image: cloudinary.image, image_url: cloudinary.url});
	},
	guideNew(req, res, next) {
		res.render('guides/new');
    },
    
	async guideCreate(req, res, next) {
        // use req.body to create a new Article
        
        
        req.body.images = [];
        
        for(const file of req.files) {
			
			req.body.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
        }
        let response = await geocodingClient
        .forwardGeocode({
            query: req.body.location,
            limit:1
        })
        .send();
        
        req.body.geometry = response.body.features[0].geometry;
        req.body.author =  req.user._id;
        
        text = req.body.body;
        html = converter.makeHtml(text);
        req.body.body = html
        req.body.creationDate =  moment().format("YYYY-MM-DD").toString();
        let guide = new Guide(req.body);
        await guide.save();
        res.redirect(`/guides/${guide.id}`);
        
    },
    async guideShow(req, res, next) {
        let guide = await Guide.findById(req.params.id);
        
        res.render('guides/show', {guide, image:cloudinary.image, image_url: cloudinary.url})
    },
    async guideEdit(req, res, next) {
        let guide = await Guide.findById(req.params.id);
        res.render('guides/edit', {guide});
    },

    async guideUpdate(req, res, next) {
        
        const {guide} = res.locals;
        
        
        if(req.body.deleteImages && req.body.deleteImages.length ) {
            let deleteImages = req.body.deleteImages;

            for(const public_id of deleteImages) {
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);    
                for(const image of guide.images) {
                    if (image.public_id === public_id) {
                        let index = guide.images.indexOf(image);
                        guide.images.splice(index,1);
                    }
                }            
            }
        }

        if(req.files) {
            for(const file of req.files) {
                
                guide.images.push({
                    url: file.secure_url,
                    public_id: file.public_id
                });
            }
        }

        if(req.body.data && req.body.data.length) {
            const dataNew = req.body.data
            for(value of dataNew ) {
                guide.data = dataNew
            }
            
        }
    
        if(req.body.labels && req.body.labels.length) {
            const labelNew = req.body.labels
            for(value of labelNew ) {
                guide.labels = labelNew
            }
            
        }

        let response = await geocodingClient
        .forwardGeocode({
            query: req.body.location,
            limit:1
        })
        .send();
        req.body.geometry = response.body.features[0].geometry;
        guide.geometry = req.body.geometry
        guide.title = req.body.title;
        guide.country = req.body.country;
        text = req.body.body;
        html = converter.makeHtml(text);
        guide.body = html;
        guide.location = req.body.location;
        guide.conclusions =  req.body.conclusions;
        guide.introduction =  req.body.introduction;
        
        
        guide.save();

        res.redirect(`/guides/${guide.id}`);
    },  
    
    async guideDestroy(req, res, next) {

        const { guide } = res.locals;
        for(const image of guide.images) {
            await cloudinary.v2.uploader.destroy(image.public_id); 
        }
        await guide.remove();
        req.session.success = 'Гид была успешно удален'
        res.redirect('/guides');
    }
	
}