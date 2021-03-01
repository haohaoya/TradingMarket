import React from 'react';
import './register.css';
import {Title,List,Input,Button} from '../../../share';
import {getData,goNext,isDefine,checkParam} from '../../../utils';
import {Toast} from 'antd-mobile';
import verifyCode from '../../../images/account/verify-code.png';

export default class Register  extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userAvatar:[],
            getCode:' 获取验证码 ',
            userName:'',
            mobile:'',
            verifyCode:"",
            password:'',
            confirmPwd:''
        }
    }

    change(state){
        this.setState(state)
    }

    getVerify(){
        if(!isDefine(this.state.mobile)){
            Toast.info("请输入手机号码");
            return ;
        }
        if(this.state.getCode !== ' 获取验证码 '){
            return ;
        }

        this.setState({getCode:60},()=>{
            this.timer = setInterval(()=>{

                if(this.state.getCode == 1){
                    //验证码过60秒，消除定时器
                    clearInterval(this.timer);
                    this.setState({
                        getCode:' 获取验证码 '
                    })
                }else{
                    //验证码倒计时
                    this.setState({
                        getCode:--this.state.getCode
                    })
                }

            },1000);
        });

        getData({
            method:'post',
            url:'getVerifyCode',
            data:{
                mobile:this.state.mobile,
                type:1
            },
            successCB:(res)=>{
                //获取了验证码后，把“获取验证码”更改为倒计时数字60，并设置回调函数计时
                /** 如果等获取验证码接口成功返回后再回调，会有极大的延迟
                this.setState({getCode:60},()=>{
                    this.timer = setInterval(()=>{

                        if(this.state.getCode == 1){
                            //验证码过60秒，消除定时器
                            clearInterval(this.timer);
                            this.setState({
                                getCode:' 获取验证码 '
                            })
                        }else{
                            //验证码倒计时
                            this.setState({
                                getCode:--this.state.getCode
                            })
                        }

                    },1000);
                });
                */

            }

        });
    }

    renderRight(){
        return(
            <div className="cm-flex cm-ai-c">
                <img src={verifyCode} alt="" className="cm-img-10"/>
                <span className="cm-c-main" onClick={()=>this.getVerify()}>
                    {this.state.getCode==" 获取验证码 "?" 获取验证码 ":this.state.getCode+" 秒后重新获取 "}
                </span>
            </div>
        )
    }

    register(){
        //准备参数数组 判断参数是否为空
        var arr = [
            {value:this.state.userAvatar,msg:" 请选择头像 "},
            {value:this.state.userName,msg:" 请输入昵称 "},
            {value:this.state.mobile,msg:" 请输入手机号码 "},
            {value:this.state.verifyCode,msg:" 请输入验证码 "},
            {value:this.state.password,msg:" 请输入密码 "},
            {value:this.state.confirmPwd,msg:" 请输入确认密码 "},
            {value:this.state.password == this.state.confirmPwd,msg:" 密码与确认密码不一致 "}
        ];
        checkParam(arr,()=>{
            //创建form对象，通过append向form对象添加数据
            let params = new FormData();
            params.append('userAvatar',this.state.userAvatar[0]);
            params.append('userName',this.state.userName);
            params.append('mobile',this.state.mobile);
            params.append('verifyCode',this.state.verifyCode);
            params.append('password',this.state.password);
            params.append('confirmPwd',this.state.confirmPwd);

            getData({
                method:'post',
                url:'register',
                data:params,
                successCB:(res) => {
                    //注册成功后调用登录接口
                    getData({
                        method:'post',
                        url:'login',
                        data:{
                            mobile:this.state.mobile,
                            password:this.state.password
                        },
                        successCB:(res)=>{
                            //登录成功后，将个人信息缓存至本地
                            localStorage.setItem("userInfo",JSON.stringify(res.result));
                            localStorage.setItem("token",res.result.token);
                            //进入首页
                            goNext(this,'index');
                        }
                    })

                }
            })

        })
    }


    //获取头像
    getAvatar(event){
        var files = event.target.files;
        this.setState({
            userAvatar:files
        });
        if(window.FileReader){
            var file = files[0];
            var fr = new FileReader();
            fr.onloadend = (e)=>{
                this.refs.avatar.style.backgroundImage = "url("+e.target.result+")";
                this.refs.avatar.style.backgroundRepeat = "no";
                this.refs.avatar.style.backgroundSize = "100%";
            };
            //将图片作为url读出
            fr.readAsDataURL(file);
        }
        //添加完头像后将伪元素:before 和:after 去掉，也就是图片中的+去掉
        this.refs.avatar.setAttribute("class","register-again");
    }


    render() {
        return <div>
            <Title that={this} title=" 注册 "/>

            <div className="cm-mt-036 register-relative">
                <div className="register-input-box" ref="avatar">
                    <input type="file" className="register-input" onChange={(e)=>this.getAvatar(e)}/>
                </div>
            </div>

            <div className="cm-mlr-018 cm-mt-036">
                <List>
                    <Input
                        placeholder=" 请输入昵称 "
                        value={this.state.userName}
                        onChange={(val)=>this.change({userName: val})}
                        maxLength={16}
                    />
                </List>

                <List>
                    <Input
                        placeholder=" 请输入手机号码 "
                        value={this.state.mobile}
                        onChange={(val)=>this.change({mobile: val})}
                        maxLength={11}
                    />
                </List>

                <List>
                    <Input
                        placeholder=" 请输入验证码 "
                        value={this.state.verifyCode}
                        onChange={(val)=>this.change({verifyCode: val})}
                        renderRight = {this.renderRight()}
                        maxLength={6}
                    />
                </List>

                <List>
                    <Input
                        type="password"
                        placeholder=" 请输入密码 "
                        value={this.state.password}
                        onChange={(val)=>this.change({password: val})}
                        maxLength={16}
                    />
                </List>

                <List>
                    <Input
                        type="password"
                        placeholder=" 请输入确认密码 "
                        value={this.state.confirmPwd}
                        onChange={(val)=>this.change({confirmPwd: val})}
                        maxLength={16}
                    />
               </List>

                <Button type="fill" className="cm-mt-080" onClick={()=>this.register()}>注册</Button>

                <div className="cm-tx-r login-operate" onClick={()=>goNext(this,"login")}>
                    已有账户？登录
                </div>

            </div>

        </div>
    }

}