import React from 'react';
import {Title} from '../../../share';
import {getData, goNext,checkParam} from '../../../utils';
import ModifyMobile from './share/modifyMobile';
export default class BindNewMobile extends React.Component {
    //绑定新手机号
    submit(opt){
        var arr = [
            {value:opt.mobile,msg:"请输入新手机号"},
            {value:opt.verifyCode,msg:"请输入验证码"},
        ]
        checkParam(arr,()=> {
            var param = {
                mobile:opt.mobile,
                verifyCode:opt.verifyCode
            };
            getData({
                method: 'post',
                url: 'bindNewMobile',
                data: param,
                successCB: (res) => {
                    //绑定成功之后清除验证码的定时器，将个人信息重新缓存一份，进入个人中心页面
                    clearInterval(this.timer);
                    var user = JSON.parse(sessionStorage.getItem("userInfo"));
                    user.mobile = opt.mobile;
                    sessionStorage.setItem("userInfo",JSON.stringify(user));
                    goNext(this,"personal")
                }
            })
        })
    }
    //渲染视图
    render() {
        return(
            <div>
                <Title  that={this} title="绑定新手机"/>
                <ModifyMobile
                    buttonText = "完成"
                    submit = {(opt)=>this.submit(opt)}
                    type = {4}
                />
        </div>)
    }
}