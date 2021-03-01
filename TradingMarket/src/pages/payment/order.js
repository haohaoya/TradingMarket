import React from 'react';
import {Title,List} from '../../share';
import {goNext,getData} from '../../utils';
import {Toast} from 'antd-mobile';
import Config from '../../envConfig';
import './order.css';
const Item = List.Item;
export default class Order extends React.Component {
    constructor(props) {
        super(props);
        //获取从聊天列表页面和商品详情页传过来的参数
        this.item = this.props.history.location.state || {};
        this.state = {
            addressInfo:{}//初始化地址信息
        };
        //如果有省份信息，则传过来的参数是地址信息
        if(this.item.province){
            this.state.addressInfo = this.item;
        }
    }
    componentDidMount(){
        //获取地址列表
        this.getAddressList();
    }
    getAddressList(){
        //如果没有地址信息，则调取接口查询地址信息。
        if(!this.state.addressInfo.province){
            getData({
                method: 'post',
                url: 'getAddressList',
                data: {
                    pageNum:1,
                    pageSize:100
                },
                successCB: (res) => {
                    console.log(res);
                    var data = res.result.list;
                    var obj = {};
                    var isDefaultAddress = false;
                    if(data.length > 0){
                        data.forEach(item=>{
                            //如果有默认地址，则取默认地址
                            if(item.isDefaultAddress === 1){
                                isDefaultAddress = true;
                                obj = item;
                            }
                        });
                        //没有默认地址，取第一个地址
                        if(!isDefaultAddress){
                            obj = data[0];
                        }
                        this.setState({
                            addressInfo:obj
                        })
                    }
                }
            })
        }
    }
    //调订单接口和支付接口
    order(){
        if(this.state.addressInfo.id){
            //获取本地缓存的个人信息
            var user = sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{};
            getData({
                method: 'post',
                url: 'placeOrder',
                data: {
                    productId:this.item.productId,
                    addressId:this.state.addressInfo.id
                },
                successCB: (res) => {
                    var orderId = res.result.orderId;
                    window.location.href = Config.serverUrl+"alipay?orderId="+orderId+"&token="+user.token+"&addressId="+this.state.addressInfo.id;
                }
            });
        }else {
            Toast.info("请添加地址", 1);
        }
    }
    //渲染视图
    render() {
        var productImgs = this.item.productImgs && this.item.productImgs.split(",");
        var obj = this.state.addressInfo;
        return <div className="cm-bc-white">
            <Title title="购买商品"
                   that={this}
                   style={{background:"#fff"}}
            />
                <div className="cm-flex cm-jc-sb cm-p-02" onClick={()=>goNext(this,"productDetail",this.item)}>
                    <div className="cm-flex cm-ai-c">
                        {productImgs && productImgs[0]?
                            <img src={productImgs[0]} alt="" className="cm-img-12 cm-mr-02"/>:
                            <div className="cm-img-10 cm-mr-02 cm-c-999 cm-fs-026 cm-border-ddd cm-flex cm-ai-c cm-tx-c">该商品已下架</div>
                        }
                        <div>
                            <div className="cm-c-333 cm-fs-028">{this.item.productDesc}</div>
                            <div className="cm-c-main cm-fs-028  cm-mt-02 cm-fw-bold">￥{this.item.productPrice}</div>
                        </div>
                    </div>
                </div>
                <div className="cm-mt-02 cm-mlr-02 cm-border-top-eee">
                <List border={false}>
                    <Item
                        leftTitle="收货信息"
                        rightTitle={
                            !obj.province?"添加收货地址":
                            <div className="cm-tx-r cm-fs-024"><div><span>{obj.consigneeName}
                            </span><span>{obj.consigneeMobile}</span></div>
                                <div>{obj.province+obj.city+obj.district+(obj.street?obj.street:"")+obj.addressDetail}</div>
                            </div>}
                        onRightClick={()=>{!obj.province?goNext(this,'addAddress',{from:"order"}):goNext(this,'addressManage',{from:"order",id:obj.id})}}
                    />
                </List>
                </div>
                <div className="cm-bottom-position detail-bottom-height cm-jc-sb cm-bc-white">
                    <div className="cm-fs-028  cm-mt-02 cm-fw-bold">付款：<span className="cm-c-main">￥{this.item.productPrice}</span></div>
                    <span className="cm-btn-main-higher cm-fs-100"
                          onClick={() => this.order()}>确 定</span>
                </div>
        </div>
    }
}