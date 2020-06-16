import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as session from 'express-session';
import * as socketIO from 'socket.io';
import * as cookieParser from 'cookie-parser';
import * as config from '../ormconfig';
import router from './routes/index';


const passport = require('passport');
require('./passport')(passport);

class App {
  public app: express.Application;

  public port: number;

  public server: any;

  public io: socketIO.Server;

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
    this.app.use(cors({
      origin: true,
      credentials: true,
    }));
    this.app.use(bodyParser.json());
    this.app.use(
      session({
        secret: 'moduerun',
        resave: false,
        saveUninitialized: true,
      }),
    );
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

  close() {
    this.server.close();
  }

  public listen() {
    this.server = this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });

    this.io = socketIO(this.server);
    this.io.on('connection', (socket) => {
      console.log('user connect');

      socket.on('leaveRoom', (scheduleId, name) => {
        socket.leave(scheduleId, () => {
          console.log(`${name} leave a ${scheduleId}`);
          this.io.to(scheduleId).emit('leaveRoom', scheduleId, name);
        });
      });

      socket.on('joinRoom', (scheduleId, name) => {
        socket.join(scheduleId, () => {
          console.log(`${name} join a ${scheduleId}`);
          this.io.to(scheduleId).emit('joinRoom', scheduleId, name);
        });
      });

      socket.on('chat message', (name, msg) => {
        this.io.emit('chat message', `${name} ${msg}`);
      });

      socket.on('disconnect', () => {
        console.log('user out');
      });
    });
  }
}

export default App;
