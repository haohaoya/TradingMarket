
import React from 'react';
import praise from '../../../images/product/praise.png';
import alreadyPraise from '../../../images/product/already-praise.png';
import praiseHeart from '../../../images/product/praise-heart.png';
import msg from '../../../images/product/msg.png';
import comment from '../../../images/product/comment.png';
import {Title} from '../../../share';
import {getData,getTime,autoTextarea} from '../../../utils';
import '../productDetail/productDetail.css';
import {Toast} from "antd-mobile";
export default class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            praiseList: [],//初始化点赞列表
            commentList: [],//初始化评论列表
            isPraise:2, //是否点赞，1为是，2为否，默认为2
            isShowComment:false,//是否弹出留言框
            item:{}//初始化商品详情信息
        };
        this.commentItem = {};
        //获取从首页和轮播图点击过来携带的参数
        var item = this.props.history.location.state ||{};
        //获取商品id
        this.id = item.id||item.productId;
    }
    componentDidMount(){
        //通过商品id查询商品详情
        this.getProductById();
        //获取点赞列表信息
        this.getPraiseList();
        //获取评论列表信息
        this.getCommentList();
    }
    //通过商品id查询商品详情
    getProductById(){
        getData({
            method: 'get',
            url: 'getProductDetail',
            data:{productId:this.id},
            successCB: (res) => {
                this.setState({
                    item: res.result
                })
            }
        })
    }
    //获取点赞列表信息
    getPraiseList(){
        getData({
            method: 'get',
            url: 'getPraiseList',
            data:{productId:this.id},
            successCB: (res) => {
                this.setState({
                    praiseList: res.result.list,
                    isPraise:res.result.praiseStatus
                })
            }
        })
    }
    //获取评论列表信息
    getCommentList(){
        getData({
            method: 'get',
            url: 'getCommentReplyList',
            data:{productId:this.id},
            successCB: (res) => {
                this.setState({
                    commentList: res.result
                })
            }
        })
    }
    //打开评论窗口
    showBox(e,commentItem){
        //阻止事件冒泡
        e.stopPropagation();
        //显示输入框
        this.setState({
            isShowComment:true
        },()=>{
            //textare文本框高度自适应
            autoTextarea();
            //自动聚焦键盘
            this.refs.textarea.focus();
        });
        //判断登录状态
        getData({
            method: 'post',
            url: 'checkLoginValid',
            successCB: (res) => {
                this.commentItem = commentItem || this.state.item;
            }
        });
    }
    //关闭评论窗口
    closeBox(){
        this.setState({
            isShowComment:false
        })
    }
    //发布留言/评论
    comment(){
        var userId = this.commentItem.fromUserId;
        this.setState({
            isShowComment:!this.state.isShowComment
        });
        var value = this.refs.textarea.value;
        getData({
            method: 'post',
            url: 'checkLoginValid',
            successCB: (res) => {
                getData({
                    method: 'post',
                    url: 'commentOrReply',
                    data: {
                        productId:this.id,
                        content:value,
                        toUserId:userId,
                        replyId: this.commentItem.id,
                    },
                    successCB: (res) => {
                        //评论成功之后重新获取评论列表
                        this.getCommentList();
                    }
                })
            }
        });
    }
    //点赞
    praise(){
        getData({
            method: 'post',
            url: 'checkLoginValid',
            successCB: () => {
                    //1表示点过赞，2表示没有点过赞，点赞状态取反。
                    var isPraise = (this.state.isPraise === 2)?1:2;
                    this.setState({
                        isPraise:isPraise
                    });
                    getData({
                        method: 'post',
                        url: 'praiseOrUnPraise',
                        data: {
                            productId:this.id,
                            status:isPraise
                        },
                        successCB: () => {
                            //点赞成功之后重新获取点赞列表
                            this.getPraiseList();
                        }
                    })
            }
        });
    }
    //进入聊天详情页面，初始化聊天
    goChat(){
        //判断登录状态
        getData({
            method: 'post',
            url: 'checkLoginValid',
            successCB: (res) => {
                var param = {
                    productId:this.state.item.productId,
                    toUserId:this.state.item.publishUserId,
                };
                var me = JSON.parse(sessionStorage.getItem("userInfo"));
                if(me.userId === param.toUserId){
                    Toast.info("不能购买您自己的商品呦");
                }else{
                    getData({
                        method: 'post',
                        url: 'initChat',
                        data:param,
                        successCB: (res) => {
                            this.props.history.push("messageDetail",Object.assign(this.state.item,{chatId:res.result.chatId}))
                        }
                    });
                }
            }
        });
    }
    //渲染视图
    render() {
        var productImgs = (this.state.item.productImgs && this.state.item.productImgs.split(","))||[];
        return (
            <div>
                <Title title="详情" that={this}/>
                <div className="cm-mlr-02" onClick={()=>this.closeBox()}>
                    <div className="cm-flex cm-ai-c cm-border-bottom-ddd cm-ptb-02 cm-fs-020">
                        <img src={this.state.item.publishUserAvatar} alt="" className="cm-img-16 cm-mlr-018"/>
                        <div>
                        <div className="cm-fw-bold cm-c-333 cm-fs-028">{this.state.item.publishUserName}</div>
                        <div className="cm-c-999 cm-mt-02 cm-fs-024">{getTime(this.state.item.publishTime)} 发布于{this.state.item.productAddress}</div>
                        </div>
                    </div>
                    <div>
                    <div className="cm-ptb-02 cm-fs-026">
                        <div className="cm-c-main">￥{this.state.item.productPrice}</div>
                        <div className="cm-c-333 cm-ptb-02 cm-mlr-018">{this.state.item.productDesc}</div>
                    </div>
                    <div>
                        {productImgs.map((img,index)=>{
                            return(
                                <img src={img} key={index} alt="" className="cm-img-big"/>
                                )
                        })}
                    </div>
                    </div>
                    <div className="cm-pt-02">
                        <div className="detail-line">
                            <span className="cm-ml-018">点赞</span><span>{this.state.praiseList.length}</span>
                        </div>
                        <div className="cm-flex cm-ai-c cm-ptb-02">
                            <img src={praiseHeart} alt="" className="cm-img-04 cm-mr-02"/>
                            <div className="cm-flex cm-ai-c cm-flex-wrap">
                            {this.state.praiseList.length===0?
                                <div>暂无点赞</div>:
                                this.state.praiseList.map((item, index) => {
                                return (
                                    <div className="cm-flex cm-ai-c cm-mr-02" key={index}>
                                        <img src={item.userAvatar} alt="" className="cm-img-14 cm-border-radius-half cm-m-018"/>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                    </div>
                    <div className="cm-pt-02">
                        <div className="detail-line"><span
                            className="cm-ml-018">留言</span><span>{this.state.commentList.length}</span></div>
                        <div className="cm-flex cm-ai-c cm-ptb-02">
                            <img src={msg} alt="" className="cm-img-04 cm-mr-02 cm-as-fs cm-mt-02"/>
                            {this.state.commentList.length===0?<div>暂无留言</div>:
                                <div className="cm-w-full">
                                    {this.state.commentList.map((item, index) => {
                                    return (
                                        <div key={index} className="cm-ptb-02 cm-border-bottom-eee">
                                        <div className="cm-flex cm-jc-sb cm-ai-c">
                                            <div className="cm-flex cm-ai-c">
                                                <img src={item.fromUserAvatar} alt="" className="cm-img-14 cm-border-radius-half cm-m-018"/>
                                                <div className="cm-c-333 cm-fw-bold cm-fs-026">{item.fromUserName}</div>
                                            </div>
                                            <div className="cm-c-999 cm-fs-024">{getTime(item.createTime)}</div>
                                        </div>
                                        <div className="cm-c-666 cm-fs-height detail-replay cm-fs-026" >
                                           {item.content}
                                        </div>
                                        </div>
                                    )
                                })}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {this.state.isShowComment?<div className="cm-bottom-position detail-bottom cm-bc-white">
                        <textarea ref="textarea" className="cm-border-ddd cm-border-radius-10 cm-mr-018 cm-flex-1 cm-p-036 " name="" id="" cols="30" rows="1" placeholder="评价一下它吧"  ></textarea>
                        <div className="cm-btn-main-higher cm-fs-100" onClick={()=>this.comment()}>发 送</div>
                    </div>:<div className="detail-fill">
                        <div className="cm-flex cm-ai-c cm-jc-sb detail-bottom cm-jc-sb">
                            <div className="cm-flex cm-ai-c">
                                <div className="cm-flex-column cm-ai-c cm-jc-c cm-mlr-072">
                                    <img src={this.state.isPraise === 1?alreadyPraise:praise} alt="" className="cm-img-16" onClick={()=>this.praise()}/>
                                    <span className="cm-c-999 cm-fs-060">点赞</span>
                                </div>
                                <div className="cm-flex-column cm-jc-c cm-ai-c cm-mlr-072">
                                    <img src={comment} alt="" className="cm-img-16" onClick={(e)=>this.showBox(e)}/>
                                    <span className="cm-c-999 cm-fs-060">留言</span>
                                </div>
                            </div>
                            <span className="cm-btn-main-higher cm-fs-100" onClick={()=>this.goChat()}>我想要</span>
                        </div>
                    </div>}
            </div>
        )
    }
}