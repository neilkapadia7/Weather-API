const express = require('express');
const WeatherController = require('@controllers/weather');

const router = express.Router();

router.use('/locations', require('@routes/location')); 
router.get('/weather/:locationId', 
    async (req, res) => WeatherController.getWeatherDetails(req, res)
); 
router.get('/history', 
    async (req, res) => WeatherController.getWeatherHistory(req, res)
); 

module.exports = router;

