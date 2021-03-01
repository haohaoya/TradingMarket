import React from 'react';
import {Title, List, Input,Button,Address} from '../../../share';
import {getData, goNext, checkParam} from '../../../utils';
import {Switch} from 'antd-mobile';
const Item = List.Item;
export default class AddAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:"",//初始化地址编号
            consigneeName: '',//初始化收货人
            consigneeMobile: '',//初始化收货人联系方式
            province:"",//初始化省份
            city:"",//初始化城市
            district:"",//初始化区县
            street:"",//初始化街道
            addressDetail:'',//初始化详细地址
            isDefaultAddress:false,//是否为默认地址
            isShowAddress:false//是否显示地址组件
        };
        //作为编辑地址时其他页面携带过来的参数信息
        this.item = this.props.history.location.state ||{};
        //如果有参数信息携带过来，重新赋值地址信息
        if(this.item.consigneeName){
            this.state.id = this.item.id;
            this.state.consigneeName = this.item.consigneeName;
            this.state.consigneeMobile = this.item.consigneeMobile;
            this.state.province = this.item.province;
            this.state.city = this.item.city;
            this.state.district = this.item.district;
            this.state.street = this.item.street;
            this.state.addressDetail = this.item.addressDetail;
            //地址为1时转义为布尔值true，即默认地址；地址为2时为false。
            this.state.isDefaultAddress = this.item.isDefaultAddress === 1?true:false;
        }
    }
    //改变value值时重置state
    change(state) {
        this.setState(state)
    }
    //调取删除地址接口
    delete(){
        var arr = [
            {value: this.state.id, msg: "没有收货地址编号"}
        ];
        checkParam(arr, () => {
            getData({
                method: 'post',
                url: 'delAddress',
                data: {
                    id:this.state.id,
                },
                successCB: (res) => {
                    goNext(this, 'addressManage')
                }
            })
        })
    }
    //调取更新地址接口
    update(){
        var arr = [
            {value: this.state.id, msg: "没有收货地址编号"},
            {value: this.state.consigneeName, msg: "请输入收货人"},
            {value: this.state.consigneeMobile, msg: "请输入收货人联系方式"},
            {value: this.state.province, msg: "请输入省份"},
            {value: this.state.city, msg: "请输入城市"},
            {value: this.state.district, msg: "请输入县区"},
            {value: this.state.addressDetail, msg: "请输入详细地址"},
        ];
        checkParam(arr, () => {
            getData({
                method: 'post',
                url: 'updateAddress',
                data: {
                    id:this.state.id,
                    consigneeName: this.state.consigneeName,
                    consigneeMobile: this.state.consigneeMobile,
                    province: this.state.province,
                    city: this.state.city,
                    district: this.state.district,
                    street: this.state.street,
                    addressDetail: this.state.addressDetail,
                    isDefaultAddress:this.state.isDefaultAddress?1:2,
                },
                successCB: (res) => {
                    goNext(this, 'addressManage')
                }
            })
        })
    }
    //调取保存地址接口
    save() {
        var arr = [
            {value: this.state.consigneeName, msg: "请输入收货人"},
            {value: this.state.consigneeMobile, msg: "请输入收货人联系方式"},
            {value: this.state.province, msg: "请输入省份"},
            {value: this.state.city, msg: "请输入城市"},
            {value: this.state.district, msg: "请输入县区"},
            {value: this.state.addressDetail, msg: "请输入详细地址"},
        ];
        checkParam(arr, () => {
            var data = {
                consigneeName: this.state.consigneeName,
                consigneeMobile: this.state.consigneeMobile,
                province: this.state.province,
                city: this.state.city,
                district: this.state.district,
                street: this.state.street,
                addressDetail: this.state.addressDetail,
                isDefaultAddress:this.state.isDefaultAddress?1:2,
            }
            getData({
                method: 'post',
                url: 'saveAddress',
                data: data,
                successCB: (res) => {
                    if(this.item.from === "order"){
                        goNext(this, 'order',data)
                    }else {
                        goNext(this, 'addressManage')
                    }

                }
            })
        })
    }
    //显示地址选择弹框
    showAddressModel(){
        this.setState({
            isShowAddress:true
        })
    }
    //关闭地址选择弹框
    closeAddressModel(){
        this.setState({
            isShowAddress:false
        });
    }
    //关闭地址选择弹框，获取地址信息
    getAddress(address){
        this.setState({
            isShowAddress:false,
            province:address.province,
            city:address.city,
            district:address.district,
            street:address.street,
        });
    }
    //渲染视图
    render() {
        return (
            <div>
                <Title that={this} title={this.item.consigneeName?"编辑收货地址":"添加收货地址"}/>
                <div className="cm-mlr-02">
                    <List>
                        <Input
                            placeholder="收货人"
                            defaultValue={this.state.consigneeName}
                            onChange={(val) => this.change({consigneeName: val})}
                            style={{textAlign:'left'}}
                        />
                    </List>
                    <List>
                        <Input
                            type="number"
                            maxLength={11}
                            placeholder="手机号码"
                            defaultValue={this.state.consigneeMobile}
                            onChange={(val) => this.change({consigneeMobile: val})}
                            style={{textAlign:'left'}}
                        />
                    </List>
                    <List onClick={()=>this.showAddressModel()}>
                        <Item
                            leftTitle={
                                this.state.province? <div>
                                       <div>{this.state.province}</div>
                                       <div>{this.state.city}</div>
                                       <div>{this.state.district}</div>
                                       <div>{this.state.street}</div>
                                       </div>
                                : <div className="cm-c-999">所在地区</div>
                            }
                        />
                    </List>
                    <List>
                        <Input
                            type="text"
                            placeholder="详细地址：如建中路88号8层808室"
                            defaultValue={this.state.addressDetail}
                            onChange={(val) => this.change({addressDetail: val})}
                            style={{textAlign:'left'}}
                        />
                    </List>
                    <div className="cm-flex cm-ptb-018 cm-jc-sb">
                        <div>设为默认地址</div>
                        <Switch
                            checked={this.state.isDefaultAddress}
                            onChange={(val) => {
                                this.setState({
                                    isDefaultAddress: val,
                                });
                            }}
                        />
                    </div>
                    {this.item.consigneeName?<div className="cm-flex cm-jc-sb"><Button type="half" className="cm-mt-080" onClick={() => this.update()}>更新</Button>
                            <Button type="half"  className="cm-mt-080" onClick={() => this.delete()}>删除</Button>
                        </div>: <Button type="fill"  className="cm-mt-080" onClick={() => this.save()}>保存</Button>}

                </div>
                {this.state.isShowAddress?<Address
                        closeModel={()=>this.closeAddressModel()}
                        getAddress={(address)=>this.getAddress(address)}
                    />:null}
            </div>)
    }
}
