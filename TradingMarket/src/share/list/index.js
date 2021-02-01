import React from 'react';
import Item from './ListItem';
import {defaultProps} from './defaultProps';
import './index.css';
export default class List extends React.Component{
    static defaultProps = defaultProps;
    render() {
        let {onClick,prefixCls,border} = this.props;
        return(
            <div className={border?prefixCls:prefixCls+'-no-border'} onClick={(e)=>onClick(e)}>
                {this.props.children}
            </div>
        )
    }

}
List.Item = Item;