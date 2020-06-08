import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import { createConnection } from 'typeorm';
import * as config from '../ormconfig';
import router from './routes/index';

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

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
