import React from 'react';
import '../personal.css';
import {Title,List,Input,Button} from '../../../share';
import {getData, goNext,checkParam} from '../../../utils';
export default class ModifyInfo extends React.Component {
    constructor(props) {
        super(props);
        //获取本地缓存个人信息
        let user = sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{};
        this.state = {
            userAvatar:[user.userAvatar],//获取用户头像
            userName: user.userName,//获取用户姓名
            address: user.address//获取用户发货地
        }
    }
    componentDidMount(){
        //反显个人头像
       this.uploadImg();
    }
    //反显个人头像
    uploadImg() {
        let user = sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{};
        this.refs.avatar.style.backgroundImage = "url("+user.userAvatar.replace(/\s*/g,"")+")";
        this.refs.avatar.style.backgroundSize = "100%";
        this.refs.avatar.setAttribute("class","personal-again");
    }
    //更新状态
    change(state){
        this.setState(state)
    }
    //修改个人信息
    modify(){
        var arr = [
            {value:this.state.userAvatar,msg:"请选择头像"},
            {value:this.state.userName,msg:"请输入用户名"},
            {value:this.state.address,msg:"请输入收货地址"},
        ];
        //参数非空校验
        checkParam(arr,()=> {
            var token = sessionStorage.getItem("token");
            let param = new FormData(); //创建form对象
            param.append('userAvatar',this.state.userAvatar[0]);//通过append向form对象添加数据
            param.append('userName',this.state.userName);
            param.append('address',this.state.address);
            getData({
                method: 'post',
                url: 'updateUserInfo',
                headers:{
                    'Content-Type':'multipart/form-data',
                    'token':token
                },
                data: param,
                successCB: (res) => {
                    //修改成功之后，替换掉本地缓存的头像和昵称，并进入个人中心页面
                    var user = JSON.parse(sessionStorage.getItem("userInfo"));
                    user.userAvatar = this.state.userAvatar[0];
                    user.userName = this.state.userName;
                    user.address = this.state.address;
                    sessionStorage.setItem("userInfo",JSON.stringify(user));
                    goNext(this,'personal');
                }
            })
        })
    }
    //选择个人头像
    getAvatar(event){
        var files = event.target.files;
        this.setState({
            userAvatar:files
        });
        if(window.FileReader) {
            var file = files[0];
            var fr = new FileReader();
            fr.readAsDataURL(file);  //将图片作为url读出
            fr.onloadend = (e)=> {
                this.refs.avatar.style.backgroundImage  = "url("+e.target.result+")";
                this.refs.avatar.style.backgroundSize = "100%";
            };
        }
        this.refs.avatar.setAttribute("class","personal-again");
    }
    //渲染视图
    render() {
        return<div>
            <Title that={this}  title="编辑个人信息"/>
            <div className="cm-mt-04">
                <div className="personal-input-box" ref="avatar">
                    <input type="file" className="personal-input"  onChange={(e)=>this.getAvatar(e)}/>
                </div>
            </div>
            <div className="cm-m-02 cm-mt-02">
                <List>
                    <Input
                        label="昵称"
                        style = {{textAlign:"right"}}
                        maxLength={16}
                        placeholder="请输入昵称"
                        defaultValue={this.state.userName}
                        onChange={(val)=>this.change({userName:val})}
                        className="cm-c-666"
                    />
                </List>
                <List>
                    <Input
                        label="收货地"
                        style = {{textAlign:"right"}}
                        maxLength={10}
                        placeholder="请输入收货地"
                        defaultValue={this.state.address}
                        onChange={(val)=>this.change({address:val})}
                        className="cm-c-666"
                    />
                </List>
                <Button type="fill" className="cm-mt-080" onClick={() => this.modify()}>确认修改</Button>
            </div>
        </div>
    }
}