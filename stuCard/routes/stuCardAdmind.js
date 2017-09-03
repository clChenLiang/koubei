var express = require('express');
var router = express.Router();
var db = require("./mysqlConn");

// res.body
query = {
    action:"addStu",//getStus  addStu  updateStuCard  addStuConsume
    params:"{}"
}

// 第一步，实现伪数据交互
router.get('/', function(req, res, next) {
    res.render('index', { title: '陈亮' });
    res.end();
});

router.get('/getStus',function(req, res){
    doWithRouter(req, res);
});

router.get('/addStu',function(req, res){
    doWithRouter(req, res);
});

router.get('/updateStuCard',function(req, res){
    doWithRouter(req, res);
});

router.get('/addStuConsume',function(req, res){
    doWithRouter(req, res);
});

// 将所有路由处理集成到此处执行
function doWithRouter(req, res){
    //console.log(req.url,req._parsedUrl.pathname);
    // 获取子路由
    var _route = req._parsedUrl.pathname.slice(1);
    //console.log(_route);
    switch (_route){
        case "getStus":
            console.log("route stuCard/getStus :",req.body);
            getStusFromDB("getStus",res);
            break;
        case "addStu":
            console.log("route stuCard/addStu :",req.body);
            break;
        case "updateStuCard":
            console.log("route stuCard/updateStuCard :",req.body);
            break;
        case "addStuConsume":
            console.log("route stuCard/addStuConsume :",req.body);
            break;
        default :
            break;
    }
    res.end();
}

// 伪数据测试
function getStusFromDB(params, res){
    db.getStus(params,function(data){
        res.send(data);
    })
    //res.send()
}


module.exports = router;
