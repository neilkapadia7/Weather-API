const mongoose = require('mongoose');

const WeatherSchema = mongoose.Schema({
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Locations",
    },
    weather: [],
    main: {},
    coord: {
        lon: {type: Number},
        lat: {type: Number},
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

module.exports = mongoose.model('Weathers', WeatherSchema);
