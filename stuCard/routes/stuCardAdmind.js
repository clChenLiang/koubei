var express = require('express');
var router = express.Router();
var db = require("./mysqlConn");

// res.body --- 待 del
query = {
    action:"addStu",//getStus getConsume addStu  updateStuCard  addStuConsume
    params:"{}"
}

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
    // 获取子路由
    var _route = req._parsedUrl.pathname.slice(1);
    var query = {};
    switch (_route){
        case "getStus":
            console.log("route stuCard/getStus :",req.body);
            query = {
                wants:req.body.wants || "name,grade,sex,stuNum,money",
                table:"koubeiStuCard.stuInfos",
                conditions:req.body.conditions || {},
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
            query = {
                //{ fromStu: '1811082659', type: 'reduce', count: '', place: '1' }
                wants:"fromStu,type,count,place,time",
                table:"koubeiStuCard.consumeRecords",
                //conditions:{type:"消费",fromStu:1811082659,count:5.6,place:"东区二餐二楼",time:timeFormate(new Date())}
                conditions:{type:req.body.type,fromStu:parseInt(req.body.fromStu),count:parseInt(req.body.count),place:req.body.place,time:timeFormate(new Date())}
            }
            console.log("route stuCard/addStuConsume :",req.body);
            addNew(query, res);
            break;
        case "addStu":
            query = {
                table:"koubeiStuCard.stuInfos",
                //conditions:{name:"李三",stuNum:1811082659,money:560,sex:"男",grade:"本科"},
                conditions:{name:req.body.name,stuNum:parseInt(req.body.stuNum),money:parseInt(req.body.money),sex:req.body.sex,grade:req.body.grade}
            }
            console.log("route stuCard/addStu :",req.body);
            addNew(query, res);
            break;
        case "updateStuCard":
            query = {
                table:"koubeiStuCard.stuInfos",
                conditions:{stuNum:parseInt(req.body.stuNum)},
                wants:{
                    name:req.body.name,
                    grade:req.body.grade,
                    sex:req.body.sex,
                    money:parseInt(req.body.money)
                }
            }
            console.log("route stuCard/updateStuCard :",req.body);
            updateInfo(query, res);
            break;
        case "delCard":
            query = {
                table:"koubeiStuCard.stuInfos",
                conditions:{stuNum:[parseInt(req.body.stuNum)]}
            }
            console.log("route stuCard/delCard :",req.body);
            delStu(query, res);
            break;
        default :
            break;
    }

}
// 用于查询数据，包括 学生信息，消费信息
function getStusFromDB(query, res){
    db.getStus(query,function(data){
        console.log("get from db : ",data);
        res.send(data);
        res.end();
    })
}
// 用于新增用户和消费记录
function addNew(query, res){
    db.addStu(query,function(data){
        console.log("get from db : ",data);
        // res.send() 不能直接发送数字类型
        res.send(""+data);
        res.end();
    })
}
// 更改用户信息
function updateInfo(query, res){
    db.updateStuCard(query,function(data){
        console.log("get from db : ",data);
        res.send(""+data);
        res.end();
    })
}
// 删除用户信息
function delStu(query, res){
    db.delInfo(query,function(data){
        console.log("get from db : ",data);
        res.send(""+data);
        res.end();
    })
}

// 生成指定时间格式  2017/09/04 09:45:54
function timeFormate(time){
    return (time.toJSON().substr(0,10)+" "+time.toTimeString().substr(0,8)).replace(/-/g,"/");
}
module.exports = router;
