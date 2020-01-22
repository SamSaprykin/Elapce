const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const ArticleSchema = new Schema ({
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    conclusions: String,
    introduction: String,
    images: [{
        url:String,
        public_id:String
    }],
	body: String,
    creationDate: String,
    category:String
});

ArticleSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Article', ArticleSchema);