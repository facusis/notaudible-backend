const {configSecurity} = require("./src/controllers/jwt");
const {userRouters} = require("./src/controllers/routers");
require('dotenv').config();
const morgan = require('morgan');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const buildDataRouter = require('./src/controllers/data').buildRouter;

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
// userRouters(app);

app.use('/data', buildDataRouter());

const bookRouter = require('./src/controllers/upload_controller').router;
app.use('/books', bookRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
