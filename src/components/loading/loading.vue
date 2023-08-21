<template>
    <view class="spinner">
        <view class="double-bounce1"></view>
        <view class="double-bounce2"></view>
        <view style="position: absolute; width: 100rpx; font-size: 24rpx; color: grey; opacity: 0.5; top: 0rpx; left: 50rpx">
            <text>加载中...</text>
        </view>
    </view>
</template>

<script>

// components/loading/loading.js
export default {
    data() {
        return {};
    },
    /**
     * 组件的属性列表
     */
    props: {},
    /**
     * 组件的方法列表
     */
    methods: {},
    created: function () {}
};
</script>
<style>
@import './loading.css';
</style>
