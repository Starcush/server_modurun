import userUrl from '../tracks/usersTracks.Controller';

export default {
  track: {
    post: userUrl.post,
    delete: userUrl.delete,
    patch: userUrl.patch,
    get: userUrl.get,
    postRate: userUrl.postRate,
  },
};
