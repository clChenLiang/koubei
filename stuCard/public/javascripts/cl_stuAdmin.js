/**
 * Created by dell on 2017-09-03.
 */
$(document).ready(function(){
    var currentPage = 1;
    $('.menu .item').tab();
    // 绑定事件
    // 使用父元素监听；学生总览和消费记录
    $("tfoot div").click(function(event){
        console.log("click",event.target.text,event.target.innerText,event);
        if(event.target.text){
            // 此处有 ... 在后续过程需要处理
            currentPage = parseInt(event.target.text)||currentPage;
        }else{
            // 判断点击的是下一页还是上一页;并确保首页为 1
            event.target.className.indexOf("right") > -1 ? currentPage++ : currentPage--;
            currentPage = currentPage > 0 ? currentPage : 1;
        }
        console.log(currentPage);
        // 可以使用多种方式实现：在按钮btn 中增加 stuinfo  consume class进行区分
        // 此处，出于统一与练习 event.target.parentElement 目的，保存之; 分别表示 i a 标签触发上去
        var temp = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        var action = $(temp).attr('data-tab') || $(temp.parentElement).attr('data-tab');
        action = action === "first" ? "getStus" : "getConsume";
        console.log(action);
        // 暂定每页放5条数据
        getData(action,{pages:currentPage,limit:1},function(rows){
            $(temp).find("tbody").html( generatTable(rows) );
        });
        //getData("getStus",{pages:currentPage,skip:5},function(a){alert(JSON.stringify(a))});
        // 获取表体，进行更新
        console.log("tbody :",$(temp).find("tbody"))
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
                getData("addStu",data,function(a){console.log("addStu 成功")});
                break;
            case 1:// 添加消费记录
                getData("addStuConsume",data,function(a){console.log("addStuConsume 成功")});
                break;
            case 2:// 更改信息
                getData("updateStuCard",data,function(a){console.log("updateStuCard 成功")});
                break;
            case 3:// 删除卡
                getData("delCard",data,function(a){console.log("delCard 成功")});
                break;
            default :
                break;
        }
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
        "data":data,
        "type":"POST",
        "dataType":"json",
        "success":callback,
        "error":function(msg){
            alert("与远程服务器连接失败！");
        }
    });
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

