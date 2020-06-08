import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import router from './routes/index';
import 'dotenv/config';
// Import Routers
// import router from './routes';
// Connect typeORM mysql
createConnection()
  .then(() => {
    console.log('Database Connected :)');
  })
  .catch((error) => console.log(error));
// Create express server
const app = express();
// middlewares
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(morgan('dev'));
app.use(cors());
// Routes
app.use('/', router);

app.listen(app.get('port'), () => console.log(`BillyZip App Listening on PORT ${app.get('port')}`));
