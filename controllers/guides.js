const Guide = require('../models/guide');
const moment = require('moment');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken});

module.exports = {
	// Posts Index
	async gudiesIndex(req, res, next) {
        
        
        let guides = await Guide.paginate({}, {
            page: 1,
            limit:16,
            sort: {'_id': -1}
        });
        
		res.render('guides/index', {guides});
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
        console.log(response.body.features[0].geometry)
        req.body.geometry = response.body.features[0].geometry;
        req.body.author =  req.user._id;
        req.body.creationDate =  moment().format("YYYY-MM-DD").toString();
        let guide = new Guide(req.body);
        await guide.save();
        res.redirect(`/guides/${guide.id}`);
        
    },
    async guideShow(req, res, next) {
        let guide = await Guide.findById(req.params.id);
        
        res.render('guides/show', {guide})
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
        guide.body = req.body.body;
        guide.location = req.body.location;
        guide.conclusions =  req.body.conclusions;
        guide.introduction =  req.body.introduction;
        
        
        guide.save();

        res.redirect(`/guides/${guide.id}`);
    },  
    
    
	
}