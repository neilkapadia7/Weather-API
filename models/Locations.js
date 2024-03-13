const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
    weatherAPIName: {
        type: String
    },
    name: {
        type: String,
        required: true,
    },
    long: {
        type: Number,
    },
    lat: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, 
{
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
  );

module.exports = mongoose.model('Locations', LocationSchema);
