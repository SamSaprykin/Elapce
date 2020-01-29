const Article = require('../models/article');
const moment = require('moment');
const { cloudinary } = require('../cloudinary');
const showdown  = require('showdown');

converter = new showdown.Converter();

module.exports = {
	// Posts Index
	async articlesIndex(req, res, next) {
        const { dbQuery } = res.locals;
        
        
        delete res.locals.dbQuery 
        let articles = await Article.paginate(dbQuery, {
            page: req.query.page || 1,
            limit:16,
            sort: {'_id': -1}
        });
        
        articles.page = Number(articles.page);
        if (!articles.docs.length && res.locals.query) {
            res.locals.error = "Не найдены результаты по Вашему запросу."
        }
        
		res.render('articles/index', { articles, title: 'Статьи' });
	},
	// Posts New
	articleNew(req, res, next) {
		res.render('articles/new');
    },
    
	async articleCreate(req, res, next) {
        // use req.body to create a new Article
        
        
        req.body.article.images = [];
        
        for(const file of req.files) {
			
			req.body.article.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
        }

        
       

        req.body.article.author =  req.user._id;
        req.body.article.creationDate =  moment().format("YYYY-MM-DD").toString();
        text = req.body.article.body;
        html = converter.makeHtml(text);
        req.body.article.body = html
       
        let article = new Article(req.body.article);
        await article.save();
        res.redirect(`/articles/${article.id}`);
        
    },
    async articleShow(req, res, next) {
        let article = await Article.findById(req.params.id);
        
        res.render('articles/show', {article})
    },
    async articleEdit(req, res, next) {
        let article = await Article.findById(req.params.id);
        res.render('articles/edit', {article});
    },
    async articleUpdate(req, res, next) {
        
        const {article} = res.locals;
        
        
        if(req.body.deleteImages && req.body.deleteImages.length ) {
            let deleteImages = req.body.deleteImages;

            for(const public_id of deleteImages) {
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);    
                for(const image of article.images) {
                    if (image.public_id === public_id) {
                        let index = article.images.indexOf(image);
                        article.images.splice(index,1);
                    }
                }            
            }
        }

        if(req.files) {
            for(const file of req.files) {
                
                article.images.push({
                    url: file.secure_url,
                    public_id: file.public_id
                });
            }
        }
    
        
        article.title = req.body.title;
        text = req.body.body;
        html = converter.makeHtml(text);
        article.body = html;
        article.category = req.body.article.category;
        article.conclusions =  req.body.article.conclusions;
        article.introduction =  req.body.article.introduction;
        article.save();

        res.redirect(`/articles/${article.id}`);
    },  
	
    async articleDestroy(req, res, next) {

        const { article } = res.locals;
        for(const image of article.images) {
            await cloudinary.v2.uploader.destroy(image.public_id); 
        }
        await article.remove();
        req.session.success = 'Статья была успешно удалена'
        res.redirect('/articles');
    }
}