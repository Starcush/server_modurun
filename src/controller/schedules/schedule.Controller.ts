import scheduleRepository from '../../repository/scheduleRepository';
import userUtil from '../../util/userUtil';

export default {
  post: async (req, res) => { // 스케줄 생성하기
    const {
      trackId, scheduleTitle, from, to,
    } = req.body;
    const userInfo = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });

    try {
      const scheduleId = await scheduleRepository.insertSchedule(trackId, scheduleTitle, from, to);
      scheduleRepository.insertUserSchedule(userInfo.userId, scheduleId);
      res.send(200);
    } catch (err) {
      res.status(400).send();
    }
  },
  get: async (req, res) => {
    res.send(200);
  },
};
