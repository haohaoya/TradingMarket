import React from 'react';
import './index.css';
import {defaultProps} from './defaultProps';
export default class Search extends React.Component{
    static defaultProps = defaultProps;
    constructor(props) {
        super(props);
        this.state = {
            isShowClose:false//是否显示文本框框右边的关闭图标
        }
    }
    //点击左边搜索图标触发的事件
    leftClick(){
        this.callBack();
    }
    //文本框回调
    callBack(){
        const {onSearch} = this.props;
        var key = this.refs.input.value;
        if(onSearch){
            onSearch(key);
        }
    }
    //执行右边图标的事件
    rightClick(){
        const {onRightClick} = this.props;
        if(onRightClick){
            onRightClick();
        }
    }
    //点击文本框右边的关闭图标时，清除搜索内容并删除图标
    closeValue(){
        this.refs.input.value = '';
        this.setState({
            isShowClose:false
        })
    }
    //点击文本框进行关键字搜索时，右边出现关闭图标
    onChange(event){
        if(event.target.value === ''){
            this.setState({
                isShowClose:false
            })
        }else{
            this.setState({
                isShowClose:true
            })
        }
    }
    //按下键盘时触发的事件
    keyDown(e){
        if(e.keyCode === 13){
            e.preventDefault();
            this.refs.input.blur();
            this.callBack();
        }
    }
    render(){
        const{
            prefixCls,
            searchIcon,
            rightIcon,
            placeholder,
            closeIcon
        } = this.props;
        return(
            <div className={prefixCls}>
                <div className={prefixCls+"-layout"}>
                    <div className={prefixCls+"-content-left"}>
                        <img src={searchIcon} alt="" className={prefixCls+"-search-icon"} onClick={()=>this.leftClick()}/>
                        <from action="#" className={prefixCls+"-form"}>
                            <input type="search" ref="input" className={prefixCls+"-input"} placeholder={placeholder}
                                   onChange={(e)=>this.onChange(e)} onKeyDown={(e)=>this.keyDown(e)}/>
                        </from>
                        {this.state.isShowClose?
                            <img src={closeIcon} alt="" className={prefixCls+"-close-icon"} onClick={()=>this.closeValue()}/>:null}
                    </div>
                    {rightIcon?<img src={rightIcon} alt="" className={prefixCls+"-right-icon"} onClick={()=>this.rightClick()}/>:null }
                </div>
            </div>
        )
    }
}