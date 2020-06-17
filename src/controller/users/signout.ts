export default {
  get: (req, res) => {
    if (req.session.userToken) {
      req.session.destroy((err) => {
        if (err) {
          res.status(500).send();
        } else {
          res.redirect('/');
        }
      });
    } else {
      res.redirect('/');
    }
  },
};
