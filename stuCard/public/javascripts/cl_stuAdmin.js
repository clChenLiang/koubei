/**
 * Created by dell on 2017-09-03.
 */
DEBUG = false;
$(document).ready(function(){
    var currentPage = {
        getStus:1,
        getConsume:1
    };
    $('.menu .item').tab();
    // 绑定事件
    // 使用父元素监听；学生总览和消费记录
    $("tfoot div").click(function(event){
        DEBUG ? ( console.log("click",event.target.text,event.target.innerText,event)) : null;
        // 可以使用多种方式实现：在按钮btn 中增加 stuinfo  consume class进行区分
        // 此处，出于统一与练习 event.target.parentElement 目的，保存之; 分别表示 i a 标签触发上去
        var temp = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        var action = $(temp).attr('data-tab') || $(temp.parentElement).attr('data-tab');
        action = action === "first" ? "getStus" : "getConsume";
        var conditions = {};
        if(event.target.text){
            // 此处有 ... 在后续过程需要处理
            currentPage[action] = parseInt(event.target.text)||currentPage[action];
        }else{
            // 判断点击的是下一页还是上一页;并确保首页为 1
            event.target.className.indexOf("right") > -1 ? currentPage[action]++ : currentPage[action]--;
            currentPage[action] = currentPage[action] > 0 ? currentPage[action] : 1;
        }
        var formstu = parseInt($($(".searchSpe").parent()[0]).find("select").val());
        // NaN 判断
        if( formstu/1 === formstu){
            conditions = {formStu:[formstu]}
        }


        DEBUG ? ( console.log(currentPage[action])) : null;

        DEBUG ? ( console.log(action)) : null;
        // 暂定每页放5条数据
        getData(action,{pages:currentPage[action],limit:5,conditions:JSON.stringify( conditions )},function(rows){
            $(temp).find("tbody").html( generatTable(rows) );
        });
        //getData("getStus",{pages:currentPage,skip:5},function(a){alert(JSON.stringify(a))});
        // 获取表体，进行更新
        DEBUG ? ( console.log("tbody :",$(temp).find("tbody"))) : null;
    })

    // 使用ajax代替submit 按钮
    $(".ui.button").click(function(e){
        var data = {}
        // 获取表单中提交的数据
        $(event.target.parentElement).serializeArray().map(function(a){data[a.name] = a.value});

        // 判断按钮
        var btn = $(event.target)[0].tabIndex;
        switch (btn){
            // btn -- getStus getConsume addStu  updateStuCard  addStuConsume  delCard
            case 0:// 新增卡
                getData("addStu",data,function(a){
                    DEBUG ? ( console.log("addStu 成功")) : null;
                    alert("添加新用户成功！");
                });
                break;
            case 1:// 添加消费记录
                getData("addStuConsume",data,function(a){
                    DEBUG ? ( console.log("addStuConsume 成功")) : null;
                    alert("添加消费记录成功！");
                });
                break;
            case 2:// 更改信息
                getData("updateStuCard",data,function(a){
                    DEBUG ? ( console.log("updateStuCard 成功")) : null;
                    alert("更新用户信息成功！")
                });
                break;
            case 3:// 删除卡
                getData("delCard",data,function(a){
                    DEBUG ? ( console.log("delCard 成功")) : null;
                    alert("删除用户成功！")
                });
                break;
            default :
                break;
        }
    })
    // 页面初始化，切换
    function initRecord(){
        getData("getStus",{pages:currentPage["getStus"],limit:5,conditions:{}},function(rows){
            DEBUG ? ( console.log("rows; ",rows)) : null;
            $(".tab.active").find("tbody").html( generatTable(rows) );
        });
    }
    initRecord();
    $(".top>a.item").click(function(e){
        DEBUG ? ( console.log(e.target.text)) : null;
        DEBUG ? ( console.log(e.target.dataset.tab)) : null;
        // $(".tab.active") 处于活动状态的tab
        switch ( e.target.dataset.tab ){
            // 使用中文
            case "first"://"学生总览":
                //if(!initRecord["first"]){
                    getData("getStus",{pages:currentPage["getStus"],limit:5,conditions:{}},function(rows){
                        DEBUG ? ( console.log("rows; ",rows)) : null;
                        $(".tab.active").find("tbody").html( generatTable(rows) );
                    });
                //    initRecord["first"] = true;
                //}

                break;
            case "second"://"消费记录":
                //if(!initRecord["second"]){
                    getData("getStus",{wants:"stuNum"},function(rows){
                        rows = [{stuNum:"请选择要查询的学生"}].concat(rows);
                        DEBUG ? ( console.log("rows; ",rows)) : null;
                        $(".tab.active").find("[name='fromStu']").html( generatOpts(rows) );
                    });
                    getData("getConsume",{pages:currentPage["getConsume"],limit:5},function(rows){
                        DEBUG ? ( console.log("rows; ",rows)) : null;
                        $(".tab.active").find("tbody").html( generatTable(rows) );
                    });
                //    initRecord["second"] = true;
                //}

                break;
            case "third"://"新增办卡":
                break;
            case "four"://"模拟消费":

                //if(!initRecord["four"]){
                    getData("getStus",{wants:"stuNum"},function(rows){
                        DEBUG ? ( console.log("rows; ",rows)) : null;
                        // 只需要id
                        $(".tab.active").find("[name='fromStu']").html( generatOpts(rows) );
                    });
                    //initRecord["four"] = true;
                //}

                break;
            case "five"://"修改信息":

                //if(!initRecord["five"]){
                    getData("getStus",{wants:"stuNum"},function(rows){
                        DEBUG ? ( console.log("rows; ",rows)) : null;
                        // 只需要id
                        $(".tab.active").find("[name='stuNum']").html( generatOpts(rows) );
                    });
                //    initRecord["five"] = true;
                //}

                break;
            default :
                break;
        }
    })


    /*function initTab(){
        getData("getStus",{pages:1,limit:5,conditions:{}},function(rows){
            DEBUG ? ( console.log("rows; ",rows)) : null;
            $(".tab.active").find("tbody").html( generatTable(rows) );
        });
        getData("getStus",{wants:"stuNum"},function(rows){
            rows = [{stuNum:"请选择要查询的学生"}].concat(rows);
            DEBUG ? ( console.log("rows; ",rows)) : null;
            $(".tab.active").find("[name='fromStu']").html( generatOpts(rows) );
        });
        getData("getConsume",{pages:1,limit:5},function(rows){
            DEBUG ? ( console.log("rows; ",rows)) : null;
            $(".tab.active").find("tbody").html( generatTable(rows) );
        });
        getData("getStus",{wants:"stuNum"},function(rows){
            DEBUG ? ( console.log("rows; ",rows)) : null;
            // 只需要id
            $(".tab.active").find("[name='fromStu']").html( generatOpts(rows) );
        });
        getData("getStus",{wants:"stuNum"},function(rows){
            DEBUG ? ( console.log("rows; ",rows)) : null;
            $(".tab.active").find("[name='stuNum']").html( generatOpts(rows) );
        });
    }
    initTab();*/

    // 给选项框添加onchange事件
    $("select[name='stuNum']").change(function(e){
        DEBUG ? ( console.log("changed :",this.value)) : null;
        getData("getStus",{ wants:"*",conditions:JSON.stringify({stuNum:[this.value]}) },function(rows){
            DEBUG ? ( console.log("rows; ",rows)) : null;
            // 只需要id
            $(".tab.active").find("[name='name']").val( rows[0].name );
            $(".tab.active").find("[name='grade']").find("option[value="+ rows[0].grade +"]").attr("selected",true);
            $(".tab.active").find("[name='money']").find("option[value="+ rows[0].money +"]").attr("selected",true);
        });
    })

//    增加搜索
    $(".searchSpe").click(function(e){
        DEBUG ? ( console.log()) : null;
        var formstu = $($(this).parent()[0]).find("select").val();
        getData("getConsume",{pages:currentPage["getConsume"],limit:5,conditions:JSON.stringify({fromStu:[ parseInt(formstu) ]})},function(rows){
            DEBUG ? ( console.log("rows; ",rows)) : null;
            $(".tab.active").find("tbody").html( generatTable(rows) );
        });
    })

//    打印下载功能
    $(".printXlsx").click(function(e){
        alert("该 功 能 正 在 研 发");
    })
});

