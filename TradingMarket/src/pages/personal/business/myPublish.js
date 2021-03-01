
import React from 'react';
import {Title} from '../../../share';
import publish from "../../../images/personal/publish.png";
import {getData, goNext} from '../../../utils';
import ProductList from './share/productList';
let self;
export default class MyPublish extends React.Component {
    constructor(props) {
        super(props);
        self = this;
        this.type = 1;//type表示类型，1.我发布的；2.我卖出的 3.我买到的
        this.state = {
            dataList:[],//初始化我发布的商品列表
        }
    }
    componentDidMount(){
        //获取我发布的商品列表
        this.getMyProductList();
    }
    //获取我发布的商品列表
    getMyProductList(){
        getData({
            method: 'post',
            url: 'getMyProductList',
            data: {
                type:this.type
            },
            successCB: (res) => {
                console.log(res);
                this.setState({
                    dataList:res.result.list
                })
            }
        })
    }
    //渲染视图
    render() {
        return <div>
            <Title title="我发布的" that={this} style={{background:"#fff"}}/>
            <ProductList
                TopArea={TopArea}
                NoData={NoData}
                ButtonArea={ButtonArea}
                dataList = {this.state.dataList}
                self={this}
            />
        </div>
    }
}
//按钮区域
class ButtonArea extends React.Component{
    //编辑发布的信息，进入商品编辑页面
    modifyPublish(e){
        e.stopPropagation();
        const {item} = this.props;
        goNext(self,"publish",item);
    }
    //删除发布信息
    delProduct(e){
        const {item} = this.props;
        e.stopPropagation();
        getData({
            method: 'post',
            url: 'delProduct',
            data: {
                productId:item.id,
                type:self.type
            },
            successCB: (res) => {
                //删除之后重新调一下我发布的商品列表接口，刷新列表页
                self.getMyProductList();
            }
        })
    }
    render(){
        return  <div className="cm-flex cm-ai-c cm-ptb-02 cm-border-top-eee cm-jc-fe">
            <div className="cm-btn-border-333 cm-flex cm-ai-c cm-mr-02" onClick={(e)=>this.modifyPublish(e)}>
                <span className="cm-fs-028">编辑</span>
            </div>
            <div className="cm-btn-border-333 cm-flex cm-ai-c cm-mr-02" onClick={(e)=>this.delProduct(e)}>
                <span className="cm-fs-028">删除</span>
            </div>
        </div>
    }
}
//顶部区域
class TopArea extends React.Component{
    render(){
        return <div className="cm-ptb-02 cm-p-02 cm-bc-white">
            <div className="cm-flex cm-ai-c">
                <img src={publish} alt="" className="cm-img-04 cm-border-radius-half"/>
                <div className="cm-c-999 cm-ml-01 cm-fs-026">我发布的宝贝共<span className="cm-c-main cm-fs-028"> {this.props.num} </span>件</div>
            </div>
        </div>
    }
}
//无数据时显示内容
class NoData extends React.Component{
    render(){
        return  <div className="cm-c-666 cm-tx-c cm-mt-080">
            <div>你还没有发布任何宝贝哦！</div>
            <div className="cm-mt-04" onClick={()=>goNext(self,'publish')}>
                <span className="cm-btn-main-higher">发布宝贝</span>
            </div>
        </div>
    }
}