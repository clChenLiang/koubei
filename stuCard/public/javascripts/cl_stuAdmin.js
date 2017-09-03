/**
 * Created by dell on 2017-09-03.
 */
$(document).ready(function(){

    $('.ui.form').form({
            userName: {
                identifier : 'userName',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Please enter a username'
                    }
                ]
            },
            password: {
                identifier : 'password',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Please enter a password'
                    },
                    {
                        type   : 'length[6]',
                        prompt : 'Your password must be at least 6 characters'
                    }
                ]
            }
        },
        {
            inline : true,
            on     : 'blur',
            onSuccess: submitForm
        }
    );

    $('.ui.form').submit(function(e){
        return false;
    });
    //checkbox init
    $('.ui.checkbox').checkbox();
    $('.menu .item').tab();
});

function submitForm(){
    var formData = $('.ui.form input').serializeArray(); //or .serialize();
    $.ajax({
        type: 'POST',
        url: 'ddd.html',
        data: formData
    });
}

// by cl
function getData(url,data,callback){
    // @params : url --- getStus  addStu  updateStuCard  addStuConsume
    var data, callback;
    if(typeof data === "function"){
        callback = data,
            data = {}
    }
    if(typeof data === "undefined" || typeof callback === "undefined" ){
        data = {},
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

getData("getStus",{a:12,b:23},function(a){console.log(a)});