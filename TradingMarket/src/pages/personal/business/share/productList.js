import React from 'react';
import {Card} from '../../../../share';
import {getTimeFormat,goNext} from '../../../../utils';
//显示产品列表组件。在查看我发布、买到、卖出时用到
export default class ProductList extends React.Component {
    render() {
        const {dataList,TopArea,ButtonArea,NoData,self} = this.props;
        //dataList数据源信息 TopArea顶部区域内容 ButtonArea按钮区域内容 NoData无数据时显示内容
        return <div>
                <TopArea num={dataList && dataList.length}/>
                <div className="cm-plr-02">
                    {dataList && dataList.length>0?dataList.map((item,index)=>{
                            var productImgs = item.productImgs && item.productImgs.split(",");
                            var desc = item.productDesc && item.productDesc.slice(0,28);
                            return(
                                <Card key={index} onClick={()=>goNext(self,"productDetail",item)}>
                                    <div className="cm-flex cm-jc-sb cm-ai-c cm-plr-01 cm-ptb-02">
                                        <div className="cm-flex cm-ai-c">
                                            <img src={productImgs[0]} alt="" className="cm-img-14"/>
                                            <div className="cm-ml-02 cm-flex-1">
                                                <div className="cm-c-333 cm-fs-026">{desc}</div>
                                                <div className="cm-c-main cm-fs-030 cm-mt-02">￥{item.productPrice}</div>
                                                <div className="cm-c-999 cm-pt-02 cm-fs-022">{getTimeFormat(item.createTime)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <ButtonArea item={item}/>
                                </Card>
                            )
                        }):
                        <NoData/>
                    }
                </div>
            </div>
    }
}