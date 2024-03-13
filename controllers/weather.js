const Weather = require("@models/Weather");
const Location = require("@models/Locations");
const Responder = require('@service/responder');
const {getWeatherDetails} = require('@service/weather');
const moment = require("moment");


module.exports = {
    // /api/weather/:locationId
    async getWeatherDetails(req, res) {
        try {
            let {locationId} = req.params;
            let location = await Location.findById(locationId);
            
            if(!location || !location.isActive) {
                return Responder.respondWithNotFound(req, res, "Sorry! The locationId is incorrect");
            }

            // Check If Request Made in last 1 hour
            let lastHour = moment().subtract(60, "minutes").utc();
            let checkWeather = await Weather.findOne({locationId, createdAt: {"$gte": lastHour}}).lean();
            if(checkWeather) {
                return Responder.respondWithSuccess(req, res, checkWeather, "Success");
            }

            let weather = await getWeatherDetails(location.weatherAPIName);
            if(weather.isError) {
                return Responder.respondWithCustomError(req, res, weather.msg);
            }

            let weatherNew = await new Weather({
                locationId,
                weather: weather.data.weather,
                main: weather.data.main,
                coord: weather.data.coord,
            }).save();

            return Responder.respondWithSuccess(req, res, weatherNew, "Success");

        } catch (error) {
            console.log("API ERROR : ", error);
            Responder.respondWithError(req, res, error);
        }
    },

    // /history
    async getWeatherHistory(req, res) {
        try {
            let last10Days = moment().subtract(10, "days").utc();
            let getWeather = await Weather.find({createdAt: {"$gte": last10Days}}).lean();
            if(!getWeather[0]) {
                return Responder.respondWithNotFound(req, res, "Sorry! No Data Found");
            }

            return Responder.respondWithSuccess(req, res, getWeather, "Success");
        } catch (error) {
            console.log("API ERROR : ", error);
            Responder.respondWithError(req, res, error);
        }
    }
}