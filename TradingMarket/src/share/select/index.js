import React from 'react';
import right from '../images/select/right.png';
import select from '../images/select/select.png';
import close from '../images/select/close.png';
import './index.css';
import {defaultProps} from './defaultProps';
export default class Select extends React.Component{
    static defaultProps = defaultProps;
    constructor(props) {
        super(props);
        this.state = {
            isShow:false,//是否显示下列拉列框，初始隐藏
            active:(props.activeOne && props.activeOne.type-1) || 0,//默认选中某一行
            value:'',//类别名称
            id:'',//类别id
            bottomHeight:250,//下列拉列框高度
        }
    }
    componentWillReceiveProps({options,onChange}) {
        const isContainedInNumbers = options.some(number => number.id === this.state.id);
        if(isContainedInNumbers){
            return ;
        }
        this.state.value = this.props.activeOne && this.props.activeOne.name||options[0].name;//默认显示第一个类别
        this.state.id = this.props.activeOne && this.props.activeOne.type||options[0].id;//默认显示第一个类别id
        //由于更新父组件state,导致父组件重新render，而React在render时，不管子组件属性是否改变，都会调用componentWillReceiveProps,
        //因此会导致componentWillReceiveProps死循环。不过没关系，前面加上了终止条件。
        //所以在这个方法里更改state 一定要小心。
        onChange(options[0]);
    }
    //显示下拉列表框
    showBox(str){
        this.setState({
            isShow:!this.state.isShow
        }, ()=>{
            if(str === "setHeight"){
                this.setHeight(this)
            }
        })
    }
    //设置下拉列表框的高度
    setHeight(that){
        var height = this.refs && this.refs.box.offsetHeight;
        console.log(height);
        if(height>=this.state.bottomHeight){
            console.log(that.refs.box);
            that.refs.box.style.height = this.state.bottomHeight+"px";
            that.refs.box.style.overflow = "scroll";
        }
    }
    //关闭下拉列表框
    closeBox(){
        this.setState({
            isShoe:false
        })
    }
    //选择了某一行触发的事件
    change(item,index){
        const {onChange}=this.props;
        onChange(item);
        this.setState({
            value:item.name,
            active:index
        })
    }
    render(){
        const {prefixCls,options,babel} = this.props;
        return(
            <div className={prefixCls}>
                <div>{babel}</div>
                <div className={prefixCls+'-wrap'} onClick={()=>this.showBox("setHeight")}>
                    <div>{this.state.value}</div>
                    <img src={right} alt="" className={prefixCls+'-arrow'}/>
                </div>

                {this.state.isShow?
                    <div className={prefixCls+'-modal'}>
                        <div className={prefixCls+'-content'} ref="box" onClick={()=>this.showBox()}>
                            <div className={prefixCls+'-height'}>
                                <div className={prefixCls+'-item'}>
                                    <div className={prefixCls+'-item-left'}>
                                        <img className={prefixCls+'-item-icon'} src={select} alt="" onClick={()=>this.closeBox()}/>
                                        <span className={prefixCls+'-item-tips'}>请选择分类</span>
                                    </div>
                                    <img className={prefixCls+'-item-icon'} src={close} alt="" onClick={()=>this.closeBox()}/>
                                </div>
                            </div>
                            {options.map((item,index) => {
                                return <div key={index} className={this.state.active === index? prefixCls+'-label-active':prefixCls+'-label'}
                                            onClick={()=>this.change(item,index)}>{item.name}</div>
                            })}
                        </div>
                    </div>:null
                }
            </div>
        )
    }
}