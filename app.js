const {configSecurity} = require("./src/controllers/jwt");
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const buildDataRouter = require('./src/controllers/data').buildRouter;
const userRouter = require('./src/controllers/userRouter').userRouter;
const trackRouter = require('./src/controllers/trackRouter').trackRouter;

const app = express();
const port = 3001;
app.use(require('easy-livereload')());
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.use(bodyParser.json());

app.use(morgan('dev'));

configSecurity(app);

app.use('/data', buildDataRouter());
app.use('/user', userRouter());
app.use('/track', trackRouter());

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
