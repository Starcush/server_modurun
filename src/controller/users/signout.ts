export default {
  get: (req, res) => {
    // req.logout();
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
