const Weather = require("@models/Weather");
const Location = require("@models/Locations");
const Responder = require('@service/Responder')
const {getWeatherDetails} = require('@service/weather')

module.exports = {
    // api/locations
    async getAllLocations(req, res) {
        try {
            let { page, search } = req.params;
            let query = {isActive: true};

            let pageNo = 1;
            if (page) {
                pageNo = page;
            }

            let total = await Location.countDocuments(query);
            let locations = await Location.find(query, {name: 1})
                .skip(25 * pageNo - 25)
                .limit(25)
                .sort({createdAt:-1})
                .lean(); 

            if(total == 0) {
                return Responder.respondWithNotFound(req, res, "Sorry! The Location Database is Empty");
            }

            locations.forEach(el => {
                el.cityId = el._id;
                el.cityName = el.name;
                delete el._id;
                delete el.name;

            })

            return Responder.respondWithSuccess(req, res, {locations, total}, "Success");
        } catch (error) {
            console.log("API ERROR : ", error);
            Responder.respondWithError(req, res, error);
        }
    },

    // api/locations/:locationId
    async getLocationById(req, res) {
        try {
            let {locationId} = req.params;

            let location = await Location.findById(locationId);
            if(!location) {
                return Responder.respondWithNotFound(req, res, "Sorry! The Location could not be found");
            }

            return Responder.respondWithSuccess(req, res, location, "Success");
        } catch (error) {
            console.log("API ERROR : ", error);
            Responder.respondWithError(req, res, error);
        }
    },

    // api/locations
    async addLocation(req, res) {
        try {
            let {name} = req.body;

            let checkLocation = await Location.findOne({name: name, isActive: true});
            if(checkLocation) {
                return Responder.respondWithCustomError(req, res, `Location Already Exists with ID - ${checkLocation._id}`)
            }

            let weather = await getWeatherDetails(name);
            if(weather.isError) {
                return Responder.respondWithCustomError(req, res, weather.msg);
            }
            
            let location = await new Location({
                name: name,
                weatherAPIName: weather.data?.name,
                long: weather.data?.coord?.lon,
                lat: weather.data?.coord?.lat
            }).save();

            return Responder.respondWithSuccess(req, res, location, "Success");
        } catch (error) {
            console.log("API ERROR : ", error);
            return Responder.respondWithError(req, res, error);
        }
    },

    // api/locations/:locationId
    async updateLocationById(req, res) {
        try {
            let {isDelete, name} = req.body; // to check if it is for delete or update

            let checkLocation = await Location.findOne({_id: req.params.locationId});
            if(!checkLocation) {
                return Responder.respondWithCustomError(req, res, `Location not Found!`)
            }
            
            checkLocation.name = name;

            // Edge Case if Someone Tries to Update Delhi in Mumbai
            if(checkLocation.name.toLowerCase() !== checkLocation.weatherAPIName.toLowerCase()) {
                return Responder.respondWithCustomError(req, res, `Cannot Change to New Location! Kindly Create a New Location`)
            }

            if (isDelete) {
                checkLocation.isActive = false;
            }

            await checkLocation.save();

            return Responder.respondWithSuccess(req, res, checkLocation, "Successfully Updated");

        } catch (error) {
            console.log("API ERROR : ", error);
            Responder.respondWithError(req, res, error);
        }
    }
}