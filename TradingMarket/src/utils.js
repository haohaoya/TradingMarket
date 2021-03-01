import axios from "axios";
import Config from './envConfig';
import {Toast} from 'antd-mobile';
//调ajax,获取后端接口数据
export function getData(obj){
    var token = sessionStorage.getItem("token") || "";
    //调接口时页面是否开启loading，参数0便是loading不会自动消失
    if(obj.isShowLoad){
        Toast.loading('加载中...',0);
    }
    //需要传给后端的参数对象
    var options = {
        method: obj.method,
        url: Config.serverUrl+obj.url,
        headers:obj.headers||{
            token:token,
        }
    };
    //如果是get请求，key值为params
    if(obj.method === "get"){
        options.params = obj.data;
    }else{
        //否则key值为data
        options.data = obj.data;
    }
    axios(options).then(function (res) {
        let result = res.data;
        //后端返回999表示未登录或者token过期，需要跳转到登录页面
        if(result.code === 999){
            Toast.info(" 请先登录 ");
            setTimeout(()=>{window.location.href=Config.serverIp+"login";},500);
            return false;
        }
        //如果定义了成功回调，处理逻辑
        if(obj.successCB){
            Toast.hide();
            if(result.code === 0){
                obj.successCB(result);
            }else{
                Toast.fail(result.message);
            }
        }
    }).catch(function (err){
        if(obj.failCB){
            obj.failCB(err);
        }
    });
}

//判断变量是true还是false
export function isDefine(str){
    if(str === null || str === '' || str === undefined){
        return false
    }
    return true;
}
//跳转页面
export function goNext(that,pathname,state){
    if(state || state===0){
        that.props.history.push({pathname:pathname,state:state});
    }else{
        that.props.history.push(pathname);
    }
}

//prompt verify doNext checkParam方法结合 做参数非空校验
export function prompt(value,msg){
    if(typeof  value === "boolean"){
        if(value){
            return true;
        }else{
            Toast.info(msg,1);
            return false;
        }
    }else if(!isDefine(value)){
        Toast.info(msg,1);
        return false;
    }else{
        return true;
    }
}
export function *verify(arr){
    for(var i=0;i<arr.length;i++){
        yield prompt(arr[i].value,arr[i].msg);
    }
    //Generator 函数需要return之后才算真正结束
    return;
}
//通过递归执行分段函数
export function doNext(bool,cb){
    //先执行第一个分段函数
    var x = bool.next();
    if(x.value){
        //当value值为true时（也就是非空时)，再执行下一个分段函数
        doNext(bool,cb);
    }else{
        if(x.done && cb){
            //分段函数执行完毕之后才执行回调。没执行完说明有空，不执行回调
            cb();
        }
    }
}
export function checkParam(arr,cb){
    //Generator 函数需要调用一次才能执行（之后通过next执行）
    var bool = verify(arr);
    doNext(bool,cb);
}
//时间戳2020-02-02 02:02形式
export function getTime(value){
    var d = new Date(value);
    var year = d.getFullYear();
    var month = (d.getMonth()+1);
    var date = d.getDate();
    var hour = d.getHours();
    var min = d.getMinutes();
    if(month<10){
        month = '0' + (d.getMonth()+1);
    }
    if(date<10){
        date = '0' + (d.getDate());
    }
    if(hour<10){
        hour = '0' + (d.getHours());
    }
    if(min<10){
        min = '0' + (d.getMinutes());
    }
    var str = String(year)+'-'+String(month)+'-'+String(date)+' '+String(hour)+':'+String(min);
    return str;
}
//时间戳2020年10月10日 09：20形式
export function getTimeFormat(value){
    var d = new Date(value);
    var year = d.getFullYear();
    var month = (d.getMonth()+1);
    var date = d.getDate();
    var hour = d.getHours();
    var min = d.getMinutes();
    if(month<10){
        month = '0' + (d.getMonth()+1);
    }
    if(date<10){
        date = '0' + (d.getDate());
    }
    if(hour<10){
        hour = '0' + (d.getHours());
    }
    if(min<10){
        min = '0' + (d.getMinutes());
    }
    var str = String(year)+'年'+String(month)+'月'+String(date)+'日 '+String(hour)+':'+String(min);
    return str;
}
//时间戳02：02形式
export function getTimeHour(value){
    var d = new Date(value);
    var hour = d.getHours();
    var min = d.getMinutes();
    if(hour<10){
        hour = '0' + (d.getHours());
    }
    if(min<10){
        min = '0' + (d.getMinutes());
    }
    var str = String(hour)+':'+String(min);
    return str;
}

//textarea多行文本框高度自适应
export function autoTextarea(){
    var textarea = document.getElementsByTagName("textarea");
    for(var i = 0;i<textarea.length;i++){
        textarea[i].style.height = '0.6rem';
        textarea[i].scrollTop = 0;//防止抖动
        textarea[i].style.height = textarea[i].scrollHeight + 'px';
        textarea[i].addEventListener('input',function (e){
            e.target.style.height = '0.6rem';
            e.target.scrollTop =  0;//防止抖动
            if(e.target.scrollHeight<30){
                e.target.style.height = '30px';
            }else{
                e.target.style.height = e.target.scrollHeight+'px';
            }
        });
    }
}












