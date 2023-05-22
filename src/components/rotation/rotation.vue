<template>
    <!-- components/rotation/rotation.wxml -->
    <!-- 首页轮播图组件 -->
    <view class="ban">
        <image class="swiper-item" src="/static/images/share_img.jpg" style="width: 90%; height: 300rpx; border-radius: 10rpx"></image>
    </view>
</template>

<script>
// components/rotation/rotation.js
import { commonDomain as domain } from '../../constant/common';
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
.ban {
    width: 100%;
    height: 300rpx;
    text-align: center;
    margin-top: 42rpx;
    margin-bottom: 42rpx;
}
</style>
