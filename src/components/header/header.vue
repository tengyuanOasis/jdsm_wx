<template>
    <!-- components/header/header.wxml -->
    <!-- 置顶搜索框 -->
    <view :class="headerclass">
        <!-- 导航部分前段插槽 -->
        <view class="title-img">
            <slot name="before"></slot>
        </view>
        <!-- 导航部分中段插槽 -->
        <view v-if="isShow == 'true'" class="fake_input" @tap="mainsearch">
            <slot name="middle"></slot>
        </view>
        <view v-else class="common-question">
            <slot name="question"></slot>
        </view>
        <!-- 导航部分后段插槽 -->
        <view class="mine-logo">
            <slot name="after"></slot>
        </view>
    </view>
</template>

<script>
// components/header/header.js
export default {
    data() {
        return {};
    },
    options: {
        multipleSlots: true //开启使用插槽
    },
    externalClasses: ['bg'],
    /**
     * 组件的属性列表
     */
    props: {
        isShow: {
            type: String,
            default: 'true'
        },
        headerclass: {
            type: String,
            default: 'header'
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        mainsearch: function () {
            uni.navigateTo({
                url: '/pages/search/search'
            });
        }
    },
    created: function () {}
};
</script>
<style>
/* components/header/header.wxss */

page {
    font-family: '微软雅黑';
}

.header {
    height: 100rpx;
    /* background-image: -webkit-gradient(linear, left top, right bottom, color-stop(0, #FFEF38), color-stop(1, #ffb400)); */
    background-color: #fff;
    font-weight: bolder;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 99;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-bottom: 2rpx solid #f1f1f1;
}

.header view {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title-img {
    /* 没有图片也占位 */
}

/* .title-img img {
  width: 200rpx;
  height: 100rpx;
} */

.mine-logo {
    /* 没有图片也占位 */
    text-align: center;
    vertical-align: center;
    /* width: 64rpx;
  height: 64rpx; */
}

.header view > image {
    /* width: 80rpx;
  height: 100rpx; */
}

.fake_input {
    width: 95%;
    color: gray;
    border-radius: 10rpx;
    background-color: #f3f3f3;
    font-size: 24rpx;
    height: 64rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    margin-left: 5%;
    margin-right: 3%;
}

.fake_input view {
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    text-align: center;
}

.fake_input view image {
    width: 30rpx;
    height: 30rpx;
}

.fake_input view text {
    margin-right: 50rpx;
    margin-left: 20rpx;
}

.common-question {
    font-size: 36rpx;
    width: 100%;
    text-align: center;
}
.question {
    font-weight: bolder;
}
.question text {
    font-weight: bolder;
}
</style>
