import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import { createConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';
import * as config from '../ormconfig';
import router from './routes/index';

const passport = require('passport');
require('./passport')(passport);

class App {
  public app: express.Application;

  public port: number;

  constructor(port) {
    if (!this.app) {
      this.app = express();
      this.port = port;

      this.initializeMiddlewares();
    }
  }

  private initializeMiddlewares() {
    createConnection(config)
      .then(() => {
        console.log('Database Connected :)');
      })
      .catch((error) => console.log(error));
    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      }),
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(morgan('dev'));
    this.app.use('/', router);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
