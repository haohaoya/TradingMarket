import React from 'react';

import myAct from '../images/tab-bottom/my.png';
import my from '../images/tab-bottom/my-gray.png';

import msgAct from '../images/tab-bottom/message.png';
import msg from '../images/tab-bottom/message-gray.png';

import indexAct from '../images/tab-bottom/index.png';
import index from '../images/tab-bottom/index-gray.png';

import publishAct from '../images/tab-bottom/publish.png';
import publish from '../images/tab-bottom/pubilsh-gray.png';

import {defaultProps} from './defaultProps';
import './index.css';

export default class TabBottom extends React.Component{
    static defaultProps = defaultProps;
    constructor(props) {
        super(props);
        this.tabList = props.tabList.length>0?props.tabList:
            [
                {label:"首页",icon:index,iconAct:indexAct,path:"index"},
                {label:"发布",icon:publish,iconAct:publishAct,path:"publish"},
                {label:"消息",icon:msg,iconAct:msgAct,path:"message"},
                {label:"我的",icon:my,iconAct:myAct,path:"personal"},
            ];

        this.state = {
            activeKey:props.activeNum//默认显示第一个tab 默认是0
        }
    }

    //点击tab时触发事件
    changeTab(path){
        this.props.history.push(path);
    }
    render(){
        const {prefixCls} = this.props;
        return(
            <div className={prefixCls}>
                <div className={prefixCls+"-position-fixed"}>
                    {this.tabList.map((item,index)=>{
                        return (<div key={index} className={index===this.state.activeKey?
                                                                prefixCls+"-tab-active":prefixCls+"-tab"} onClick={()=>this.changeTab(item.path)}>
                                    <img className={prefixCls+"-icon"} src={index===this.state.activeKey?item.iconAct:item.icon} alt="" />
                                    <span className={prefixCls+"-span"}>{item.label}</span>
                                </div>)
                    })}
                </div>
            </div>
        )
    }
}