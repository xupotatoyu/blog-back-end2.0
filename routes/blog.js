var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const {SuccessModel, ErrorModel }= require('../model/resModel')
const loginCheck =require('../minddleware/loginCheck')
//获取博客列表
router.get('/list', (req, res, next) => {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''

  if (req.query.isadmin) {
      console.log('is admin')
      // 管理员界面
      if (req.session.username == null) {
          console.error('is admin, but no login')
          // 未登录
          res.json(
              new ErrorModel('未登录')
          )
          return
      }
      // 强制查询自己的博客
      author = req.session.username
  }

  const result = getList(author, keyword)
  return result.then(listData => {
      res.json(
          new SuccessModel(listData)
      )
  })
});

router.get('/detail',(req,res,next) =>{
    id =req.query.id
    const result= getDetail(id)
    return result.then(data =>{
        res.json(
            new SuccessModel(data)
        )
    })
})

router.post('/new', loginCheck,(req, res, next) =>{
    req.body.author = req.session.username//加入当前用户的姓名
    const result = newBlog(req.body)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
})

router.post('/update',loginCheck,(req, res, next)=>{
  const result = updateBlog(req.query.id,req.body)
  return result.then(data => {
      res.json(
          new SuccessModel(data)
      )
  })
})
 
router.post('/del', loginCheck, (req, res, next) => {
  const author = req.session.username
  const result = delBlog(req.query.id, author)
  return result.then(val => {
      if (val) {
          res.json(
              new SuccessModel()
          )
      } else {
          res.json(
              new ErrorModel('删除博客失败')
          )
      }
  })
})

// // 登录检测
// router.get('/tsession',(req,res,next) => {
//   console.log("获取名字",req.session.username)
//   res.json(
//     {username:req.session.username}
//     )
// })

module.exports = router;