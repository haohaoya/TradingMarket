function noop(){}
export const defaultProps = {
    prefixCls:'s-address',
    /**
     * 说明：关闭地址选择框时的回调函数
     * 类型：Function
     * 默认值：无
     */
    closeModel:noop,
    /**
     * 说明：获取地址信息。选择好地址时自动调用的函数。
     * 类型：Function 参数：obj(province,city,district,street) 选择好的地址信息
     * 默认值：无
     */
    getAddress:noop,
    /**
     * 说明：标题右边文字
     * 类型：string
     * 默认值：无
     */
    leftTitle:""
};