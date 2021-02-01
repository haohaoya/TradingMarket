import search from '../images/search/search.png';
import close from '../images/search/close.png';
function noop(){}
export const defaultProps = {
    prefixCls:'s-search',
    /**
     * 说明：文本框提示文字
     * 类型：string
     * 默认值：空
     */
    placeholder:'',
    /**
     * 说明：点击搜索图标触发的事件
     * 类型：Function
     * 默认值：(e:Object):void
     */
    OnSearch:noop,
    /**
     * 说明：点击右边图标触发事件
     * 类型：Function
     * 默认值：(e:Object):void
     */
    OnRightClick:noop,
    /**
     * 说明：搜索图标
     * 类型：string
     * 默认值：默认图标
     */
    searchIcon:search,
    /**
     * 说明：关闭的图标
     * 类型：string
     * 默认值：默认图标
     */
    closeIcon:close,
    /**
     * 说明：右边的图标
     * 类型：string
     * 默认值：默认图标
     */
    rightIcon:""
};