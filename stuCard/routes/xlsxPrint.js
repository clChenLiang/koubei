// 参考 http://blog.csdn.net/shidaping/article/details/53422736
var xlsx = require("node-xlsx");
var fs = require("fs");


function generateXlsx(data, url){


    var buffer = xlsx.build( transDataToXlsxData(data) );
    fs.writeFile('./resut.xlsx', buffer, function(err) {
        if (err) throw err;
        console.log('has finished');
    });
}

// 将数组转换成 xlsx 模块用的数据
function transDataToXlsxData(data){
    var sheet = {
        name:'校园卡消费统计',
        data:[]
    }
    // 生成表头
    var head = [];
    for(var i in data[0]){
        head.push(i);
    }
    sheet.data.push(head);
    for(var i in data){
        var row = [];
        for(var j in data[i]){
            row.push(data[i][j]);
        }
        sheet.data.push( row );
    }
    return sheet;
}




exports.generateXlsx = generateXlsx;
//test data
var data = [ { fromStu: 1811082659,
    type: '消费',
    count: 5.6,
    place: '东区二餐二楼',
    time: '2017/09/04 09:58:07' },
    { fromStu: 1811082659,
        type: '消费',
        count: 5.6,
        place: '东区二餐二楼',
        time: '2017/09/04 09:59:16' },
    { fromStu: 1811082659,
        type: '消费',
        count: 5.6,
        place: '东区二餐二楼',
        time: '2017/09/04 10:01:57' },
    { fromStu: 1811082659,
        type: '消费',
        count: 5.6,
        place: '东区二餐二楼',
        time: '2017/09/04 10:12:08' },
    { fromStu: 1811082659,
        type: '消费',
        count: 5.6,
        place: '东区二餐二楼',
        time: '2017/09/04 10:14:39' } ];