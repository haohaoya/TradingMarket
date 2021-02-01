import index from "../images/tab-bottom/index-gray.png";
import indexAct from "../images/tab-bottom/index.png";
import publish from "../images/tab-bottom/pubilsh-gray.png";
import publishAct from "../images/tab-bottom/publish.png";
import msg from "../images/tab-bottom/message-gray.png";
import msgAct from "../images/tab-bottom/message.png";
import my from "../images/tab-bottom/my-gray.png";
import myAct from "../images/tab-bottom/my.png";

/**
 * history
 * 说明：将父组件的history传递到子组件  因为涉及到页面跳转,所以需要父组件的history
 * 类型：Object
 * 默认值：无
 */
export const defaultProps = {
    prefixCls:'s-tab-bottom',
    /**
     * 说明：数组，将底部的tab名称、路由等信息组合到tabList
     * 类型：Array
     * 默认值：[]
     */
    tabList:[
        /**
         * label
         * 说明：底部的tab名字
         * 类型：string
         * 默认值：""
         */
        /**
         * icon
         * 说明：未选中时的图标
         * 类型：string
         * 默认值：""
         */
        /**
         * iconAct
         * 说明：选中时的图标
         * 类型：string
         * 默认值：""
         */
        /**
         * path
         * 说明：点击tab之后跳转到对应的页面路径的名称
         * 默认值：""
         */
        //{label:"首页",icon:index,iconAct:indexAct,path:"index"},
    ],
    /**
     * 说明：默认选中的tab序号
     * 类型：Number
     * 默认值：0
     */
    activeNum:0
}