import React from 'react';
import classnames from 'classnames';
import './index.css';
import {defaultProps} from './defaultProps';
export default class Input extends React.Component{
    static defaultProps = defaultProps;
    change(event){
        const {onChange}=this.props;
        onChange(event.target.value,event);
    }
    render(){
        const {prefixCls,label,defaultValue,placeholder,type,src,renderRight,className,maxLength,style,disabled} = this.props;
        return (
            <div className={prefixCls}>
                <div className={prefixCls+"-wrap"}>
                    {src? <img src={src} alt="" className={prefixCls+"-icon"} />:
                        label?<label htmlFor="" className={prefixCls+"-label"}>{label}</label>:null}
                    <input type={type?type:"text"} disabled={disabled} onChange={(e)=>this.change(e)} className={classnames(prefixCls+"-input",className)}
                           placeholder={placeholder} maxLength={maxLength} style={style} defaultValue={defaultValue} />
                </div>
                {renderRight?renderRight:null}
            </div>
        )
    }
}