const Review = require('../models/review');
const User = require('../models/user')
const Project  = require('../models/project');
const Article  = require('../models/article');
const Guide = require('../models/guide');
const { cloudinary } = require('../cloudinary');
const bboxPolygon = require('@turf/bbox-polygon');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const middleware = {
    asyncErrorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
						 .catch(next);
	},
	isReviewAuthor: async(req, res, next) => {
		let review = await Review.findById(req.params.review_id);
		if(review.author.equals(req.user._id)) {
			return next();
		}
		req.session.error = "Пока :)!"
		return res.redirect('/')
	},
	isLoggedIn: (req, res, next) => {
		if (req.isAuthenticated()) return next();
		req.session.error = 'Вы должны зарегистрироваться чтобы выполнить это действие!';
		req.session.redirectTo = req.originalUrl;
		res.redirect('/register');
	},
	isAdmin: async(req,res,next) => {
		const project = await Project.findById(req.params.id);
		const article = await Article.findById(req.params.id);
		const guide = await Guide.findById(req.params.id);
		if(req.user.username === 'admin') {
			res.locals.project = project;
			res.locals.article = article;
			res.locals.guide = guide;
			return next();
		}
		req.session.error = 'Доступ запрещен!';
		res.redirect('back');
	},
	isTeamMember: async(req,res,next) => {
		const article = await Article.findById(req.params.id);
		const guide = await Guide.findById(req.params.id);
		if(req.user.isTeamMember === true || req.user.username === 'admin') {
			res.locals.article = article;
			res.locals.guide = guide;
			return next();
		}
		req.session.error = 'Доступ запрещен!';
		res.redirect('back');
	},
	isValidPassword: async (req, res, next) => {
		const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
		if (user) {
			// add user to res.locals
			res.locals.user = user;
			next();
		} else {
			middleware.deleteProfileImage(req);
			req.session.error = 'Неверный текущий пароль!';
			return res.redirect('/profile');
		}
	},
	changePassword: async(req, res, next) => {
		const { 
			newPassword,
			passwordConfirmation
		 } = req.body
		if( newPassword && !passwordConfirmation) {
			middleware.deleteProfileImage(req);
			req.session.error = 'Отсутствует подтверждение пароля!'
			return res.redirect('/profile');
		} else if(newPassword && passwordConfirmation) {
			const { user } = res.locals;
			if(newPassword === passwordConfirmation ) {
				await user.setPassword(newPassword);
				next();

			} else {
				middleware.deleteProfileImage(req);
				req.session.error = 'Новый пароль должен совпадать';
				return res.redirect('/profile');
			}
		} else {
			next();
			
		}
	},
	deleteProfileImage: async req => {
		if (req.file) await cloudinary.v2.uploader.destroy(req.file.public_id)
	},
	async searchAndFilterProjects(req, res, next) {
		// pull keys from req.query (if there are any) and assign them 
		// to queryKeys variable as an array of string values
		
		const queryKeys = Object.keys(req.query);
		
		/* 
			check if queryKeys array has any values in it
			if true then we know that req.query has properties
			which means the user:
			a) clicked a paginate button (page number)
			b) submitted the search/filter form
			c) both a and b
		*/
		if (queryKeys.length) {
			// initialize an empty array to store our db queries (objects) in
			const dbQueries = [];
			
			// destructure all potentual properties from req.query
			let { search, price, avgRating, location, distance, appointment, seaDistance, bedrooms, area, type } = req.query;

			
			// check if search exists, if it does then we know that the user
			// submitted the search/filter form with a search query
			if (search) {
				// convert search to a regular expression and 
				// escape any special characters
				search = new RegExp(escapeRegExp(search), 'gi');
				// create a db query object and push it into the dbQueries array
				// now the database will know to search the title, description, and location
				// fields, using the search regular expression
				dbQueries.push({ $or: [
					{ title: search },
					{ description: search },
					{ location: search }
				]});
			}
			// check if location exists, if it does then we know that the user
			// submitted the search/filter form with a location query
			if (location) {
				let coordinates;
				try {
					location = JSON.parse(location);
					coordinates = location;
				} catch(err) {
					const response = await geocodingClient
					.forwardGeocode({
						query: location,
						limit: 1,
						types: ['country','region','postcode','district','place','locality','neighborhood','address'],
						language: ['ru-Ru']
					})
					.send();
					
					//coordinates = response.body.features[0].geometry.coordinates;
					var bbox = response.body.features[0].bbox;
					
					var poly = bboxPolygon.default(bbox);
					coordinates = poly.geometry.coordinates;
				} 
				// geocode the location to extract geo-coordinates (lat, lng)
				
				// destructure coordinates [ <longitude> , <latitude> ]
				
				// get the max distance or set it to 25 mi
				let maxDistance = distance || 25;
				// we need to convert the distance to meters, one mile is approximately 1609.34 meters
				maxDistance *= 1609.34 ;
				// create a db query object for proximity searching via location (geometry)
				// and push it into the dbQueries array
				
				
				dbQueries.push({
				  geometry: {
				    $geoWithin: {
				      $geometry: {
				        type: "Polygon",
				        coordinates
				      }
				    }
				  }
				});
			}
			// check if price exists, if it does then we know that the user
			// submitted the search/filter form with a price query (min, max, or both)
			if (price) {
				/*
					check individual min/max values and create a db query object for each
					then push the object into the dbQueries array
					min will search for all post documents with price
					greater than or equal to ($gte) the min value
					max will search for all post documents with price
					less than or equal to ($lte) the min value
				*/
				if (price.min) dbQueries.push({ price: { $gte: price.min } });
				if (price.max) dbQueries.push({ price: { $lte: price.max } });
			}

			if (appointment) {
				
				dbQueries.push({ appointment: { $in: appointment } });
			}

			if (seaDistance) {
				
				dbQueries.push({ seaDistance: { $lte: seaDistance } });
			}

			if (bedrooms) {
				dbQueries.push({ bedrooms: {$in: bedrooms}});
			}

			if (area) {
				if (area.min) dbQueries.push({ area: { $gte: area.min } });
				if (area.max) dbQueries.push({ area: { $lte: area.max } });
			}
			// check if avgRating exists, if it does then we know that the user
			// submitted the search/filter form with a avgRating query (0 - 5 stars)
			if (avgRating) {
				// create a db query object that finds any post documents where the avgRating
				// value is included in the avgRating array (e.g., [0, 1, 2, 3, 4, 5])
				dbQueries.push({ avgRating: { $in: avgRating } });
			}

			if (type) {
				dbQueries.push({ type: {$in: type}})
			}

			

			// pass database query to next middleware in route's middleware chain
			// which is the postIndex method from /controllers/postsController.js
			res.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};
		}
		/*
			check and build req.query so that we can maintain the state of the search/filter form
			do this by setting all postential keys in a defaultKeys array of strings
			then iterate over the array and check if queryKeys (refer to line 5 above ^)
			includes the key (which means the key already has a value), if it doesn't then we know
			that the key doesn't exist/have a value, so we set it to a default/empty value
		*/
		const defaultKeys = ['search', 'location', 'distance', 'price', 'avgRating','appointment','seaDistance', 'bedrooms', 'area' ,'type'];		
		defaultKeys.forEach(key => {
			if (!queryKeys.includes(key)) {
				
				if (key === 'price') { 
					req.query[key] = { min: '', max: '' };
				} else if (key === 'avgRating') {
					req.query[key] = [];
				} else {
					req.query[key] = '';
				} 
				if (key === 'appointment') {
					req.query[key] = [];
				}
				if (key === 'seaDistance') {
					req.query[key] = [];
				}
				if (key === 'bedrooms') {
					req.query[key] = [];
				}
				if (key === 'area') {
					req.query[key] = { min: '', max: '' };
				}
				if (key === 'type') {
					req.query[key] = [];
				}
			}
		});
		// pass req.query to the view as a local variable to be used in the searchAndFilter.ejs partial
		// again, this allows us to maintain the state of the searchAndFilter form
		res.locals.query = req.query;

		// build the paginateUrl for paginatePosts partial
		// first remove 'page' string value from queryKeys array, if it exists
		queryKeys.splice(queryKeys.indexOf('page'), 1);
		/*
			now check if queryKeys has any other values, if it does then we know the user submitted the search/filter form
			if it doesn't then they are on /posts or a specific page from /posts, e.g., /posts?page=2
			we assign the delimiter based on whether or not the user submitted the search/filter form
			e.g., if they submitted the search/filter form then we want page=N to come at the end of the query string
			e.g., /posts?search=surfboard&page=N
			but if they didn't submit the search/filter form then we want it to be the first (and only) value in the query string,
			which would mean it needs a ? delimiter/prefix
			e.g., /posts?page=N
			*N represents a whole number greater than 0, e.g., 1
		*/
		const delimiter = queryKeys.length ? '&' : '?';
		// build the paginateUrl local variable to be used in the paginatePosts.ejs partial
		// do this by taking the originalUrl and replacing any match of ?page=N or &page=N with an empty string
		// then append the proper delimiter and page= to the end
		// the actual page number gets assigned in the paginatePosts.ejs partial
		res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;
		// move to the next middleware (postIndex method)
		next();
	},
	
	async searchAndFilterArticles (req, res, next) {
		
		
		const queryKeys = Object.keys(req.query);

		if (queryKeys.length) {
			
			const dbQueries = [];
			
			let { search, category, author } = req.query;


			if (search) { 
				search = new RegExp(escapeRegExp(search), 'gi');
				dbQueries.push({ $or: [
					{ title: search }
				]});
			}


			if (category) {
				dbQueries.push({ category: { $in: category } });
			}

			if (author) {
				dbQueries.push({ author: { $in: author }})
			}
			
			res.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};

			const defaultKeys = ['search', 'category', 'author'];		
				defaultKeys.forEach(key => {
					if (!queryKeys.includes(key)) {
						
						if (key === 'category') { 
							req.query[key] = [];
						}
						
						if (key === 'author') {
							req.query[author] = [];
						}
					}
				});
				
	
		}
		res.locals.query = req.query;

		queryKeys.splice(queryKeys.indexOf('page'), 1);

		const delimiter = queryKeys.length ? '&' : '?';

		res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;

		next();
		

	},
	async searchAndFilterGuides (req, res, next) {
		
		
		const queryKeys = Object.keys(req.query);

		if (queryKeys.length) {
			
			const dbQueries = [];
			
			let { country } = req.query;

			if (country) {
				dbQueries.push({ country: { $in: country } });
			}

			res.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};

			const defaultKeys = ['country'];		
				defaultKeys.forEach(key => {
					if (!queryKeys.includes(key)) {
						
						if (key === 'country') { 
							req.query[key] = [];
						}
					}
				});
				
	
		}
		res.locals.query = req.query;

		queryKeys.splice(queryKeys.indexOf('page'), 1);

		const delimiter = queryKeys.length ? '&' : '?';

		res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;

		next();	

	}

};


module.exports = middleware;