function submitForm(){
    var formData = $('.ui.form input').serializeArray(); //or .serialize();
    $.ajax({
        type: 'POST',
        url: 'ddd.html',
        data: formData
    });
}

// by cl -- date:2017年9月3日
function getData(url,data,callback){
    DEBUG ? ( console.log(data,callback)) : null;
    // @params : url --- getStus  addStu  updateStuCard  addStuConsume
    var data, callback;
    if(typeof data === "function"){
        callback = data;
        data = {}
    }
    if(typeof data === "undefined" || typeof callback === "undefined" ){
        data = {};
        callback = function(){}
    }
    $.ajax({
        "url":"/stuCard/"+url,
        "data": data,
        "type":"POST",
        "dataType":"json",
        "success":callback,
        "error":function(msg){
            alert("与远程服务器连接失败！");
        }
    });
    DEBUG ? ( console.log(data,callback)) : null;
}
// 生成表格的 innerHTML
function generatTable(data){
    var tbody = "", td ;
    for(var i in data){
        td = "";
        for(var j in data[i]){
            td += "<td>"+data[i][j]+"</td>";
        }
        tbody += "<tr>"+td+"</tr>";
    }
    return tbody;
}

//生成选项
function generatOpts(data){
    // @params : data = []
    var opts = "";
    for(var i in data){
        opts += "<option value=" + data[i].stuNum + ">" + data[i].stuNum + "</option>"
    }
    return opts;
}

