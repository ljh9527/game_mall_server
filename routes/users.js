var express = require('express');
var router = express.Router();
var URL = require('url');
//加载mysql模块
var mysql = require('mysql');
//创建连接
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'game_mall'
});
//执行创建连接 
connection.connect();
//SQL语句
var sql = 'SELECT * FROM users_info';
var addSql = 'INSERT INTO users_info(email,password,nickname) VALUES(?,?,?)';
// 请求返回数据
const resData = {
  code: 500,
  message: "",
  data: {},
};

router.get('/', function (req, res, next) {
  //查
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    };
    resData.message = "查询成功";
    resData.data = result;
    //把搜索值输出
    res.send(resData);
  });
});

router.post('/login', function (req, res, next) {
  //解析请求参数
  var content = req.body;

  // 登录
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    };
    let isHaveAccount = result.some((item) => {
      if (item.email === content.email && item.password === content.password) {
        return true;
      } else {
        return false;
      };
    });
    if (isHaveAccount) {
      resData.code = 200;
      resData.message = "登录成功";
      res.send(resData);
    } else {
      resData.code = 250;
      resData.message = "登录失败";
      res.send(resData);
    }
  });
});

router.post('/register', function (req, res, next) {
  //解析请求参数
  var content = req.body;
  console.log(content);
  var addSqlParams = [content.email, content.password, content.nickname];

  // 增
  connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      resData.message = "注册失败！";
      res.send(resData);
      return;
    };
    resData.code = 200;
    resData.message = "注册成功！";
    res.send(resData);
  });
});

module.exports = router;
