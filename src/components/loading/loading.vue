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
.spinner {
    width: 40rpx !important;
    height: 40rpx !important;
    position: relative;
}

.double-bounce1,
.double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #ffeb3c;
    opacity: 0.7;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-animation: bounce 2s infinite ease-in-out;
    animation: bounce 2s infinite ease-in-out;
}

.double-bounce2 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
}

@-webkit-keyframes bounce {
    0%,
    100% {
        -webkit-transform: scale(0);
    }

    50% {
        -webkit-transform: scale(1);
    }
}

@keyframes bounce {
    0%,
    100% {
        transform: scale(0);
        -webkit-transform: scale(0);
    }

    50% {
        transform: scale(1);
        -webkit-transform: scale(1);
    }
}
</style>
