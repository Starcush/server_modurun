const router = require('express').Router();
const passport = require('passport');

// const isLoggedIn = (req, res, next) => {
//     console.log(req.user)
//   if (req.user) {
//     next();
//   } else {
//     res.sendStatus(401);
//   }
// };

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  (req, res) => {
    // console.log(res);
    res.redirect('/');
  });

export default router;
