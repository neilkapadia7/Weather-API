require("dotenv").config();
require("module-alias/register");
const express = require('express');
const connectDB = require('@config/db');
const rateLimit = require('express-rate-limit');

const app = express();

connectDB();

app.use(express.json({ extended: false }));

// Adding 30 Requests in 2 mins
const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 30,
	message: 'Too many requests from this IP, please try again later.',
  });
  
app.use(limiter);


app.get('/', (req, res) => {
	res.json({ msg: 'Welcome to the Weather API' });
});


app.use('/api', require('@routes/api'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server Started on Port Number: ${PORT}`));
