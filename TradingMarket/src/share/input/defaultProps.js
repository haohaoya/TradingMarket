function noop() {}
export const defaultProps = {
    prefixCls:'s-input',
    onClick:noop,
    label:"",
    /**
     * 说明：文本框提示
     * 类型：string
     * 默认值：无
     */
    placeholder:"",
    /**
     * 说明：文本框类型
     * 类型：any
     * 默认值：text
     */
    type:"",
    /**
     * 说明：左边的图标路径
     * 类型：string
     * 默认值：无
     */
    src:"",
    /**
     * 说明：右边渲染的元素
     * 类型：HTML元素
     * 默认值：null
     */
    renderRight:null,
    className:"",
    /**
     * 说明：文本框输入值长度
     * 类型：Number
     * 默认值：1
     */
    maxLength:11,
    /**
     * 说明：文本框样式
     * 类型：Object
     * 默认值：无
     */
    style:{}
};