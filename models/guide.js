const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const CityGuideSchema = new Schema ({
    title: String,
    conclusions: String,
    introduction: String,
    location: String,
    country: String,
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
    images: [{
        url:String,
        public_id:String
    }],
	body: String,
    creationDate: String,
    data:[String],
    labels:[String]
});

CityGuideSchema.plugin(mongoosePaginate);

CityGuideSchema.index({ geometry: '2dsphere'})

module.exports = mongoose.model('Guide', CityGuideSchema);