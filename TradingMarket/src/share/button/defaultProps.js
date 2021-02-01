function noop(){}
export const defaultProps = {
    prefixCls:'s-button',
    /**
     * 说明：点击事件
     * 类型：点击按钮的回调函数
     * 默认值：（e.Object):void
     */
    onclick:noop,
    /**
     * 说明：按钮类型 可选值为primary/fill或不设
     * 类型：string
     * 默认值：primary
     */
    type:"",
    children:[],
    /**
     * 说明：样式类名
     * 类型：string
     * 默认值：无
     */
    className:""
};