import React from 'react';
import {Title} from '../../../share';
import {getData, goNext} from '../../../utils';

export default class AddressManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addressList:[]//初始化地址列表
        };
        //从订单页面进来获取页面来源信息。this.item为{from:order}
        this.item = this.props.history.location.state ||{};
    }
    componentDidMount(){
        //获取地址列表信息
        this.getAddressList();
    }
    //获取地址列表信息
    getAddressList(){
        getData({
            method: 'post',
            url: 'getAddressList',
            data: {
                pageNum:1,
                pageSize:100
            },
            successCB: (res) => {
                console.log(res);
                this.setState({
                    addressList:res.result.list
                })
            }
        })
    }
    //如果从订单页面进来，点击列表返回到订单页面
    goPage(item){
        if(this.item.from === "order"){
            goNext(this,'order',item);
        }
    }
    //渲染视图
    render() {
        return <div>
            <Title title="我的收货地址" that={this} rightTitle="添加" onRightClick={()=>goNext(this,'addAddress')}/>
                {this.state.addressList.length>0?this.state.addressList.map((item,index)=>{
                    var street = item.street?item.street:"";
                        return(
                            <div className={this.item.id === item.id?"cm-flex cm-ai-c cm-bc-white":"cm-flex cm-ai-c"}
                                 key={index} onClick={()=>this.goPage(item)}>
                                <div className="cm-flex cm-ai-c cm-jc-sb cm-flex-1 cm-border-bottom-ddd cm-p-02">
                                    <div className="cm-flex-1 cm-mr-02">
                                        <div className="cm-c-333 cm-fs-028 cm-fw-bold"><span>{item.consigneeName}
                                        </span><span className="cm-c-666 cm-fs-026"> {item.consigneeMobile}</span></div>
                                        <div className="cm-c-999 cm-fs-026 cm-mt-01">{item.isDefaultAddress === 1?<span className="cm-p-006 cm-c-white" style={{background:"pink",marginRight:"0.1rem"}}>默认</span>:""}<span>{item.province+item.city+item.district+street+item.addressDetail}</span></div>
                                    </div>
                                    <div className="cm-btn-border-333" onClick={(e)=>
                                    {e.stopPropagation();goNext(this,'addAddress',item)}}
                                    >编辑</div>
                                </div>
                            </div>
                        )
                    }):<div className="cm-tx-c cm-p-02 cm-border-bottom-ddd cm-c-666" onClick={()=>goNext(this,'addAddress')}>添加地址</div>}
        </div>
    }
}