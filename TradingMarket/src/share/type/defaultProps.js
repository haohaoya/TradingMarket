function noop(){}
export const defaultProps = {
    prefixCls:'s-type',
    /**
     * 说明：类别数组
     * 类型：Array
     * 默认值：[]
     */
    typeList:[],
    /**
     * 说明：点击类型的回调事件
     * 类型：Function 参数：item
     * 默认值：(e:Object):void
     */
    onTypeClick:noop(),
};