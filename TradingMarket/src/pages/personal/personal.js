import React from 'react';
import './personal.css';
import sale from '../../images/personal/sale.png';
import buy from '../../images/personal/buy.png';
import publish from "../../images/personal/publish.png";
import password from '../../images/personal/password.png';
import {Title, List,Button,TabBottom} from '../../share';
import mobile from '../../images/personal/mobile.png';
import address from '../../images/personal/address-manage.png';
import {getData, goNext} from '../../utils';
const Item = List.Item;
export default class Personal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info:[
                {leftTitle:"我发布的",leftIcon:[publish],total:0,link:"myPublish"},
                {leftTitle:"我卖出的",leftIcon:[sale],total:0,link:"mySale"},
                {leftTitle:"我买到的",leftIcon:[buy],total:0,link:"myPurchase"},
                {leftTitle:"修改密码",leftIcon:[password],link:"modifyPwd"},
                {leftTitle:"修改手机号",leftIcon:[mobile],link:"verifyOldMobile"},//验证旧手机成功后跳转到绑定新手机
                {leftTitle:"我的收货地址",leftIcon:[address],link:"addressManage"}
            ],//初始化个人中心信息
            sales:0//我卖出的金额初始化为0
        }
    }
    componentDidMount(){
        //获取我发布的，我买到的，我卖出的数量
        this.getProductNum();
    }
    //获取我发布的，我买到的，我卖出的数量
    getProductNum(){
        getData({
            method: 'get',
            url: 'getProductNum',
            successCB: (res) => {
                this.state.info[0].total = res.result.publish.num;
                this.state.info[1].total = res.result.sale.num;
                this.state.info[2].total = res.result.purchase.num;
                this.setState({
                    sales:res.result.sale.money
                })
            }
        })
    }
    //退出登录
    goLogin(){
        getData({
            method: 'post',
            url: 'logout',
            data: {},
            successCB: (res) => {
                //清掉本地缓存
                sessionStorage.removeItem("userInfo");
                sessionStorage.removeItem("token");
                //进入登录页面
                goNext(this, 'login');
            }
        })
    }
   //渲染视图
    render() {
        var user = JSON.parse(sessionStorage.getItem("userInfo"))||{};
        return <div>
            <Title title="个人中心" isHome={true}/>
            <div className="cm-mlr-02">
                <div className="cm-mtb-02 cm-ptb-02 cm-flex cm-ai-c" onClick={() => goNext(this, 'modifyInfo')}>
                    <img src={user.userAvatar} alt="" className="cm-img-16 cm-border-radius-half"/>
                    <div className="cm-ml-02">
                        <div className="cm-c-333 cm-fw-bold cm-fs-028">{user.userName}</div>
                        <div className="cm-c-999 cm-mt-02 cm-fs-022">当前卖出累计金额 <span className="cm-c-main cm-fs-026">￥{this.state.sales}</span>
                        </div>
                    </div>
                </div>
                <div className="cm-space-line"></div>
                {this.state.info.map((item,index)=>{
                    return(
                    <List key={index} onClick={()=>goNext(this,item.link,item)}>
                        <Item
                            leftIcon={item.leftIcon}
                            leftTitle={item.leftTitle}
                            rightTitle={item.total}
                        />
                    </List>
                    )
                })}
                <Button className="cm-mt-080" onClick={()=>this.goLogin()}>安全退出</Button>
                <TabBottom history={this.props.history} activeNum={3}/>
            </div>
        </div>
    }
}