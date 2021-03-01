import React from 'react';
import {ImagePicker} from "antd-mobile";
import './publish.css';
import {Select,Title,List,Input,Button,TabBottom} from "../../../share";
import {getData,goNext,checkParam,isDefine} from "../../../utils";
import {Toast} from 'antd-mobile';
export default class Publish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productImgs:[],
            typeList:[{name:"衣服",id:2},{name:"数码",id:3}],
            productTypeId:'',
            productPrice:'',
            productDesc:'',
            productAddress:''
        };//获取从我发布的商品列表页传过来的参数，并分别赋值。
        this.item = this.props.history.location.state ||{};
        if(this.item.id && this.item.productDesc){
            this.state.productId = this.item.id;
            this.state.productDesc = this.item.productDesc;
            this.state.productPrice = this.item.productPrice;
            this.state.productAddress = this.item.productAddress;
            this.state.productTypeId = this.item.productTypeId;
            this.state.productTypeName = this.item.productTypeName;
            this.state.productImgs = [];
            var list = this.item.productImgs.split(',');
            list.forEach(item=>{
                this.state.productImgs.push({url:item});
            })
        }
    }

    componentDidMount() {
        //检查登录状态，如果未登录，在getData方法中统一处理未登录，进入登录页面
        getData({
            method:'post',
            url:'checkLoginValid',
        });
        this.getTypeList();
    }

    //首页获取了商品类型列表并将其放入缓存，这里直接读取缓存
    getTypeList(){
        if(isDefine(localStorage.getItem("typeList"))){
            this.setState({
                typeList:JSON.parse(localStorage.getItem("typeList"))
            });
        }else {
            getData({
                method: 'get',
                url: 'getProductTypeList',
                successCB: (res) => {
                    sessionStorage.setItem("typeList",JSON.stringify(res.result));
                    let typeList = this.state.typeList.concat(res.result);
                    this.setState({
                        typeList: typeList
                    })
                }
            })
        }
    }

    submit(flag){
        var arr = [
            {value:(this.state.productDesc.length>9||this.state.productDesc.length<300),msg:" 商品输入描述请输入10~300个字符 "},
            {value:(this.state.productDesc),msg:" 请输入商品描述 "},
            {value:(this.state.productImgs),msg:" 请添加图片 "},
            {value:(this.state.productPrice),msg:" 请输入商品价格 "},
            {value: this.state.productAddress, msg: "请输入发货地"},
            {value:(this.state.productTypeId),msg:" 请选择分类 "}
        ];
        checkParam(arr,()=>{
            var token = sessionStorage.getItem("token");
            let param = new FormData();//创建form对象，通过append像对象添加数据
            var oldImgs = [];//之前反显的图片，用于商品更新接口
            for(var i = 0;i<this.state.productImgs.length;i++){
                if(!this.state.productImgs[i].file && this.state.productImgs[i].url){
                    oldImgs.push(this.state.productImgs[i].url);
                }
                if(this.state.productImgs[i].file){
                    param.append('productImgs',this.state.productImgs[i].file);//通过append向form对象添加数据
                }
            }
            param.append('productId',this.state.productId);
            param.append('oldImgs',oldImgs);
            param.append('productDesc',this.state.productDesc);
            param.append('productPrice',this.state.productPrice);
            param.append('productTypeId',this.state.productTypeId);
            param.append('productAddress',this.state.productAddress);

            if(flag === 'submit'){
                getData({
                    method: 'post',
                    url: 'publishProduct',
                    headers:{
                        'Content-Type':'multipart/form-data',
                        'token':token
                    },
                    data: param,
                    successCB: () => {
                        //商品发布成功进入首页
                        Toast.success("发布成功");
                        goNext(this,"index");
                    }
                })
            }else {
                param.append('productId',this.state.productId);
                getData({
                    method: 'post',
                    url: 'updateProduct',
                    headers:{
                        'Content-Type':'multipart/form-data',
                        'token':token
                    },
                    data: param,
                    successCB: (res) => {
                        goNext(this,"index");
                    }
                })
            }

        })
    }

    change(state){
        this.setState(state)
    }

    //金额正则校验
    changePrice(val,event){
        //将除了 数字和. 之外的所有字符替换为空串。
        event.target.value = event.target.value.replace(/[^\d.]/g,"");

        //将连续出现俩次或俩次以上的 . 都替换为一个 .
        event.target.value = event.target.value.replace(/\.{2,}/g,".");

        //将第一个 . 用特殊符号替换，其他 . 都替换为空。再将特殊符号替换回来为 .
        //这样就保留了整串字符的第一个 .
        event.target.value = event.target.value.replace(".","###").replace(/\./g,"").replace("###",".");

        //只保留俩个小数
        event.target.value = event.target.value.replace(/^(\d+)\.(\d\d).*$/,'$1.$2');

        //没输入小数点之前，不能有俩个0在最开始出现
        if(event.target.value.indexOf(".")<0 && event.target.value !== ""){
            event.target.value = parseFloat(event.target.value);
        }

        //通过 setState 改变金额
        this.setState({
            productPrice:event.target.value
        });
    }

    render() {
        const { productImgs } = this.state;
        return (
            <div>
                <Title isHome={true} title=" 商品发布 "/>

                <div className="cm-mlr-018 cm-mtb-018">
                    <textarea name="" id="" cols="30"
                              onChange={(e)=>this.change({productDesc: e.target.value})}
                              maxLength="300"
                              defaultValue={this.state.productDesc}
                              className="cm-w-full cm-fs-026 cm-border-ddd cm-p-018 publish-textarea"
                              rows="10"
                              placeholder=" 描述和介绍您的商品 "
                    />
                    <ImagePicker
                        files={productImgs}
                        onChange={(imgs)=>this.change({productImgs:imgs})}
                        onImageClick={(index, fs) => console.log(index, fs)}
                        selectable={productImgs.length<9}
                    />
                </div>

                <div className="cm-mlr-018">
                    <List>
                        <Input
                            label=" 价格 "
                            style={{textAlign:"right"}}
                            placeholder=" 请输入商品价格 "
                            defaultValue={this.state.productPrice}
                            onChange={(val,event)=>this.changePrice(val,event)}
                            maxLength={11}
                        />
                    </List>
                    <List>
                        <Input
                            label="发货地"
                            style = {{textAlign:"right"}}
                            placeholder="请输入发货地,如:陕西省西安市"
                            defaultValue={this.state.productAddress}
                            onChange={(val)=>this.change({productAddress:val})}
                            maxLength={10}
                        />
                    </List>
                    <List>
                        <Select
                            options={this.state.typeList}
                            babel=" 分类 "
                            onChange={(item)=>this.change({productTypeId: item.id})}
                        />
                    </List>
                </div>

                {this.item.productDesc?<Button className="cm-mt-080" onClick={()=>this.submit('update')}>确认</Button>:
                    <Button  className="cm-mt-080" onClick={()=>this.submit('submit')}>发布</Button>
                }
                {this.item.productDesc?null:<TabBottom history={this.props.history} activeNum={1}/>}

            </div>
        )
    }


}