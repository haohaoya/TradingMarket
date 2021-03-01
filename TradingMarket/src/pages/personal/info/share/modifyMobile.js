import React from 'react';
import {List,Input,Button} from '../../../../share';
import {getData,isDefine} from '../../../../utils';
import {Toast} from 'antd-mobile';
import verifyCode from '../../../../images/account/verify-code.png';
//修改手机号组件。在验证旧手机和绑定新手机时用到
export default class ModifyMobile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getCode:' 获取验证码 ',//初始化获取验证码文本
            mobile: props.mobile?props.mobile:"",//验证原手机的时候手机号直接从父组件传递过来
            verifyCode:"",//初始化验证码
        };
        this.type = props.type;
    }
    change(state){
        this.setState(state)
    }
    //验证手机号
    getVerify(){
        if(!isDefine(this.state.mobile)){
            Toast.info("请输入手机号");
            return;
        }

        if(this.state.getCode !== ' 获取验证码 '){
            return ;
        }
        this.setState({
            getCode:60
        },()=>{
            this.timer = setInterval(()=>{
                //验证码过了60秒，消除定时器
                if(this.state.getCode === 1){
                    clearInterval(this.timer);
                    this.setState({
                        getCode:' 获取验证码 '
                    })
                }else {
                    //验证码60秒倒计时
                    this.setState({
                        getCode:--this.state.getCode
                    })
                }
            },1000);
        })
        getData({
            method:'post',
            url:'getVerifyCode',
            data:{
                mobile:this.state.mobile,
                type:this.type //获取验证码类型 type 为4表示绑定新手机，type 为3表示验证原手机
            },
            successCB:(res)=> {
                /** 如果等获取验证码接口成功返回后再回调，会有极大的延迟
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
                    },1000);
                })
                 */
            }
        })
    }
    renderRight(){
        return(
            <div className="cm-flex cm-ai-c"><img src={verifyCode} alt="" className="cm-img-10"/><span className="cm-c-main" onClick={()=>this.getVerify()}> {this.state.getCode === ' 获取验证码 '?' 获取验证码 ':this.state.getCode+"秒重新获取"}</span></div>
        )
    }
    //点击"下一步"或者"完成"的回调
    submit(){
        if(this.props.submit){
            this.props.submit({mobile:this.state.mobile,verifyCode:this.state.verifyCode});
        }
    }
    //渲染页面
    render() {
        var mobile = this.state.mobile;
        if(this.props.type === 3){
            mobile = this.state.mobile.slice(0,3) + "*****"+this.state.mobile.slice(this.state.mobile.length-3,this.state.mobile.length)
        }
        return <div>
                <div className="cm-mlr-02 cm-mt-02">
                    <List>
                        <Input
                            label="手机号"
                            maxLength={11}
                            placeholder="请输入手机号"
                            defaultValue={mobile}
                            onChange={(val)=>this.change({mobile:val})}
                            className="cm-c-999"
                        />
                    </List>
                    <List>
                        <Input
                            label="验证码"
                            placeholder="请输入短信验证码"
                            maxLength={6}
                            defaultValue={this.state.verifyCode}
                            onChange={(val)=>this.change({verifyCode:val})}
                            renderRight = {this.renderRight()}
                        />
                    </List>
                    <Button type="fill" className="cm-mt-080" onClick={() => this.submit()}>{this.props.buttonText}</Button>
                </div>
            </div>
    }
}