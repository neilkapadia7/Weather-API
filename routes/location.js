const express = require('express');
const { check, validationResult } = require('express-validator');
// const Responder = require('@service/responder')

const router = express.Router();
const LocationController = require('@controllers/location');


// @route   GET    api/locations
// @desc    Get All Locations
// @access  Public
router.get('/', 
	async (req, res) => LocationController.getAllLocations(req, res)
);


// @route   POST   api/locations
// @desc   Add a Location
// @access  Public
router.post('/', 
    [
        check('name', 'Please Add Name').isString(),
    ],
	async (req, res) => {
        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
    
        LocationController.addLocation(req, res);
    }
);

// @route   GET    api/locations/:locationId
// @desc    Get a location
// @access  Public
router.get('/:locationId', 
	async (req, res) => LocationController.getLocationById(req, res)
);

// @route   POST    api/locations/:locationId
// @desc    Update a location
// @access  Public
router.post('/:locationId', 
    [
        check('isDelete', 'Please Add isDelete').isBoolean(),
        check('name', 'Please Add Name').isString().optional(),
    ],
    // Responder.validate.bind(Responder), // Using Valitions Below
	async (req, res) => {
        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

        LocationController.updateLocationById(req, res)
    }
);

module.exports = router;
