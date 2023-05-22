<template>
    <!-- components/Dialog/dialog.wxml -->
    <!-- 弹框 -->
    <view class="wx_dialog_container" v-if="isShow">
        <view class="wx-mask" @tap.stop.prevent="hideFun"></view>
        <view class="wx-dialog">
            <view class="wx-dialog-title">{{ title }}</view>
            <view class="wx-dialog-content">{{ content }}</view>
            <view class="wx-dialog-footer" v-if="contact">
                <button class="wx-dialog-btn" open-type="contact" @tap.stop.prevent="cancelEventFun" v-if="cancelText">{{ cancelText }}</button>
                <button class="wx-dialog-btn" @tap.stop.prevent="confirmEventFun" v-if="confirmText">{{ confirmText }}</button>
            </view>
            <view class="wx-dialog-footer" v-else>
                <button class="wx-dialog-btn" @tap.stop.prevent="cancelEventFun" v-if="cancelText">{{ cancelText }}</button>
                <button class="wx-dialog-btn" @tap.stop.prevent="confirmEventFun" v-if="confirmText">{{ confirmText }}</button>
            </view>
        </view>
    </view>
</template>

<script>
// components/Dialog/dialog.js
export default {
    data() {
        return {
            // 弹窗显示控制
            isShow: false
        };
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    props: {
        // 弹窗标题
        title: {
            // 属性名
            type: String,
            // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            default: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
        },

        // 弹窗内容
        content: {
            type: String,
            default: '弹窗内容'
        },
        // 弹窗取消按钮文字
        cancelText: null,
        // 弹窗确认按钮文字
        confirmText: null,
        contact: null
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //隐藏弹框
        hideDialog() {
            this.setData({
                isShow: !this.isShow
            });
        },
        //展示弹框
        showDialog() {
            this.setData({
                isShow: !this.isShow
            });
        },
        //2秒后自动关闭
        autoHideDialog() {
            this.setData({
                isShow: !this.isShow
            });
            var that = this;
            setTimeout(function () {
                that.setData({
                    isShow: !that.isShow
                });
            }, 2000);
        },
        /*
         * 内部私有方法建议以下划线开头
         * triggerEvent 用于触发事件
         */
        cancelEventFun() {
            //触发取消回调
            this.$emit('cancelEvent');
        },
        confirmEventFun() {
            //触发成功回调
            this.$emit('confirmEvent');
        },
        hideFun() {
            this.$emit('hide');
        }
    },
    created: function () {}
};
</script>
<style>
/* components/Dialog/dialog.wxss */
.wx-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
}
.wx-dialog {
    position: fixed;
    z-index: 5000;
    width: 90%;
    max-width: 600rpx;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    text-align: center;
    border-radius: 18rpx;
    overflow: hidden;
    /* border: 6rpx solid #fcd9663b; */
    box-shadow: 0rpx 0rpx 40rpx #838383;
}
.wx-dialog-title {
    background-color: #4ba7ec;
    font-size: 34rpx;
    padding: 10rpx 10rpx 10rpx;
    font-weight: bold;
    color: #fff;
}
.wx-dialog-content {
    padding: 45rpx 45rpx 45rpx;
    min-height: 60rpx;
    font-size: 28rpx;
    line-height: 2.5;
    word-wrap: break-word;
    word-break: break-all;
    color: #000000;
}
.wx-dialog-footer {
    display: flex;
    align-items: center;
    position: relative;
    line-height: 90rpx;
    font-size: 24rpx;
}
.wx-dialog-footer::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 2rpx;
    border-top: 2rpx solid #d5d5d6;
    color: #d5d5d6;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
}
.wx-dialog-btn {
    display: block;
    -webkit-flex: 1;
    flex: 1;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    position: relative;
    padding-bottom: 1em;
    padding-top: 1em;
    font-size: 26rpx;
}
.wx-dialog-footer .wx-dialog-btn:nth-of-type(1) {
    color: #838383;
}
.wx-dialog-footer .wx-dialog-btn:nth-of-type(2) {
    color: #c3796a;
}
.wx-dialog-footer .wx-dialog-btn:nth-of-type(2):after {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    width: 2rpx;
    bottom: 0;
    border-left: 2rpx solid #d5d5d6;
    color: #d5d5d6;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
}
</style>
