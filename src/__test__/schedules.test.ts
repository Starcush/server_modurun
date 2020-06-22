/* eslint-disable import/no-extraneous-dependencies */
import * as session from 'supertest-session';
import { expect } from 'chai';
import { TrackSeed } from '../seed/track.seed';
import App from '../app';
import { ScheduleSeed } from '../seed/schedule.seed';


const app = new App(5000);
app.listen();
const agent = session(app.app);

const fakedata = {
  trackId: 1,
  scheduleTitle: '삼일 뒤 동네 한바퀴',
  from: new Date((new Date()).valueOf() + 1000 * 3600 * 73),
  to: new Date((new Date()).valueOf() + 1000 * 3600 * 74),
};

describe('ModueRun - Server Schedules API test', () => {
  before(async (done) => {
    console.log('테스트 시작');
    done();
  });
  beforeEach((done) => {
    agent.post('/users/signin')
      .send({ email: 'test@gmail.com', password: '1234' })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
  after((done) => {
    app.close();
    console.log('테스트 끝');
    done();
  });
  describe('POST /schedules', () => {
    it('it should response 200 status code when saving schedules is sucsess', async () => {
      const response = await agent.post('/schedules').send(fakedata);

      expect(response.body.track).to.deep.equal(TrackSeed.test[0]);
      expect(response.body.schedule).to.deep.equal({
        scheduleTitle: '오늘 공원 한바퀴',
        from: '2020-06-16 14:30:44',
        to: '2020-06-16 15:30:44',
      });
      expect(response.status).to.equal(200);
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
    it('it should return filtered schedule list when maxLength filter on', async () => {
      const filter = {
        maxLength: 900,
        distance: -1,
        rate: false,
        recent: false,
        date: {
          from: -1,
          to: -1,
        },
      };
      const url = `/users/schedules/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(url);
      ScheduleSeed.forEach((ele, idx) => {
        expect(response.body[idx].track).to.deep.equal(TrackSeed.test[idx]);
        expect(response.body[idx].schedule).to.deep.equal({
          scheduleTitle: ele.title,
          from: ele.scheduleFrom.toString(),
          to: ele.scheduleTo.toString(),
          participants: 1,
          userJoined: true,
        });
      });
      expect(response.status).to.equal(200);
    });
    it('it should return filtered schedule list when distance filter on', async () => {
      const filter = {
        maxLength: -1,
        distance: 500,
        rate: false,
        recent: false,
        date: {
          from: -1,
          to: -1,
        },
      };
      const url = `/users/schedules/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(url);
      ScheduleSeed.forEach((ele, idx) => {
        expect(response.body[idx].track).to.deep.equal(TrackSeed.test[idx]);
        expect(response.body[idx].schedule).to.deep.equal({
          scheduleTitle: ele.title,
          from: ele.scheduleFrom.toString(),
          to: ele.scheduleTo.toString(),
          participants: 1,
          userJoined: true,
        });
      });
      expect(response.status).to.equal(200);
    });
    it('it should return filtered schedule list when rate filter on', async () => {
      const filter = {
        maxLength: -1,
        distance: -1,
        rate: true,
        recent: false,
        date: {
          from: -1,
          to: -1,
        },
      };
      const url = `/schedules/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(url);
      response.body.reverse();
      ScheduleSeed.forEach((ele, idx) => {
        expect(response.body[idx].track).to.deep.equal(TrackSeed.test[idx]);
        expect(response.body[idx].schedule).to.deep.equal({
          scheduleTitle: ele.title,
          from: ele.scheduleFrom.toString(),
          to: ele.scheduleTo.toString(),
          participants: 1,
          userJoined: true,
        });
      });
      expect(response.status).to.equal(200);
    });
    it('it should return filtered schedule list when recent filter on', async () => {
      const filter = {
        maxLength: -1,
        distance: -1,
        rate: false,
        recent: true,
        date: {
          from: -1,
          to: -1,
        },
      };
      const url = `/schedules/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(url);
      response.body.reverse();
      ScheduleSeed.forEach((ele, idx) => {
        expect(response.body[idx].track).to.deep.equal(TrackSeed.test[idx]);
        expect(response.body[idx].schedule).to.deep.equal({
          scheduleTitle: ele.title,
          from: ele.scheduleFrom.toString(),
          to: ele.scheduleTo.toString(),
          participants: 1,
          userJoined: true,
        });
      });
      expect(response.status).to.equal(200);
    });
    it('it should return filtered schedule list when date filter on', async () => {
      const filter = {
        maxLength: -1,
        distance: -1,
        rate: false,
        recent: false,
        date: {
          from: new Date('2020-06-16 16:34:50').toString(),
          to: new Date('2020-06-16 17:34:50').toString(),
        },
      };
      const url = `/schedules/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(url);
      expect(response.body[0].track).to.deep.equal(TrackSeed.test[0]);
      expect(response.body[0].schedule).to.deep.equal({
        scheduleTitle: '오늘 동네 한바퀴',
        from: new Date('2020-06-16 14:30:44').toString(),
        to: new Date('2020-06-16 15:30:44').toString(),
        participants: 1,
        userJoined: true,
      });
      expect(response.status).to.equal(200);
    });
    it('it should return filtered schedule list when all filters on', async () => {
      const filter = {
        maxLength: 500,
        distance: 500,
        rate: true,
        recent: false,
        date: {
          from: new Date('2020-06-16 16:34:50'),
          to: new Date('2020-06-17 17:34:50'),
        },
      };
      const url = `/schedules/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(url);
      expect(response.body[0].track).to.deep.equal(TrackSeed.test[1]);
      expect(response.body[0].schedule).to.deep.equal({
        scheduleTitle: '내일 공원 두바퀴',
        from: '2020-06-17 16:34:50',
        to: '2020-06-17 17:34:50',
        participants: 1,
        userJoined: true,
      });
      expect(response.body[1].track).to.deep.equal(TrackSeed.test[0]);
      expect(response.body[1].schedule).to.deep.equal({
        scheduleTitle: '오늘 공원 한바퀴',
        from: '2020-06-16 14:30:44',
        to: '2020-06-16 15:30:44',
        participants: 1,
        userJoined: true,
      });
      expect(response.status).to.equal(200);
    });
  });
  describe('GET /users/schedules', () => {
    it('it should response 200 status code when get schedule request is sucsess', async () => {
      const response = await agent.get('/users/schedules');
      expect(response.body.track).to.deep.equal([
        {
          scheduleId: 1,
          scheduleTitle: '오늘 동네 한바퀴',
          trackId: 1,
          trackTitle: '동탄순환대로24',
          from: '2020-06-16 14:30:44',
          to: '2020-06-16 15:30:44',
          participants: 1,
        },
        {
          scheduleId: 2,
          scheduleTitle: '내일 공원 두바퀴',
          trackId: 2,
          trackTitle: '동탄순환대로24',
          from: '2020-06-17 14:30:44',
          to: '2020-06-17 15:30:44',
          participants: 1,
        },
        {
          scheduleId: 3,
          scheduleTitle: '모레 공원 세바퀴',
          trackId: 3,
          trackTitle: '동탄순환대로24',
          from: '2020-06-18 14:30:44',
          to: '2020-06-18 15:30:44',
          participants: 1,
        },
      ]);
      expect(response.status).to.equal(200);
    });
  });
  describe('POST /users/schedules', () => {
    it('it should response 200 status code when saving schedule is sucsess', async () => {
      const response = await agent.post('/users/schedules').send({
        scheduleId: 1
      });
      expect(response.body).to.deep.equal({
        scheduleTitle: '오늘 공원 한바퀴',
        participants: 1,
        trackLength: 414,
        from: '2020-06-16 14:30:44',
        to: '2020-06-16 15:30:44'
      });
      expect(response.status).to.equal(200);
    });
  });
  describe('DELET /users/schedules', () => {
    it('it should response 200 status code when deleting schedule is sucsess', async () => {
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
