/* eslint-disable import/no-extraneous-dependencies */

import * as request from 'supertest';
import { expect } from 'chai';
// import app from '../server';
import { TrackSeed } from '../seed/track.seed';
import App from '../app';

const fakedata = {
  trackTitle: 'test1',
  origin: `{
            "latitude": 37.205945,
            "longitude": 127.111646
          }`,
  destination: `{
            "latitude": 37.204731,
            "longitude": 127.116066
          }`,
  route: `[
  {
    "latitude": 37.205945,
    "longitude": 127.111646
  },
  {
    "latitude": 37.204552,
    "longitude": 127.112794
  },
  {
    "latitude": 37.204731,
    "longitude": 127.116066
  },
];`,
  trackLength: 700,
};

const app = new App(5000);
app.listen();
const agent = request(app.app);

describe('ModueRun - Server tracks API test', () => {
  before(async (done) => {
    console.log('테스트 시작');
    done();
  });
  after((done) => {
    app.close();
    console.log('테스트 끝');
    done();
  });
  describe('GET /tracks', () => {
    const userPosition = {
      latitude: 37.202246,
      longitude: 127.114184,
    };
    const area = {
      latitude: 37.206755,
      longitude: 127.107272,
      latitudeDelta: -0.010504,
      longitudeDelta: 0.010504,
    };
    it('it should return filtered track list when maxLength filter on', async () => {
      const filter = {
        maxLength: 500,
        distance: -1,
        rate: false,
        recent: false,
      };
      const url = `/tracks/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(url);
      expect(response.body).to.deep.equal([
        TrackSeed.test[0],
        TrackSeed.test[1],
        TrackSeed.test[3],
      ]);
    });
    it('it should return filtered track list when distance filter on', async () => {
      const filter = {
        maxLength: -1,
        distance: 500,
        rate: false,
        recent: false,
      };
      const url = `/tracks/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(encodeURI(url));
      expect(response.body).to.deep.equal([
        TrackSeed.test[0],
        TrackSeed.test[1],
        TrackSeed.test[2],
        TrackSeed.test[3],
      ]);
    });
    it('it should return filtered track list when rate filter on', async () => {
      const filter = {
        maxLength: -1,
        distance: -1,
        rate: true,
        recent: false,
      };
      const url = `/tracks/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(encodeURI(url));
      expect(response.body).to.deep.equal(TrackSeed.test);
    });
    it('it should return filtered track list when recent filter on', async () => {
      const filter = {
        maxLength: -1,
        distance: -1,
        rate: false,
        recent: true,
      };
      const url = `/tracks/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(encodeURI(url));
      expect(response.body).to.deep.equal(TrackSeed.test.reverse());
    });
    it('it should return filtered tracks list when maxLength,distance,rate on', async () => {
      const filter = {
        maxLength: 500,
        distance: 500,
        rate: true,
        recent: false,
      };
      const url = `/tracks/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(encodeURI(url));
      expect(response.body).to.deep.equal([
        TrackSeed.test[0],
        TrackSeed.test[1],
        TrackSeed.test[3],
      ]);
    });
    it('it should return filtered track list when maxLength,distance,recent on', async () => {
      const filter = {
        maxLength: 500,
        distance: 500,
        rate: false,
        recent: true,
      };
      const url = `/tracks/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(encodeURI(url));
      expect(response.body).to.deep.equal([
        TrackSeed.test[0],
        TrackSeed.test[1],
        TrackSeed.test[3],
      ]);
    });
    it('it should response 404 status code when the track cannot be found', async () => {
      const filter = {
        maxLength: 1,
        distance: 1,
        rate: false,
        recent: true,
      };
      const url = `/tracks/${JSON.stringify(filter)}/${JSON.stringify(userPosition)}/${JSON.stringify(area)}`;
      const response = await agent.get(encodeURI(url));
      expect(response.status).to.equal(404);
    });
  });
  describe('POST /tracks/track', () => {
    it('it should response 200 status code when saving track is sucsess', async () => {
      const response = await agent.post('/tracks/track').send(fakedata);
      expect(response.status).to.equal(200);
    });
  });
  describe('GET /track/track', () => {
    it('it should return track', async () => {
      const response = await agent.get('/tracks/track/1');
      expect(response.status).to.equal(200);
      expect(response.body).to.own.include(TrackSeed.test[0]);
    });
    it('it should response 404 status code when the track cannot be found', async () => {
      const response = await agent.get('/tracks/track/1000');
      expect(response.status).to.equal(404);
    });
  });
  describe('DELETE /tracks/track', () => {
    it('it should response 200 status code when saving track is sucsess', async () => {
      const response = await agent.delete('/tracks/track/test1');
      expect(response.status).to.equal(200);
    });
  });
  describe('POST /users/tracks', () => {
    it('it should response 200 status code when saving track in userTrack list is sucsess', async () => {
      const response = await agent.post('/users/tracks').send({
        trackId: 1,
        userId: 1,
      });
      expect(response.status).to.equal(200);
    });
    it('it should response 409 status code when saving track is conflicted', async () => {
      const response = await agent.post('/users/tracks').send({
        trackId: 1,
        userId: 1,
      });
      expect(response.status).to.equal(409);
    });
  });
  describe('PATCH /users/tracks', () => {
    it('it should response 200 status code when bookmarking track is sucsess', async () => {
      const response = await agent.patch('/users/tracks').send({
        trackId: 1,
        userId: 1,
      });
      expect(response.status).to.equal(200);
    });
    it('it should response 400 status code when not found track', async () => {
      const response = await agent.patch('/users/tracks').send({
        trackId: 1,
        userId: 3,
      });
      expect(response.status).to.equal(400);
    });
  });
  describe('DELETE /users/tracks', () => {
    it('it should response 200 status code when deleting track is sucsess', async () => {
      const response = await agent.delete('/users/tracks').send({
        trackId: 1,
        userId: 1,
      });
      expect(response.status).to.equal(200);
    });
    it('it should response 404 status code when not found userTrack', async () => {
      const response = await agent.delete('/users/tracks').send({
        trackId: 1,
        userId: 2,
      });
      expect(response.status).to.equal(404);
    });
  });
  describe('GET /users/tracks', () => {
    it('it should response 200 status code when deleting track is sucsess', async () => {
      const response = await agent.get('/users/tracks/1');
      expect(response.body).to.own.include([TrackSeed.test[0], TrackSeed.test[1]]);
      expect(response.status).to.equal(200);
    });
    it('it should response 404 status code when not found userTrack', async () => {
      const response = await agent.get('/users/tracks/100');
      expect(response.status).to.equal(404);
    });
  });
  describe('POST /users/tracks/rate', () => {
    it('it should response 200 status code when deleting track is sucsess', async () => {
      const response = await agent.post('/users/tracks/rate').send({
        trackId: 1,
        rate: 3,
      });
      expect(response.status).to.equal(200);
    });
    it('it should response 404 status code when not found userTrack', async () => {
      const response = await agent.post('/users/tracks/rate').send({
        trackId: 10,
        rate: 3,
      });
      expect(response.status).to.equal(404);
    });
  });
});
