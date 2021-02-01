import React from 'react';
import {defaultProps} from './defaultProps';
import './index.css';
import close from '../images/address/close-gray.png';
import checked from '../images/address/checked.png';
//后期可以从开放的地图api获取地址列表，再进行包装。
//或者从后端去获取完整的地图城市信息。
import {addressInfo} from './addressInfo';
//热门城市，后期可以从后端获取
import {hotAddress} from './hotAddress';
export default class Address extends React.Component{
    static defaultProps = defaultProps;
    constructor(props) {
        super(props);
        this.selectList = [];
        this.addressList = [];
        this.generate(addressInfo,this.addressList,"0");
        this.state={
            defaultText:"选择省份/城市",
            province:"",
            selectOne:"",
            city:"选择城市",
            district:"选择区县",
            street:"选择街道",
            selectList:[],
            hotCity:hotAddress,
            isChoose:false,
            addressList:this.addressList
        }
    }
    //处理数据结构，将数组处理城链表形式
    generate = (list,arr,superId)=>{
        var data = arr||[];
        for(var i=0;i<list.length;i++){
            var item = list[i];
            if(item.superId == superId){
                if(item.type == "province"){
                    item.text = "选择城市";
                }
                if(item.type == "city"){
                    item.text = "选择县区";
                }
                if(item.typw == "district"){
                    item.text = "选择街道";
                }
                data.push(item);
                data.map((item1)=>{
                    item1.list = [];
                    return this.generate(list,item1.list,item1.id);
                })
            }
        }
        return data;
    };

    //选择热门城市
    chooseCity(text){
        var province = {};
        var item = {};
        for(var i=0;i<this.addressList.length;i++){
            var itemOne = this.addressList[i];
            //同等级类型添加后替换原先的地区，清除后面的选项
            for(var j=0;j<itemOne.list.length;j++){
                var itemOne1 = itemOne.list[j];
                if(itemOne1.type == text.type && itemOne1.name.indexOf(text.name)>-1){
                    province = itemOne;
                    item = itemOne1;
                    break;
                }
            }
        }
        this.selectList.push(province);
        this.selectList.push(item);
        this.selectList.push({name:item.text,list:item.list});
        this.setState({
            selectOne:{name:item.text,list:item.list},
            isChoose:true,
            addressList:item.list,
            defaultText:item.text,
            selectList:this.selectList,
        })
    }

    //改变地址
    changeAddress(item){
        this.setState({
            selectOne:item
        });
        //找到对应的数据集
        this.findOne(this.addressList,item)
    }
    findOne(list,item){
        if(list && list.length){
            for(var i=0;i<list.length;i++){
                var item1 = list[i];
                if(item.name.indexOf("选择") > -1){
                    this.setState({
                        addressList:item.list
                    })
                    break;
                }else if(item.name == item1.name){
                    this.setState({
                        addressList:list
                    });
                    break;
                }else{
                    this.findOne(item1.list,item)
                }
            }
        }
    }

    //选择地区
    chooseAddress(item){
        let {getAddress} = this.props;
        for(var i=0;i<this.selectList.length;i++){
            var itemOne = this.selectList[i];
            //将选择列表中带有选择的去掉
            if(itemOne.name.indexOf("选择") > -1){
                this.selectList.splice(i,1);
                break;
            }
            //同等类型 添加后替换原先的地区，清除后面的选项
            if(itemOne.type == item.type){
                this.selectList[i] = item;
                this.selectList = this.selectList.slice(0,i+1);
                this.selectList.push({name:item.text,list:item.list});
                break;
            }
        }
        //去重，只添加没有添加的地址
        if(!this.selectList.includes(item)){
            this.selectList.push(item);
            this.selectList.push({name:item.text,list:item.list});
        }
        this.setState({
            selectOne:{name:item.text,list:item.list},
            isChoose:true,
            addressList:item.list,
            defaultText:item.text,
            selectList:this.selectList,
        },()=>{
            //没有子节点了，说明选择到叶节点了。
            if(item.list.length == 0){
                //过滤嗲有选择的值
                this.state.selectList = this.state.selectList.filter((item)=>item.name && item.name.indexOf("选择")<0);

                var obj = {};
                obj.province = this.state.selectList[0]?this.state.selectList[0].name : "";
                obj.city = this.state.selectList[1]?this.state.selectList[1].name : "";
                obj.district = this.state.selectList[2]?this.state.selectList[2].name : "";
                obj.street = this.state.selectList[3]?this.state.selectList[3].name : "";
                getAddress(obj);
            }
        })
    }
    render(){
        let {closeModel,prefixCls,leftTitle} = this.props;
        return(
            <div className={prefixCls}>
                <div className={prefixCls+"-wrapper"}>
                    <div className={prefixCls+"-title"}>
                        <div className={prefixCls+"-title-left"}>
                            {leftTitle}
                        </div>
                        <div className={prefixCls+"-title-text"}>
                            请选择
                        </div>
                        <img src={close} alt="" className={prefixCls+"-title-right"} onClick={()=>closeModel()}/>
                    </div>

                    {this.state.isChoose?
                        <div className={prefixCls+"-already"}>
                            {this.state.selectList.map((item,index)=>{
                                return <div key={index}
                                            className={item.name == this.state.selectOne.name?prefixCls+"-already-item-active":prefixCls+"-already-item"}
                                            onClick={()=>this.changeAddress(item)}>{item.name}</div>
                            })}
                        </div>:
                        <div className={prefixCls+"-city"}>
                            <div className={prefixCls+"-city-text"}>
                                热门城市
                            </div>
                            <div className={prefixCls+"-city-list"}>
                                {
                                    this.state.hotCity.map((item,index)=>{
                                        return <div key={index} className={prefixCls+"-city-item"} onClick={()=>this.chooseCity(item)}>{item.name}</div>
                                    })
                                }
                            </div>
                        </div>
                    }
                    <div className={prefixCls+"-select"}>
                        <div className={prefixCls+"-select-text"}>{this.state.defaultText}</div>
                        <div className={prefixCls+"-select-list"}>
                            {
                                this.state.addressList.map((item,index)=>{
                                    return <div className={prefixCls+"-select-wrapper"} key={index}>
                                        <div onClick={()=>this.chooseAddress(item,index)}
                                             className={item.name==this.state.selectOne.name?prefixCls+"-select-item-active":prefixCls+"-select-item"}>{item.name}</div>
                                        {item.name == this.state.selectOne.name? <img src={checked} alt="" className={prefixCls+"-select-item-checked"}/>:null }
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}













