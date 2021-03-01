import React from 'react';
import search from '../../images/index/search.png';
import {Carousel,ListView} from "antd-mobile";
import {Search,Type,TabBottom} from "../../share";
import {getData,goNext} from "../../utils";
import './index.css'
import Config from "../../envConfig";
export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.initData = [];//定义空数组，用于上拉加载更多时拼接数据
        this.typeId="";//定义商品类型查询
        this.key="";//定义关键字查询
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })//数据源初始化
        this.state = {
            dataSource:dataSource.cloneWithRows(this.initData),
            pageNum:1,//定义初始化请求序号
            pageSize:10,//定义初始化请求数量
            typeList:[{name:" 全部 "}],//定义初始化商品类型数组
            productList:[],//定义初始化商品数组
            hasMore:true,//是否已经加载完成
            bannerList:[],//定义初始化轮播图数组
            statusText:" 加载中 "//定义上拉加载判断状态，3种状态：加载种、加载完成、暂无数据

        }
    }

    //选择商品类型
    changeType(item){
        this.refs.search.closeValue();
        this.typeId = item.id;
        this.state.pageNum = 1;
        this.key = "";
        this.initData = [];
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(this.initData),
            hasMore:true,
            statusText:" 加载中 "
        });
        this.getProductList();
    }

    //点击某一商品，进入商品详情页面
    goDetail(item){
        goNext(this,"productDetail",item);
    }

    //点击进入商品发布页面
    goPublish(e){
        goNext(this,"publish");
    }

    //获取商品列表
    getProductList(){
        getData({
            method:'post',
            url:'getProductList',
            isShowLoad:true,
            data:{
                pageNum:this.state.pageNum,
                pageSize:this.state.pageSize,
                productDesc:this.key,
                productTypeId:this.typeId
            },
            successCB:(res)=>{
                this.state.pageNum++;
                this.initData = this.initData.concat(res.result.list);//已有数组拼接 上拉加载更多结果的数组
                let total = res.result.total;//商品列表总数量
                if(total == 0){
                    this.setState({
                        statusText:" 暂无数据 "//总数为0时，表示没有数据
                    })
                }else if(total == this.initData.length){
                    //拼接的数据总长等于总数时表示加载完成 加载完成 没有更多数据了
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(this.initData),
                        hasMore:false,//加载完成，hasMore状态改为false
                        statusText:" 加载完成 "
                    })
                }else{
                    setTimeout(()=>{
                        dataSource:this.state.dataSource.cloneWithRows(this.initData)
                    },600);
                }
            }
        });
    }

    //获取轮播图列表
    getBannerList(){
        getData({
            method:'get',
            url:'getBannerList',
            successCB:(res) => {
                this.setState({
                    bannerList:res.result
                })
            }
        });
    }

    //获取商品类型列表
    getProductTypeList(){
        getData({
            method:'get',
            url:'getProductTypeList',
            successCB:(res)=>{
                localStorage.setItem("typeList",JSON.stringify(res.result));
                let typeList = this.state.typeList.concat(res.result);
                this.setState({
                    typeList:typeList
                })
            }
        })
    }

    //通过商品关键字搜索
    getProductListByKey(val){
        this.state.pageNum = 1;
        this.initData = [];
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(this.initData),
            hasMore:true,
            statusText:" 加载中 "
        })
        this.key = val;
        this.getProductList()
    }

    //加载页面时获取论轮播图列表、商品类型列表、商品列表
    componentDidMount() {
        this.getProductList();
        this.getProductTypeList();
        this.getBannerList();
    }

    //上拉加载更多时触发
    onEndReached = (event) =>{
        if(!this.state.hasMore){
            return false;
        }
        this.setState({isLoading:true},()=>this.getProductList());
    }

    banner(url){
        window.location.href=url;
    }
    //渲染页面
    render() {
        var arr=[];
        const row = (rowData,sectionID,rowID) => {
            var productImgs = rowData.productImgs.split(",");
            var desc = rowData.productDesc && rowData.productDesc.slice(0,28);
            return (
                <div className={rowID%2==0?"index-product-left":"index-product-right"} key={rowID} onClick={()=>this.goDetail(rowData)}>
                    <div className="index-img">
                        <img src={productImgs[0]} alt="" className="index-img"/>
                    </div>
                    <div className="cm-p-009">
                        <div className="cm-c-666 cm-mt-009 cm-fs-024">{desc}</div>
                        <div className="index-price cm-c-main cm-fs-026 cm-flex cm-jc-sb">
                            <span>￥{rowData && rowData.productPrice}</span>
                            <span className="cm-c-999 cm-fs-022">{rowData.wantNum>0?rowData.wantNum+"人想要":""}</span>
                        </div>
                        <div className="cm-flex cm-ptb-009 cm-border-top-eee cm-ai-c">
                            <img src={rowData.publishUserAvatar} className="cm-img-10 cm-border-radius-half cm-mr-009" alt=""/>
                            <div className="cm-c-333 cm-fs-026">
                                {rowData.publishUserName}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        return(
            <div>
                <Search
                    leftClick = {(val)=>this.getProductListByKey(val)}
                    rightIcon={search}
                    rightClick={(val)=>this.getProductListByKey(val)}
                    placeholder="请输入商品关键字"
                    ref="search"
                />

                <div className="cm-img-banner">
                    {this.state.bannerList.length>0?
                        <Carousel autoplay={true} infinite={true} className="" selectedIndex={0}>
                            {

                                this.state.bannerList.map((item,index)=>{
                                    return (

                                        <a href={item.url}>
                                            <div>
                                                <img src={item.image} key={index} alt="" className="cm-img-banner"/>
                                            </div>
                                        </a>


                                    )
                                })



                            }
                        </Carousel>:null
                    }
                </div>

                <div className="cm-mlr-018">
                    <Type
                        typeList = {this.state.typeList}
                        onTypeClick = {(val)=>this.changeType(val)}
                    />
                </div>

                <ListView
                    useBodyScroll={true}
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={()=>(
                        <div style={{paddingBottom:60,textAlign:'center'}}>
                            {this.state.statusText}
                        </div>
                    )}
                    renderBodyComponent={()=>(
                        <Body/>
                    )}
                    renderRow={row}
                    pageSize={4}
                    scrollRenderAheadDistance={500}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                />

                <TabBottom history={this.props.history}/>

            </div>

        )
    }
}

function Body(props){
        return(
            <div>
                <div>
                    {props.children}
                </div>
            </div>
        )
}