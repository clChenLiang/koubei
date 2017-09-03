/*说明*/
/*
 *
 * */
var mysql = require("mysql");

var pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"clchenliang520",
    connectionLimit:30,

});

var generateSql_search = function(/*action,*/search){
    var sql = "select " + search.wants +" from "+ search.table + " ",sql_d = [],sql_temp = "";
    for(var condi in search.conditions){
        if(search.conditions[condi].length == 1){
            sql_temp += " and " + condi + " = ? "
            sql_d.push(search.conditions[condi][0])
        }else if(search.conditions[condi].length == 2){
            sql_temp += " and " + condi + " between ? and ? "
            sql_d.push(search.conditions[condi][0]);
            sql_d.push(search.conditions[condi][1]);
        }
    }

    sql += sql_temp? ("where"+sql_temp.substring(4,sql_temp.length-1)):"";//截取掉 sql_temp 的前后，使之无误插入 sql 语句中来
    search.pages?(sql+=" limit "+search.pages.limit+" offset "+search.pages.offset):null;
    return {sql:sql,sqlData:sql_d}
}


var searchResults = function(search,callback){
    var results_back =[] ;
    var sql = generateSql_search(search);
    console.log(sql.sql,sql.sqlData);
    pool.getConnection(function(err,conn){
        conn.query(sql.sql,sql.sqlData,function(err,results,field){
            if(err || !results.length){
                console.log(err ?err:"无结果");
                callback(false);
            }else{
                for(var s in results){results_back.push(results[s])};
            }
            conn.release();
            callback( results_back);
        })
    });
}



var generateSql_update = function(search){

    var sql = "update " + search.table +" ",sql_d = [],sql_temp = "",sql_where="";
    for(var s in search.wants){
        sql_temp += s +"=? , ";
        sql_d.push(search.wants[s]);
    }
    for(var s in search.conditions){
        sql_where += " and " + s +"=? ,";
        sql_d.push(search.conditions[s]);
    }
    sql += sql_temp? (" set "+sql_temp.substring(0,sql_temp.length-2)):"";//截取掉 sql_temp 的前后，使之无误插入 sql 语句中来
    sql += sql_where?( "where "+sql_where.substring(4,sql_where.length-1)):"";
    return {sql:sql,sqlData:sql_d}
}


var updateCars = function(search,callback){
    var results_back = [];
    pool.getConnection(function(err,conn){

        var sql = generateSql_update(search);
        console.log("sql:"+sql.sql+" sql_d: "+sql.sqlData);
        conn.query(sql.sql,sql.sqlData,function(err,results,field){
            if(err){
                console.log("error when conn_query : "+err);
                callback(false);
            }/*else if(!results){
             console.log("返回结果为空");
             }*/else{
                //for(var s in results){ results_back.push(results[s]) };//此处应该返回成功执行与否
                //callback(true);
                callback(results.feild)
            }
            conn.release();
            //callback(results_back)
            //return 应该放在这里
        });
        console.log("结果："+results_back);
        //return results_back;//到时需要验证
    })
}


var generateSql_insert = function(search){
    //var sql = "insert into " + search.table +" set ? ", sql_d= search.conditions;
    ////insert into nb77.cars set ?
    return {sql:"insert into " + search.table +" set ? ",sqlData:search.conditions}
}


var insertCars = function(search,callback){
    var searchTemp = {
        action:"insert",
        table:'nb77.cars',
        conditions:search
    }
    pool.getConnection(function(err,conn){
        var sql=generateSql_insert(searchTemp);
        conn.query(sql.sql,sql.sqlData,function(err,results,field){
            if(err){
                console.log("error when conn_query : "+err);
                callback(false+err);
            }else if(!results){
                console.log("返回结果为空");
                callback(false);
            }else{
                callback(results.insertId);
            }
            conn.release();
        })
    })
}


var showTable = function(){
    pool.getConnection(function(err,conn){
        if(err){
            console.log("error -----when from mysqlTest:11 ------\n"+err);
        }else{
            console.log("right ");
            conn.query("select * from nb77.cars",function(err,results,field){
                if(err || !results.length){console.log("error in the conn "+err+results)}
                else{
                    console.log(" results :");
                    for(var s in results){console.log(results[s])};
                }
            })
        }
        conn.release();
    })
}
// 获取所有学生列表
module.exports.getStus = searchResults;
// 添加学生信息
module.exports.addStu = insertCars;
// 更改学生信息
module.exports.updateStuCard = insertCars;
// 添加消费信息,会更改卡内余额库
module.exports.addStuConsume = insertCars;
