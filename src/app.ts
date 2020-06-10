import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import { createConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';
// import * as passport from 'passport';
// import * as cookieSession from 'cookie-session';
import * as config from '../ormconfig';
import router from './routes/index';

const passport = require('passport');
require('./passport')(passport);
// const passport = require('./passport');

class App {
  public app: express.Application;

  public port: number;

  constructor(port) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
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
    // passport();
    // const isLoggedIn = (req, res, next) => {
    //   if (req.user) {
    //     next();
    //   } else {
    //     res.sendStatus(401);
    //   }
    // };
    // require('./passport')(passport);
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(morgan('dev'));

    // this.app.use('/google', isLoggedIn, passport.authenticate('google', { scope: ['profile', 'email'] }));
    // this.app.use('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    //   (req, res) => {
    //     res.redirect('/');
    //   });
    // this.app.use('/failed', (req, res) => res.send('you Failed to log in'));
    this.app.use('/', router);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
