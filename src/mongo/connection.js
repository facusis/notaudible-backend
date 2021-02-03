// const mongoose = require('mongoose');
// require('dotenv').config();
// const databaseURL = process.env.DATABASE_URL;

// mongoose.connect(databaseURL, {
//     dbName: 'audible-clone',
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// })
// .then(() => {
//     console.log('mongodb connected.');
// })
// .catch((err) => console.log(err.message));

// mongoose.connection.on('connected', () => {
//     console.log('Mongoose connected to db.');
// });

// mongoose.connection.on('error', (err) => {
//     console.log(err.message);
// });

// mongoose.connection.on('disconnected', () => {
//     console.log('Mongoose connection is disconnected.');
// });

// process.on('SIGINT', async () => {
//     await mongoose.connection.close();
//     process.exit(0);
// });




const mongoose = require('mongoose');
require('dotenv').config();
const databaseHost = process.env.DATABASE_HOST || 'localhost';
const databasePort = process.env.DATABASE_PORT || '27017';
const databaseName = process.env.DATABASE_NAME || 'app';
const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseURL = process.env.DATABASE_URL;


if (databaseURL) {
	mongoose.connect(databaseURL, { useNewUrlParser: true });
} else {
	if (databaseUser && databasePassword) {
		mongoose.connect(`mongodb://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}?authSource=admin`, {useNewUrlParser: true, useUnifiedTopology: true});
	} else {
		mongoose.connect(`mongodb://${databaseHost}:${databasePort}/${databaseName}?authSource=admin`, {useNewUrlParser: true, useUnifiedTopology: true});
	}
}

