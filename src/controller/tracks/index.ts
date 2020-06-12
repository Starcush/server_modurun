import { Request, Response } from 'express';
import trackUrl from './trackUrl';
// import userUrl from './userUrl';
import tracksUrl from './tracksUrl';

export default {
  get: tracksUrl.get,
  track: {
    post: trackUrl.post,
    get: trackUrl.get,
    delete: trackUrl.delete,
  },
  // user: {
  //   post: userUrl.post,
  //   delete: userUrl.delete,
  //   patch: userUrl.patch,
  // },
};
