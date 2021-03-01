import React from 'react';
import {Title,List,Input,Button} from '../../../share';
import {getData, goNext,checkParam} from '../../../utils';
import {Toast} from 'antd-mobile';
export default class ModifyPwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password:'',//初始化密码
            newPassword:"",//初始化新密码
            confirmPwd:'',//初始化确认密码
        }
    }
    //更新状态
    change(state){
        this.setState(state)
    }
    //确认修改
    submit(){
        var arr = [
            {value:this.state.password,msg:"请输入旧密码"},
            {value:this.state.newPassword,msg:"请输入新密码"},
            {value:this.state.confirmPwd,msg:"请输入确认密码"},
            {value:this.state.newPassword !== this.state.confirmPwd,msg:"密码与确认密码不一致"},
        ];
        //非空校验
        checkParam(arr,()=> {
            getData({
                method: 'post',
                url: 'updatePwd',
                data:{
                    "oldPwd":this.state.password,
                    "newPwd":this.state.newPassword,
                    "confirmPwd":this.state.confirmPwd
                },
                successCB: (res) => {
                    Toast.success(res.message);
                    goNext(this,"personal")
                }
            })
        })
    }
    //渲染视图
    render() {
        return<div>
            <Title  that={this} title="修改密码"/>
            <div className="cm-mlr-02 cm-mt-02">
                <List>
                    <Input
                        type="password"
                        placeholder="请输入旧密码"
                        onChange={(val)=>this.change({password:val})}
                        maxLength={16}
                    />
                </List>
                <List>
                    <Input
                        type="password"
                        placeholder="请输入新密码"
                        onChange={(val)=>this.change({newPassword:val})}
                        maxLength={16}
                    />
                </List>
                <List>
                    <Input
                        type="password"
                        placeholder="请输入确认密码"
                        value={this.state.confirmPwd}
                        onChange={(val)=>this.change({confirmPwd:val})}
                        maxLength={16}
                    />
                </List>
                <Button type="fill" className="cm-mt-080" onClick={() => this.submit()}>确认</Button>
            </div>
        </div>
    }
}