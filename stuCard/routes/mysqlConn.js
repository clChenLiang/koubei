/*说明*/
/*
 *
 * */
var mysql = require("mysql");

var pool = mysql.createPool({
    host:"localhost",
    user:"root",
    // 上传的时候，隐藏密码与库
    password:"clchenliang520",
    connectionLimit:30,
    datebase:"koubeiStuCard",
    charset:"utf8_bin"
});



// done;
var searchResults = function(search,callback){
    // select * from stuInfos limit 0,1;   pages , limit
    var results_back =[] ;
    var sql = generateSql_search(search);
    console.log(sql.sql,sql.sqlData);
    pool.getConnection(function(err,conn){
        conn.query(sql.sql,sql.sqlData,function(err,results,field){
            if(err || !results.length){
                console.log(err ?err:"无结果");
                //callback(false);
            }else{
                for(var s in results){results_back.push(results[s])};
            }
            callback( results_back );
            conn.release();
        })
    });
}
var addNew = function(search,callback){
    pool.getConnection(function(err, conn){
        var sql=generateSql_insert(search);
        console.log(sql);
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

var updateStu = function(search, callback){
    pool.getConnection(function(err, conn){
        var sql=generateSql_update(search);
        console.log(sql);
        conn.query(sql.sql,sql.sqlData,function(err,results,field){
            if(err){
                console.log("error when conn_query : "+err);
                callback(false+err);
            }else if(!results){
                console.log("返回结果为空");
                callback(false);
            }else{
                callback(results.affectedRows);
            }
            conn.release();
        })
    })
}
// testing
var delInfo = function(search, callback){
    pool.getConnection(function(err, conn){
        var sql=generateSql_delete(search);
        console.log(sql);
        conn.query(sql.sql,sql.sqlData,function(err,results,field){
            if(err){
                console.log("error when conn_query : "+err);
                callback(false+err);
            }else if(!results){
                console.log("返回结果为空");
                callback(false);
            }else{
                callback(results);
            }
            conn.release();
        })
    })
}


// 用于生成数据库插入语句
var generateSql_insert = function(search){
    //var sql = "insert into " + search.table +" set ? ", sql_d= search.conditions;
    ////insert into nb77.cars set ?
    return {sql:"insert into " + search.table +" set ? ",sqlData:search.conditions}
}
// 用于生成数据库更新语句
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
// 用于生成数据库查询语句
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
    search.pages?(sql+=" limit "+search.pages.limit+" offset "+search.pages.offset*search.pages.limit):null;
    return {sql:sql,sqlData:sql_d}
}
// 用于生成数据库删除语句
var generateSql_delete = function(search){
    var sql = "delete from " + search.table + " ",sql_d = [],sql_temp = "";
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
    sql += sql_temp ? ("where"+sql_temp.substring(4,sql_temp.length-1)):"";
    return {sql:sql, sqlData:sql_d}
}

// 获取所有学生列表,以及消费记录
module.exports.getStus = searchResults;
// 添加学生信息,以及模拟的消费记录
module.exports.addStu = addNew;
// 更改学生信息
module.exports.updateStuCard = updateStu;
// 添加消费信息,会更改卡内余额库
//module.exports.addStuConsume = insertCars;
//删除用户信息
module.exports.delInfo = delInfo;

