var express = require('express');
var router = express.Router();
var db = require("./mysqlConn");

// res.body
query = {
    action:"addStu",//getStus getConsume addStu  updateStuCard  addStuConsume
    params:"{}"
}

// 第一步，实现伪数据交互
router.get('/', function(req, res, next) {
    res.render('stuAdmin', { title: '学生校园卡管理系统--made by cl,for 口碑电商' });
    res.end();
});

//done
router.post('/getStus',function(req, res){
    doWithRouter(req, res);
});
router.post('/getConsume',function(req, res){
    doWithRouter(req, res);
});
// working
router.post('/addStu',function(req, res){
    doWithRouter(req, res);
});
router.post('/addStuConsume',function(req, res){
    doWithRouter(req, res);
});
router.post('/updateStuCard',function(req, res){
    doWithRouter(req, res);
});
router.post('/delCard',function(req, res){
    doWithRouter(req, res);
});

// 将所有路由处理集成到此处执行
function doWithRouter(req, res){
    //console.log(req.url,req._parsedUrl.pathname);
    // 获取子路由
    var _route = req._parsedUrl.pathname.slice(1);
    var query = {};
    //console.log(_route);
    switch (_route){
        case "getStus":
            console.log("route stuCard/getStus :",req.body);
            query = {
                wants:"name,grade,sex,stuNum,money",
                table:"koubeiStuCard.stuInfos",
                conditions:{},
                pages:{
                    // 默认5，0 作为偏移
                    limit:req.body.limit || 5,
                    offset:req.body.pages - 1 || 0
                }
            }
            getStusFromDB(query,res);
            break;

        case "getConsume":
            query = {
                wants:"fromStu,type,count,place,time",
                table:"koubeiStuCard.consumeRecords",
                conditions:{},
                pages:{
                    limit:req.body.limit || 5,
                    offset:req.body.pages - 1 || 0
                }
            }
            getStusFromDB(query,res);
            break;
        case "addStuConsume":
            console.log("route stuCard/addStuConsume :",req.body);
            res.end()
            break;
        case "addStu":
            console.log("route stuCard/addStu :",req.body);
            res.end()
            break;
        case "updateStuCard":
            console.log("route stuCard/updateStuCard :",req.body);res.end()
            break;
        case "delCard":
            console.log("route stuCard/delCard :",req.body);res.end()
            break;
        default :
            break;
    }
    //res.end();
}

// 伪数据测试 -- 从数据库中返回伪数据 -- 待改成数据库中返回数据
function getStusFromDB(query, res){
    db.getStus(query,function(data){
        console.log("get from db : ",data);
        res.send(data);
        res.end();
    })
}


module.exports = router;
