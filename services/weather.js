require("dotenv").config();
const axios = require("axios");
const Weather = require("@models/Weather");

module.exports = {
    async getWeatherDetails(location) {
        return new Promise(async (resolve, reject) => {
            try {
                let getDetails = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}`)
                
                return resolve({isError: false, data: getDetails.data})
            } catch (error) {
                // console.log('Eoor -> ', error);
                // console.log("Service Error -> ", error.response.data.message);
                // console.log("Service Error2  -> ", error.message);
                return resolve({isError: true, err: error, msg: error.response?.data?.message || error.message})
            }
        });
        
    }
}