import React from 'react';
import {Title} from '../../../share';
import ReactDOM from 'react-dom';
import {getData,getTimeFormat, getTimeHour,autoTextarea,goNext} from '../../../utils';
import sendErr from '../../../images/message/sendErr.png';
import './messageDetail.css';
let self;
export default class MessageDetail extends React.Component {
    constructor(props) {
        super(props);
        //获取从聊天列表页面和商品详情页传过来的参数
        this.item = this.props.history.location.state || {};
        //获取本地缓存的个人信息
        this.user = sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{};
        self = this;
        this.state = {
            dataSource:[],//初始化数据源
            hasMore:true,//是否有更多聊天记录标记
            pageNum:1,//初始化请求序号
            pageSize:10,//初始化请求数量
            value: "",//初始化输入值
            loadingText:"",//初始化加载提示文本
            isSendErr:false//是否发送错误
        };
        this.initData = [];
    }

    componentDidMount() {
        this.timer1=setTimeout(()=>{
            //textarea高度自适应
            autoTextarea();
            //监听聊天列表滑动，用于加载更多聊天记录
            this.scroll();
        },200);
        //首次进入页面加载聊天记录
        this.getChatDetailList();
        //进入页面连接WebSocket
        this.connectWebSocket();
    }
    scroll(){
        //获取滑动元素上面的DOM元素
        var topDOM = this.refs.topDOM;
        //获取滑动元素
        var scrollDOM = ReactDOM.findDOMNode(this.lv);
        //获取滑动元素高度
        const hei = window.innerHeight-50-topDOM.offsetHeight+"px";
        //将高度赋值给滑动元素
        scrollDOM.style.height = hei;
        //获取滑动元素的滑动高度
        var scrollHeight = scrollDOM.scrollHeight;
        //将滑动高度赋值给滑动元素的scrollTop，使最新的聊天记录在最下面
        scrollDOM.scrollTop = scrollHeight;
        //监听滑动
        scrollDOM.addEventListener('scroll',(e)=>{
            //如果没有更多记录了直接返回，
            if(!this.state.hasMore){
                return;
            }
            setTimeout(()=>{
                //每次滑动加载10条记录，加载完之后重置scrollTop
                if(e.target.scrollTop === 0 ){
                    e.target.scrollTop = 10;
                    setTimeout(()=>{
                        //加载完当前记录之后scrollTo到原先的位置
                        e.target.scrollTo(0,scrollHeight-30);
                    },100);
                    this.getChatDetailList((list,total)=>{
                        //如果所有记录加载完成，更新state
                        if(list.length>=total){
                            this.setState({
                                dataSource: list,
                                hasMore:false,
                                loadingText:"没有更多记录了"
                            })
                        }else {
                            this.setState({
                                dataSource: list,
                                loadingText:"加载中..."
                            });
                        }
                    });
                }
            },2000)
        })
    }
    connectWebSocket(){
        //连接WebSocket
        this.socket = new WebSocket("ws://123.56.106.180:9999/TradingMarket/socket?" + this.user.userId);
        //连接检测
        this.heartCheck = {
            timeout: 60000, //连接间隔时间1分钟，单位ms
            timeoutObj: null,
            serverTimeoutObj: null,
            reset: function() {
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
                return this;
            },
            start: function() {
                var that = this;
                this.timeoutObj = setTimeout(function() {
                    //这里发送一个连接请求，后端收到后，返回一个消息，
                    //onmessage拿到返回的消息就说明连接正常
                    self.socket.send("heartbeat...【" + self.user.userId + "】");
                    that.serverTimeoutObj = setTimeout(function() { //如果超过一定时间还没重置，说明后端主动断开了
                        self.socket.close(); //关闭连接
                    }, that.timeout)
                }, this.timeout)
            }
        }
        this.socket.onopen = ()=>{
            this.heartCheck.reset().start(); //连接检测重置
        };
        this.socket.onmessage = (msg)=> {
            this.heartCheck.reset().start(); //连接检测重置
            if (msg.data.indexOf("{") !== -1) {
                //获取监听的聊天记录
                var obj = JSON.parse(msg.data);
                //将聊天记录添加到聊天列表中，type为'received'用来区分是收到的聊天记录。
                this.initData.push({content: obj.content,type:'received',time: getTimeHour(new Date().getTime())});
                this.setState({
                    dataSource: this.initData,
                })
            }
        };
        this.socket.onerror = function (err) {
            console.log(err);
        };
    }
    //获取聊天记录
    getChatDetailList(cb) {
        getData({
            method: 'post',
            url: 'getChatDetailList',
            data: {
                chatId:this.item.chatId,
                pageNum:this.state.pageNum,
                pageSize:this.state.pageSize,
            },
            successCB: (res) => {
                var list = res.result.list;
                list.forEach(item=>{
                    //如果不是当前用户，则聊天记录属于接受方
                    if(item.userId !== this.user.userId){
                        item.type="received";
                    }
                    //今天的时间用09:30格式，今天之前的用2019-02-02 09:30格式
                    var nowTime = (new Date()).getTime();
                    var tomorrow = nowTime - 12*60*60*1000;
                    if(item.createTime<tomorrow){
                        item.time = getTimeFormat(item.createTime);
                    }else {
                        item.time = getTimeHour(item.createTime)
                    }
                });
                //反转数组，将最早的时间排在最下面
                list = list.reverse();
                this.initData = list.concat(this.initData);//已有的数组拼接上拉加载更多的数组
                let total = res.result.total;//聊天记录总数量
                if(cb){
                    cb(this.initData,total);
                }else {
                    if(total === 0){
                        this.setState({
                            loadingText:"暂无消息"//总数为0时表示没有数据
                        })
                    }else {
                        this.setState({
                            dataSource: list
                        });
                    }
                }
                this.state.setState({
                    pageNum:(this.state.pageNum+1)
                })
            }
        })
    }
    sendMessage(e) {
        //阻止冒泡事件
        e.stopPropagation();
        //发送完成之后将消息区域滑到底部，输入框内容清空并聚焦
        setTimeout(()=>{
            ReactDOM.findDOMNode(this.lv).scrollTop = ReactDOM.findDOMNode(this.lv).scrollHeight;
            this.refs.textarea.value = "";
        },500);
        //输入框聚焦，弹起键盘
        this.refs.textarea.focus();
        //如果没有输入值，直接返回
        var value = this.refs.textarea.value;
        if (!value) {
            return;
        }
        //将时间转换为时间戳
        this.time = new Date().getTime();
        //将发出去的消息添加到聊天列表
        this.initData.push({content: value,time:getTimeHour(this.time)});
        this.setState({
            dataSource: this.initData,
        });
        var token = sessionStorage.getItem("token");
        var data = {
            "toUserId": this.item.anotherUserId||this.item.publishUserId,
            "toUserName": this.item.anotherUserName||this.item.publishUserName,
            "toUserAvatar": this.item.anotherUserAvatar||this.item.publishUserAvatar,
            "chatId":this.item.chatId,
            "token": token,
            "content": value,
        };
        if (this.socket.readyState === 1) {
            this.socket.send(JSON.stringify(data));
        } else {
            //do something
        }
        //通讯发生错误时触发,发送错误时消息前面有提示图标
        this.socket.onerror = function () {
            this.setState({
                isSendErr:true
            })
        }
    }
    changeState(e) {
        this.setState({
            value: e.target.value
        })
    }
    close(){
        //当滑动滚动区域时，收起键盘，将高度改回来
        this.refs.textarea.blur();
        this.refs.textarea.value = "";
        this.refs.textarea.height="0.6rem";
    }
    //点击立即购买，跳转到购买页
    order(e){
        e.stopPropagation();
        goNext(this,'order',this.item);
    }
    //渲染视图
    render() {
        var productImgs = this.item.productImgs && this.item.productImgs.split(",");
        return <div>
            <div ref="topDOM">
            <Title title={this.item.anotherUserName||this.item.publishUserName}
                   that={this}
                   style={{background:"#fff"}}
            />
            <div className="cm-flex cm-jc-sb cm-p-02  cm-bc-white detail-fixed"
                 onClick={()=>productImgs && productImgs[0]?goNext(this,"productDetail",this.item):undefined}>
            <div className="cm-flex cm-ai-c">
                {productImgs && productImgs[0]?
                    <img src={productImgs[0]} alt="" className="cm-img-10 cm-mr-02"/>:
                    <div className="cm-img-10 cm-mr-02 cm-c-999 cm-fs-026 cm-border-ddd cm-flex cm-ai-c cm-tx-c">该商品已下架</div>
                }
                <div>
                    <div className="cm-c-main cm-fs-028 cm-fw-bold">￥{this.item.productPrice?this.item.productPrice:"0.00"}</div>
                    <div className="cm-c-999 cm-fs-026 cm-mt-01">交易前聊一聊</div>
                </div>
            </div>
            <div className={(productImgs && productImgs[0]?"cm-btn-border-main":"cm-btn-border-999")+" cm-as-fe"}
                 onClick={(e)=>productImgs && productImgs[0]?this.order(e):undefined}>立即购买</div>
            </div>
            </div>
            <div ref={(el)=>this.lv=el} onTouchStart={()=>this.close()}
                 style={{overflow:"auto"}}
            >
                {<div style={{height:"40px",lineHeight:"40px"}} className="cm-tx-c cm-tx-c cm-c-999">{this.state.loadingText}</div>}
                {this.state.dataSource.map((item,rowID)=>{
                    return(
                        <div key={rowID} className="cm-p-030" >
                            {item.type === "received"?
                                <div className="cm-tx-c">
                                    <div className="cm-mtb-02">
                                        <span className="cm-p-006 cm-border-radius-10 cm-bc-ddd cm-c-white cm-fs-024">{item.time}</span>
                                    </div>
                                    <div className="cm-flex cm-ai-c cm-jc-fs">
                                        <img src={this.item.anotherUserAvatar||this.item.publishUserAvatar} alt="" className="cm-img-16 cm-as-fs cm-border-radius-half"/>
                                        <div className="cm-flex cm-flex-1">
                                            <div className="detail-triangle-right"></div>
                                            <div className="detail-chat-height cm-c-333 cm-tx-l detail-mr-06">{item.anotherContent||item.content}</div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="cm-tx-c">
                                    <div className="cm-mtb-02">
                                        <span className="cm-p-006 cm-border-radius-10 cm-bc-ddd cm-c-white cm-fs-024">{item.time}</span>
                                    </div>
                                    <div className="cm-flex cm-ai-c cm-jc-fe detail-ml-06">
                                        <div className="cm-flex cm-flex-1 cm-jc-fe cm-ai-c">
                                            {this.state.isSendErr?<img src={sendErr} alt="" className="cm-img-04"/>:null}
                                            <div className=" detail-chat-height cm-bc-main-transparent  cm-c-main  cm-tx-l">{item.content}</div>
                                            <div className="detail-triangle"></div>
                                        </div>
                                        <img src={this.user.userAvatar} alt="" className="cm-img-16 cm-as-fs cm-border-radius-half"/>
                                    </div>
                                </div>
                            }
                        </div>                        
                    )
                    
                })}
            </div>
            <div className="cm-bottom-position detail-bottom-height cm-bc-white">
                <textarea onChange={(e) => this.changeState(e)}
                              ref="textarea"
                              className="cm-border-ddd cm-border-radius-10 cm-mr-018 cm-flex-1 cm-p-036" name=""
                              id="" cols="30" rows="1" placeholder="与他聊天吧"></textarea>
                <span className="cm-btn-main-higher cm-fs-100 "
                      onClick={(e) => this.sendMessage(e)}>发 送</span>
            </div>
        </div>
    }
}