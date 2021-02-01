function noop(){}
export const defaultProps = {
    prefixCls:'s-select',
    /**
     * 说明：选项数组
     * 类型：Array
     * 默认值：[]
     */
    options:[],
    /**
     * 说明：选项标题
     * 类型：string
     * 默认值：无
     */
    babel:"",
    /**
     * 说明：选中某一行的点击事件
     * 类型：Function
     * 默认值：无
     */
    onChange:noop
};