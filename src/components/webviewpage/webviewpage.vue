<template>
    <view style="height: 100%">
        <!-- components/webviewpage/webviewpage.wxml -->
        <!-- 网页跳转转发 -->
        <web-view :src="paramUrl"></web-view>
    </view>
</template>

<script>
// components/webviewpage/webviewpage.js
export default {
    data() {
        return {};
    },
    /**
     * 组件的属性列表
     */
    props: {
        paramUrl: String //页面跳转路径
    },
    /**
     * 组件的方法列表
     */
    methods: {},
    created: function () {}
};
</script>
<style>
/* components/webviewpage/webviewpage.wxss */
</style>
