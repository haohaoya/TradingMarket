import React from 'react';
import './index.css';
import {defaultProps} from './defaultProps';
export default class Type extends React.Component{
    static defaultProps = defaultProps;
    constructor(props){
        super(props);
        this.scrollLeft = 0;
        this.state={
            activeType:0//默认选中第一个类型
        }
    }
    //点击类型时触发的事件
    onTypeClick(index,item,e){
        var el = e.target.getBoundingClientRect();
        this.setState({
            activeType:index
        });
        var count = 0;
        var scroll = this.refs.scroll;
        var slideHalf = window.innerWidth/2;
        //滑动同时位移到屏幕中心区域
        if(el.x>slideHalf){
            count = 0;
            var timer = setInterval(()=>{
                if(count <= (el.x-slideHalf)){
                    scroll.scrollTo(this.scrollLeft + count,0);
                    count += 1;
                }else{
                    clearInterval(timer);
                }
            },10);
        }else{
            count = 0;
            var timer1 = setInterval(()=>{
                if(count <= Math.abs(el.x-slideHalf)){
                    scroll.scrollTo(this.scrollLeft - count,0);
                    count += 1;
                }else{
                    clearInterval(timer1);
                }
            },10);
        }
        this.scrollLeft = scroll.scrollLeft;
        const {onTypeClick} = this.props;
        if (onTypeClick){
            onTypeClick(item);
        }
    }
    render() {
        const {prefixCls,typeList} = this.props;
        return(
            <div className={prefixCls} ref="scroll">
                {typeList.map((item,index)=>{
                    return(
                        <div key={index} className={this.state.activeType===index?prefixCls+"-item-active":prefixCls+"-item"}
                                onClick={(e)=>this.onTypeClick(index,item,e)}>
                            {item.name}
                        </div>
                    )
                })}
            </div>
        )
    }
}

















