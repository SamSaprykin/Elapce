const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const ProjectSchema = new Schema ({
    title: String,
    description: String,
    price: Number,
    type:String,
    appointment: String,
    seaDistance: Number,
    area: Number,
    bedrooms: [{
        type: String
    }],
    images: [{
        url:String,
        public_id:String
    }],
    priceList: [{
        url:String,
        public_id:String
    }],
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required:true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    properties: {
        description: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' 
        }    
    ],
    avgRating: {
        type:Number,
        default:0
    }
});

ProjectSchema.pre('remove', async function(){
    await Review.remove({
        _id: {
            $in: this.reviews
        }
    });
});

ProjectSchema.methods.calculateAverageRating = function() {
    let ratingsTotal = 0;
    if(this.reviews.length) {
        this.reviews.forEach( review => {
            ratingsTotal += review.rating
        });
        this.avgRating = Math.round((ratingsTotal / this.reviews.length)* 10) /10;
    } else {
        this.avgRating = ratingsTotal;
    }
    
    const floorRating = Math.floor(this.avgRating);
    this.save();
    return floorRating;
}

ProjectSchema.plugin(mongoosePaginate);

ProjectSchema.index({ geometry: '2dsphere'})

module.exports = mongoose.model('Project', ProjectSchema);

