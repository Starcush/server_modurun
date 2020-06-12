import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import router from './routes/index';

class App {
  public app: express.Application;

  public port: number;

  public server: any;

  constructor(port) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
  }

  private initializeMiddlewares() {
    createConnection().then(async () => {
      console.log('db connect :)');
    }).catch((err) => {
      console.error(err);
    });
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      }),
    );
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use('/', router);
  }

  close() {
    this.server.close();
  }

  public listen() {
    this.server = this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
