import React from 'react';
import right from '../images/list/right.png';
import {defaultProps} from './defaultProps';
export default class ListItem extends React.Component{
    static defaultProps = defaultProps;
    onRightClick(){
        const {onRightClick} = this.props;
        if(onRightClick){
            onRightClick();
        }
    }
    render() {
        const {prefixCls,leftIcon,leftTitle,rightTitle,rightIcon,isNotRightIcon} = this.props;
        return(
            <div className={prefixCls+"-item"}>
                <div className={prefixCls+"-item-left"}>
                    {leftIcon?<img src={leftIcon} alt="" className={prefixCls+"-item-left-icon"}/>:null }
                    <span className={prefixCls+"-item-left-text"}>{leftTitle}</span>
                </div>
                <div className={prefixCls+"-item-right"} onClick={()=>this.onRightClick()}>
                    <span className={prefixCls+"-item-right-text"}>{rightTitle}</span>
                    {isNotRightIcon ? null :
                        rightIcon?<img src={rightIcon} alt="" className={prefixCls+"-item-right-icon"}/>:
                            <img src={right} alt="" className={prefixCls+"item-right-icon"}/> }
                </div>
            </div>
        )
    }
}