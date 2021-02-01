import React from 'react';
import {defaultProps} from "./defaultProps";
import './index.css';
export default class Card extends React.Component{
    static defaultProps = defaultProps;
    render(){
        let {onClick,prefixCls} = this.props;
        return(
            <div className={prefixCls} onClick={ ()=>onClick?onClick():undefined}>
                {this.props.children}
            </div>
        )
    }
}