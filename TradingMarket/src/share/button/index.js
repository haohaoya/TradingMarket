import React from 'react';
import classnames from 'classnames';
import './index.css';
import {defaultProps} from './defaultProps';
import TouchFeedback from 'rmc-feedback';
//俩个中文字符的正则表达式
const rxTwoCNChar = /^[\u2e00-\u9fa5]{2}$/;
//判断是否是俩个中文字符的函数
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
//判断是否是字符类型
function isString(str){
    return typeof str === 'string';
}
//调用上面俩个判断。如果是俩个中文字符的字符串则插入空格
function insertSpace(child){
    if(isString(child.type) && isTwoCNChar(child.props.children)){
        return React.cloneElement(
            child,
            {},
            child.props.children.split('').join(' '),
        );
    }
    if(isString(child) && isTwoCNChar(child)){
        child = child.split('').join(' ');
    }
    return child;
}

export default class Button extends React.Component{
    static defaultProps = defaultProps;
    handleClick(){
        const { onClick } = this.props;
        if(onClick){
            onClick();
        }
    };
    render(){
        const {prefixCls,type,children,className} = this.props;
        //通过classnames方法将所有的class整合
        const wrapCls = classnames(prefixCls, className,{
            [`${prefixCls}-btn`]:(type === 'primary'||!type),
            [`${prefixCls}-btn-fill`]:type === 'fill',
            [`${prefixCls}-btn-half`]:type === 'half',
        });
        //调用insertSpace方法判断，如果是俩个中文字符则插入空格
        const kids = React.Children.map(children, insertSpace);
        //使用ant-design TouchFeedBack
        return(
            <TouchFeedback activeClassName={prefixCls+"-active"}>
                <div className={wrapCls} onClick={ ()=>this.handleClick() }>
                    {kids}
                </div>
            </TouchFeedback>
        )
    }
}










