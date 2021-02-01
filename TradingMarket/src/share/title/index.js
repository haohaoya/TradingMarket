import React from 'react';
import './index.css';
import backBlock from '../images/title/back-block.png';
import {defaultProps} from './defaultProps';
export default class Title extends React.Component{
    static defaultProps = defaultProps;
    //点击返回图标触发事件
    onLeftClick(){
        const {onLeftClick,that} = this.props;
        if (onLeftClick) {
            onLeftClick();
        }else{
            that.props.history.goBack();
        }
    }
    onRightClick(){
        const{onRightClick} = this.props;
        if(onRightClick){
            onRightClick();
        }
    }
    render() {
        const {title,prefixCls,isHome,rightTitle,rightIcon} = this.props;
        if(isHome){
            return (
                <div className={prefixCls}>
                    <div className={prefixCls+"-wrap-home"}>{title}</div>
                </div>
            )
        }else{
            return (
                <div className={prefixCls}>
                    <div className={prefixCls+"-wrap"} >
                        <div className={prefixCls+"-left"}>
                            <img src={backBlock} alt="" className={prefixCls+"-left-icon"} onClick={()=>this.onLeftClick()} />
                        </div>
                        <span>{title}</span>
                        <div className={prefixCls+"-right"} onClick={()=>this.onRightClick()}>
                            {rightTitle?rightTitle:
                                (rightIcon?<img src={rightIcon} className={prefixCls+"-right-icon"} alt=""/>:'' )}
                        </div>
                    </div>
                </div>
            )
        }
    }
}