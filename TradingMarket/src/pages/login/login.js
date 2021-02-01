import React from 'react';
import './login.css';
import account from '../../images/login/account.png';
import password from '../../images/login/password.png';
import defaultAvatar from '../../images/login/avatar.jpg';
import {Title,List,Input,Button} from "../../share";
import {getData,goNext,checkParam} from "../../utils";
import {Toast} from "antd-mobile";
export default class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            account:'',
            password:'',
        }
    }
    change(state){
        this.setState(state);
    }
    //进入注册页面
    goRegister(){
        goNext(this,'register');
    }

    login(){
        var arr=[
            {value:this.state.mobile,msg:" 请输入手机号码 "},
            {value: this.state.password,msg:" 请输入密码 "}
        ]
        checkParam(arr,()=>{
            getData({
                method:'post',
                url:'login',
                data:{
                    mobile:this.state.mobile,
                    password:this.state.password
                },
                successCB:(res)=>{
                    var token = res.result.token;
                    //登录成功之后将个人信息缓存到本地，并进入首页
                    localStorage.setItem("userInfo",JSON.stringify(res.result));
                    localStorage.setItem("token",token);
                    goNext(this,'index');
                }
            })
        })
    }

    render() {
        return (
            <div>
                <Title that={this} title=" 登录 "/>
                <div className="cm-tx-c cm-mt-036">
                    <img src={defaultAvatar} alt="" className="cm-img-16 cm-border-radius-half"/>
                </div>

                <div className="cm-mlr-018 cm-mt-036">
                    <List>
                        <Input
                            src={account}
                            placeholder=" 请输入账号 "
                            value={this.state.mobile}
                            onChange={(val)=>this.change({mobile: val})}
                            style={{textAlign:'left'}}
                        />
                    </List>
                    <List>
                        <Input
                            type="password"
                            src={password}
                            placeholder=" 请输入密码 "
                            value={this.state.password}
                            onChange={(val)=>this.change({password:val})}
                            style={{textAlign:'left'}}
                        />
                    </List>

                    <Button type="fill" className="cm-mt-080" onClick={()=>this.login()}>登录</Button>

                    <div className="cm-tx-c login-operate">
                        <span onClick={()=>this.goRegister()}>快速注册</span>
                        <span>|</span>
                        <span onClick={()=>this.goNext(this,"forgotPwd")}>忘记密码？</span>
                    </div>
                 </div>
            </div>
        )
    }
}