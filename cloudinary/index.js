const crypto = require('crypto');

const cloudinary =  require('cloudinary');
cloudinary.config({
    cloud_name:'dawgmnc0e',
    api_key:'835384519498396',
    api_secret: process.env.CLOUDINARY_SECRET
});



const cloudinaryStorage = require('multer-storage-cloudinary');
const storage = cloudinaryStorage({
    cloudinary,
    folder: 'elapce-projects',
    allowedFormats: ['jpeg', 'jpg', 'png', 'pdf'],
    filename: function (req, file, cb) {
        let buf = crypto.randomBytes(16);
        buf = buf.toString('hex');
        let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.pdf|\.png/ig, '');
        uniqFileName += buf;
      cb(undefined, uniqFileName );
    }
  });

  
  
  module.exports = {
      cloudinary,
      storage
  }

