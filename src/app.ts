import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as session from 'express-session';
import * as socketIO from 'socket.io';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { Request } from 'express';
import * as sharedsession from 'express-socket.io-session';
import * as config from '../ormconfig';
import index from './middleware/index';
import router from './routes/index';
import messageRepository from './repository/messageRepository';

// const passport = require('passport');
// require('./passport')(passport);

class App {
  public app: express.Application;

  public port: number;

  public server: any;

  public io: socketIO.Server;

  public ws: any;

  public session: any;

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
    this.app.use(
      cors({
        origin: true,
        credentials: true,
      }),
    );
    this.session = session({
      secret: 'moduerun',
      resave: false,
      saveUninitialized: true,
    });
    this.app.use(bodyParser.json());
    this.app.use(this.session);
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      }),
    );
    this.app.use(morgan('dev'));
    this.app.use('/', index.verifyToken, router);
  }

  close() {
    this.server.close();
  }

  public listen() {
    this.server = this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
    this.io = socketIO(this.server, {
      requestCert: true,
      secure: true,
      rejectUnauthorized: false,
      transports: ['websocket'],
    });
    // session을 공유
    this.io.use(sharedsession(this.session));
    this.io
      .use((socket, next) => {
        index.socketMidleware(socket, next);
      })
      .on('connection', (socket) => {
        console.log('user connected');
        socket.on('leaveRoom', (scheduleId, name) => {
          socket.leave(scheduleId, () => {
            console.log(`${name} leave a ${scheduleId}`);
            this.io.to(scheduleId).emit('leaveRoom', scheduleId, name);
          });
        });

        socket.on('joinRoom', (scheduleId, username) => {
          socket.join(scheduleId, () => {
            console.log(`${username} join a ${scheduleId}`);
            this.io.to(scheduleId).emit('joinRoom', scheduleId, username);
          });
        });

        socket.on('chat message', (scheduleId, userId, username, message) => {
          messageRepository.insertUserChatting(scheduleId, userId, message);
          this.io
            .to(scheduleId)
            .emit('chat message', scheduleId, userId, username, message);
        });

        socket.on('disconnect', () => {
          console.log('user out');
        });
      });
  }
}

export default App;
