/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai';
import { TrackSeed } from '../seed/track.seed';
import { ScheduleSeed } from '../seed/schedule.seed';
import * as session from 'supertest-session';
import App from '../app';


const app = new App(5000);
app.listen();
const agent = session(app.app);

const fakedata = {
  trackId: 1,
  scheduleTitle: '내일 동네 한바퀴',
  from: new Date((new Date()).valueOf() + 1000 * 3600),
  to: new Date((new Date()).valueOf() + 1000 * 3600 * 1.5),
};
console.log()
describe('ModueRun - Server Schedules API test', () => {
  before(async (done) => {
    console.log('테스트 시작');
    done();
  });
  beforeEach(async (done) => {
    agent.post('/users/signin')
      .send({ email: 'test@gmail.com', password: '1234' })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  })
  after((done) => {
    app.close();
    console.log('테스트 끝');
    done();
  });
  describe('POST /schedules', () => {
    it('it should response 200 status code when saving schedules is sucsess', async () => {
      const response = await agent.post('/schedules').send(fakedata);

      expect(response.body.track).to.deep.equal(TrackSeed.test[0]);
      expect(response.body.schedule).to.deep.equal(ScheduleSeed[0]);
      expect(response.status).to.equal(200);
      expect(200).to.equal(200);
    });
  });
  describe('GET /schedules', () => {
    const userPosition = {
      latitude: 37.202246,
      longitude: 127.114184,
    };
    const area = {
      latitude: 37.206755,
      longitude: 127.107272,
      latitudeDelta: -0.010504,
      longitudeDelta: 0.020504,
    };
    it('it should return filtered track list when maxLength filter on', async () => {
      const filter = {
        maxLength: 500,
        distance: -1,
        rate: false,
        recent: false,
        date: {
          from: new Date((new Date()).valueOf() + 1000 * 3600),
          to: new Date((new Date()).valueOf() + 1000 * 3600 + 10),
        },
      };
      const url = `/users/schedules/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(url);
      expect(response.body).to.deep.equal([
        ScheduleSeed.test[0]...
      ]);
    });
    it('it should return filtered track list when distance filter on', async () => {
      const filter = {
        maxLength: -1,
        distance: 500,
        rate: false,
        recent: false,
        date: {
          from: new Date((new Date()).valueOf() + 1000 * 3600),
          to: new Date((new Date()).valueOf() + 1000 * 3600 + 10),
        },
      };
      const url = `/users/schedules/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(url);
      expect(response.body).to.deep.equal([
        ScheduleSeed.test[0]...
      ]);
    });
    it('it should return filtered track list when rate filter on', async () => {
      const filter = {
        maxLength: -1,
        distance: -1,
        rate: true,
        recent: false,
        date: {
          from: new Date((new Date()).valueOf() + 1000 * 3600),
          to: new Date((new Date()).valueOf() + 1000 * 3600 + 10),
        },
      };
      const url = `/schedules/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(url);
      expect(response.body).to.deep.equal([
        ScheduleSeed.test[0]...
      ]);
    });
    it('it should return filtered track list when recent filter on', async () => {
      const filter = {
        maxLength: -1,
        distance: -1,
        rate: false,
        recent: true,
        date: {
          from: new Date((new Date()).valueOf() + 1000 * 3600),
          to: new Date((new Date()).valueOf() + 1000 * 3600 + 10),
        },
      };
      const url = `/schedules/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(url);
      expect(response.body).to.deep.equal([
        ScheduleSeed.test[0]...
      ]);
    });
  });
  describe('GET /users/schedules', () => {
    it('it should response 200 status code when get schedule request is sucsess', async () => {
      const response = await agent.get('/users/schedules');
      expect(response.status).to.equal(200);
    });
  });
  describe('POST /users/schedules', () => {
    it('it should response 200 status code when saving schedule is sucsess', async () => {
      const response = await agent.post('/users/schedules').send({
        scheduleId: 1
      });
      expect(response.body.track).to.deep.equal({
        scheduleTitle: ScheduleSeed[0].title,
        participants: 2,
        trackLength: 410,
        from: ScheduleSeed[0].scheduleFrom,
        to: ScheduleSeed[0].scheduleTo
      });
      expect(response.status).to.equal(200);
    });
  });
  describe('DELET /users/schedules', () => {
    it('it should response 404 status code when deleting schedule is sucsess', async () => {
      const response = await agent.delete('/users/schedules').send({
        scheduleId: 1
      });
      expect(response.status).to.equal(200);
    });
    it('it should response 404 status code when deleting schedule is faild', async () => {
      const response = await agent.delete('/users/schedules').send({
        scheduleId: 20
      });
      expect(response.status).to.equal(404);
    });
  });
});
