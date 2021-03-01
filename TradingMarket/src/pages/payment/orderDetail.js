import React from 'react';
import {Title} from '../../share';
import {goNext,getData,getTimeFormat} from '../../utils';
import Config from '../../envConfig';
import './order.css';
export default class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        //获取从聊天列表页面和商品详情页传过来的参数
        this.item = this.props.history.location.state || {};
        //获取本地缓存的个人信息
        this.user = sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{};
        this.state = {
            orderInfo:{}//初始化订单信息
        }
    }
    //获取订单详情
    componentDidMount(){
        this.getOrderDetail();
    }
    //如果是付款状态，直接调支付接口
    order(status){
        if(status === 1){
            window.location.href = Config.serverUrl+"alipay?orderId="+this.item.orderId+"&token="+this.user.token+"&addressId="+this.state.orderInfo.orderId;
        }
    }
    //取消订单
    close(){
        getData({
            method: 'post',
            url: 'cancelOrder',
            data:{orderId:this.item.orderId||49},
            successCB: (res) => {
                goNext(this,'index');
            }
        })
    }
    //获取订单详情
    getOrderDetail(){
        getData({
            method: 'get',
            url: 'getOrderDetails',
            data:{orderId:this.item.orderId||49},
            successCB: (res) => {
                this.setState({
                    orderInfo: res.result
                })
            }
        })
    }
    //按钮文本
    changeBtnText(status){
        switch (status){
            case 1:
                return "我要付款";
            case 2:
                return "付款中";
            case 3:
                return "已付款";
            case 4:
                return "付款失败";
            default:
                return "付款异常";
        }
    }
    //付款状态
    changeStatus(status){
        switch (status){
            case 1:
                return "待付款";
            case 2:
                return "付款中";
            case 3:
                return "已付款";
            case 4:
                return "付款失败";
            default:
                return "付款异常";
        }
    }
    //渲染视图
    render() {
        var productImgs = this.item.productImgs && this.item.productImgs.split(",");
        if(this.state.orderInfo.expiredTime>0){
            var date = parseInt(this.state.orderInfo.expiredTime/60/60/24);
            var hour = parseInt(this.state.orderInfo.expiredTime/60/60);
            var min = this.state.orderInfo.expiredTime%60;
            if(hour<10){
                hour = "0"+hour;
            }
            if(min<10){
                min = "0"+min;
            }
        }
        return <div className="cm-bc-white">
            <Title title="订单信息"
                   that={this}
                   style={{background:"#fff"}}
                   onLeftClick={()=>goNext(this,"index")}
            />
                <div className="cm-c-999 cm-pt-02 cm-tx-c">
                    <span className="cm-fs-040 cm-fw-bold">{this.state.orderInfo.orderAmount}</span>
                <span>元</span>
                    <div className="cm-fs-024">{this.changeStatus(this.state.orderInfo.payStatus)}</div>
                </div>
            {
                this.state.orderInfo.expiredTime>0? <div className="cm-tx-c cm-mtb-04 cm-fs-024">
                        <span className="cm-c-main">{date}</span>天
                        <span className="cm-c-main">{hour}</span>时
                        <span className="cm-c-main">{min}</span>分后，如果您未付款，订单将自动关闭
                    </div>:null
            }
                <div className="cm-p-02 cm-border-bottom-eee cm-border-top-eee">
                    <div className="cm-mtb-01 cm-fs-024 cm-c-666"><span className="cm-fs-028 cm-c-333 cm-fw-bold">{this.state.orderInfo.consigneeName}</span><span>{this.state.orderInfo.consigneeMobile}</span></div>
                    <div className="cm-fs-024 cm-c-666">{this.state.orderInfo.consigneeAddress}</div>
                </div>
                <div className="cm-flex cm-jc-sb cm-bc-white cm-border-bottom-eee cm-p-02 cm-ai-c">
                    <div className="cm-flex cm-ai-c">
                        {productImgs && productImgs[0]?
                            <img src={productImgs[0]} alt="" className="cm-img-06 cm-mr-02"/>:
                            <div className="cm-img-06 cm-mr-02 cm-c-999 cm-fs-026 cm-border-ddd cm-flex cm-ai-c cm-tx-c">该商品已下架</div>
                        }
                        <div className="cm-c-333 cm-fs-026 cm-fs-ellipsis" style={{width:'220px'}}>{this.state.orderInfo.productDesc||"老家种的橙子，甘甜又可口，快来尝尝吧。"}</div>
                    </div>
                    <div className="cm-c-main">联系卖家</div>
                </div>
            <div>
                <div className="cm-mlr-02 cm-ptb-01 cm-fs-024 cm-c-999 cm-flex cm-jc-sb">
                    <div>买家昵称</div>
                    <div>{this.state.orderInfo.buyerUserName}</div>
                </div>
                <div className="cm-mlr-02 cm-ptb-01 cm-fs-024 cm-c-999 cm-flex cm-jc-sb">
                        <div>订单编号</div>
                        <div>{this.state.orderInfo.orderId}</div>
                </div>
                <div className="cm-mlr-02 cm-ptb-01 cm-fs-024 cm-c-999 cm-flex cm-jc-sb">
                    <div>交易时间</div>
                    <div>{getTimeFormat(this.state.orderInfo.createTime)}</div>
                </div>
            </div>
            <div className="cm-bottom-position detail-bottom-height cm-jc-sb">
                <div className="cm-mr-018 cm-ptb-018 cm-w-full cm-tx-c cm-bc-666 cm-c-white cm-border-radius-10 "
                      onClick={() => this.close()}>关闭交易</div>
                <div className={(this.state.orderInfo.payStatus === 1?"cm-bc-main":"cm-bc-999") +" cm-ptb-018 cm-w-full cm-tx-c cm-c-white cm-border-radius-10 "}
                      onClick={() => this.order(this.state.orderInfo.payStatus)}>{this.changeBtnText(this.state.orderInfo.payStatus)}</div>
            </div>
        </div>
    }
}