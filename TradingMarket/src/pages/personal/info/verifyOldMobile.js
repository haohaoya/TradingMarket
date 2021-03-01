import React from 'react';
import {Title} from '../../../share';
import {getData, goNext,checkParam} from '../../../utils';
import ModifyMobile from './share/modifyMobile';
export default class VerifyNewMobile extends React.Component {
    //验证原手机
    modify(opt){
        var mobile = opt.mobile;
        var arr = [
            {value:mobile,msg:"请输入手机号"},
            {value:opt.verifyCode,msg:"请输入验证码"},
        ];
        //参数非空校验
        checkParam(arr,()=> {
            var param = {
                mobile:opt.mobile,
                verifyCode:opt.verifyCode
            };
            getData({
                method: 'post',
                url: 'verifyOldMobile',
                data: param,
                successCB: (res) => {
                    //原手机号验证成功之后清除验证码的定时器，进入绑定新手机页面
                    clearInterval(this.timer);
                    goNext(this,"bindNewMobile");
                }
            })
        })
    }
    render() {
        var user = sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{};
        var mobile = user.mobile;
        return(
            <div>
                <Title that={this} title="验证原手机"/>
                <ModifyMobile
                 mobile = {mobile}
                 buttonText = "下一步"
                 submit = {(opt)=>this.modify(opt)}
                 type = {3}
               />
            </div>
        )
    }
}