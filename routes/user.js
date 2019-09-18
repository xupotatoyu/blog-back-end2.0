var express = require('express');
var router = express.Router();
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

/* GET users listing. */
router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  const result = login(username, password)
  return result.then(data => {
    
    if (data.username) {
      req.session.username = data.username
      req.session.realname = data.realname

      console.log('req.session is ', req.session)
      res.json(
        {errno:0}
      )
      return //登录成功后返回，不再执行下面的信息
    }
    else {
      res.json(
        {errno:1}
    )}

  })
});


router.get('/login-test', (req, res, next) => {
  const session =req.session
  if(session.username) {
    res.json({
      errno: 0,
      msg:'已登录'
    })
    return
  }
  res.json({
    errno: 1,
    msg:'未登录'
  })
});

// router.get('/session-test', (req, res, next) => {
//   const session =req.session
//   if(session.viewNum == null) {
//     session.viewNum = 0
//   }
//   session.viewNum++

//   res.json({
//     viewNum: session.viewNum
//   })
// });

module.exports = router;
