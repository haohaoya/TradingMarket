import React from 'react';
import {Title,List,Input,Button} from '../../../share';
import {getData, goNext,isDefine,checkParam} from '../../../utils';
import {Toast} from 'antd-mobile';
import verifyCode from '../../../images/account/verify-code.png';
export default class ForgotPwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile:"",//初始化手机号
            password:'',//初始化密码
            verifyCode:"",//初始化验证码
            getCode:"获取验证码",//初始化获取验证码文本
            confirmPwd:'',//初始化确认密码
        }
    }
    //更新状态
    change(state){
        this.setState(state)
    }
    //调忘记密码接口
    submit(){
        //非空校验数组对象
        var arr = [
            {value:this.state.mobile,msg:"请输入手机号码"},
            {value:this.state.verifyCode,msg:"请输入验证码"},
            {value:this.state.password,msg:"请输入新密码"},
            {value:this.state.confirmPwd,msg:"请输入确认密码"},
            {value:this.state.password !== this.state.confirmPwd,msg:"密码与确认密码不一致"},
        ];
        checkParam(arr,()=> {
            getData({
                method: 'post',
                url: 'forgotPwd',
                data:{
                    "mobile":this.state.mobile,
                    "verifyCode":this.state.verifyCode,
                    "newPwd":this.state.password,
                    "confirmPwd":this.state.confirmPwd
                },
                successCB: (res) => {
                    //密码重置成功进入登陆页
                    goNext(this,"login")
                }
            })
        })
    }
    //验证手机号
    getVerify(){
        if(!isDefine(this.state.mobile)){
            Toast.info("请输入手机号");
            return;
        }
        getData({
            method:'post',
            url:'getVerifyCode',
            data:{
                mobile:this.state.mobile,
                type:2 //获取验证码类型 type 为2表示忘记密码
            },
            successCB:(res)=> {
                this.setState({
                    getCode:60
                },()=>{
                    this.timer = setInterval(()=>{
                        //验证码过了60秒，消除定时器
                        if(this.state.getCode === 1){
                            clearInterval(this.timer);
                            this.setState({
                                getCode:"获取验证码"
                            })
                        }else {
                            //验证码60秒倒计时
                            this.setState({
                                getCode:--this.state.getCode
                            })
                        }
                    },1000)
                })
            }
        })
    }
    //获取验证码
    renderRight(){
        return(
            <div className="cm-flex cm-ai-c"><img src={verifyCode} alt="" className="cm-img-04"/><span className="cm-c-main" onClick={()=>this.getVerify()}> {this.state.getCode === "获取验证码"?"获取验证码":this.state.getCode+"秒重新获取"}</span></div>
        )
    }
    //渲染视图
    render() {
        return<div>
            <Title  that={this} title="忘记密码"/>
            <div className="cm-mlr-02 cm-mt-02">
                <List>
                    <Input
                        label="手机号"
                        maxLength={11}
                        placeholder="请输入手机号"
                        defaultValue={this.state.mobile}
                        onChange={(val)=>this.change({mobile:val})}
                        className="cm-c-999"
                    />
                </List>
                <List>
                    <Input
                        label="验证码"
                        placeholder="请输入短信验证码"
                        defaultValue={this.state.verifyCode}
                        onChange={(val)=>this.change({verifyCode:val})}
                        renderRight = {this.renderRight()}
                    />
                </List>
                <List>
                    <Input
                        label="新密码"
                        type="password"
                        placeholder="请输入新密码"
                        onChange={(val)=>this.change({password:val})}
                        maxLength={16}
                    />
                </List>
                <List>
                    <Input
                        label="确认密码"
                        type="password"
                        placeholder="请输入确认密码"
                        value={this.state.confirmPwd}
                        onChange={(val)=>this.change({confirmPwd:val})}
                        maxLength={16}
                    />
                </List>
                <Button type="fill" className="cm-mt-080" onClick={() => this.submit()}>完成</Button>
            </div>
        </div>
    }
}