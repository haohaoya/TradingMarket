import React from 'react';
import {Title,TabBottom} from '../../../share';
import {getData, goNext,getTime} from '../../../utils';
export default class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList:[]//初始化聊天列表
        }
    }
    componentDidMount(){
        //获取聊天列表信息
        this.getChatList();
    }
    //进入聊天详情页
    goDetail(item) {
        goNext(this, 'messageDetail',item);
    }
    //获取聊天列表信息
    getChatList(){
        getData({
            method: 'post',
            url: 'getChatList',
            data: {},
            successCB: (res) => {
                this.setState({
                    messageList:res.result.list
                })
            }
        })
    }
    //渲染视图
    render() {
        return <div>
            <Title title="消息" isHome={true}/>
            <div className="cm-mlr-02">
                {this.state.messageList.length>0?this.state.messageList.map((item,index)=>{
                    var productImgs = (item.productImgs && item.productImgs.split(","))||[];
                    var lastChatContent = item.lastChatContent && item.lastChatContent.slice(0,35);
                    return(
                    <div className="cm-flex cm-ai-c" key={index} onClick={()=>this.goDetail(item)}>
                        <img src={item.anotherUserAvatar} alt="" className="cm-img-08 cm-mr-02 cm-mt-02 cm-as-fs cm-border-radius-10"/>
                        <div className="cm-flex cm-ai-c cm-jc-sb cm-flex-1 cm-border-bottom-ddd cm-ptb-02">
                        <div className="cm-flex-1">
                            <div className="cm-c-333 cm-fw-bold cm-fs-028">{item.anotherUserName}</div>
                            <div className="cm-c-666 cm-fs-026">{lastChatContent}</div>
                            <div className="cm-c-999 cm-mt-01 cm-fs-024">{getTime(item.updateTime)}</div>
                        </div>
                            {productImgs[0]?
                            <img src={productImgs[0]} alt="" className="cm-img-12"/>:
                                <div className="cm-img-12 cm-c-999 cm-fs-026 cm-border-ddd cm-flex cm-ai-c cm-tx-c">该商品已下架</div>
                            }
                        </div>
                    </div>
                    )
                    }):<div className="cm-tx-c cm-mt-080 cm-c-666">暂无消息</div>}
            </div>
            <div style={{height:'50px'}}>
            <TabBottom history={this.props.history} activeNum={2}/>
            </div>
        </div>
    }
}