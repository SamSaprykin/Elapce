const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema ({
    title: String,
    description: String,
    price: Number,
    images: [String],
    location: String,
    lat: Number,
    log: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' 
        }    
    ]
});


module.exports = mongoose.model('Project', ProjectSchema);

