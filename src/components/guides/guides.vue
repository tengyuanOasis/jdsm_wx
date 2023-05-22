<template>
    <view style="height: 100%">
        <!-- components/guides/guides.wxml -->
        <!-- 首页回收指引 -->
        <!-- <listmessage-cmp tipclass="bgs">
  <text slot="before" style="font-size: 35rpx;font-weight:bold;position:absolute;left:5%">回收流程</text>
  <navigator slot="after" url="/pages/questionguide/questionguide" style="color:#000;font-size:24rpx;font-weight:bold" bindtap="clearBrand">Q&A</navigator>
</listmessage-cmp> -->

        <view class="tx">
            <view class="tx-tx">回收流程</view>
        </view>

        <view class="container">
            <view class="onetap">
                <image src="/static/images/sj.png" style="width: 55rpx; height: 55rpx" />
                <text>选择机器</text>
            </view>

            <view class="onetap">
                <image src="/static/images/jsq.png" style="width: 55rpx; height: 55rpx" />
                <text>机况估价</text>
            </view>

            <view class="onetap">
                <image src="/static/images/bg.png" style="width: 55rpx; height: 55rpx" />
                <text>下单发货</text>
            </view>

            <view class="onetap">
                <image src="/static/images/zz.png" style="width: 55rpx; height: 55rpx" />
                <text>验货打款</text>
            </view>
        </view>
        <!-- <view class="promisecl">
  <image src="./images/promise.jpg" style="width:88%;height:260rpx;" />
</view> -->
    </view>
</template>

<script>
import listmessageCmp from '@/components/listmessage/listmessage';
// components/guides/guides.js
export default {
    components: {
        listmessageCmp
    },
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
/* components/guides/guides.wxss */
page {
    font-family: '微软雅黑';
}
.container {
    width: 90%;
    margin: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    padding: 10rpx 20rpx 40rpx 10rpx;
    background-color: #fff;
}

.container .onetap {
    font-weight: bold;
    font-size: 25rpx;
    width: 180rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 45rpx;
}
.onetap image {
    /* opacity: .7; */
}
.onetap text {
    color: gray;
    font-weight: normal;
}

.promisecl {
    padding-top: 20rpx;
    width: 100%;
    height: 260rpx;
    background: white;
    text-align: center;
    margin-bottom: 0rpx;
}
.tx-tx {
    text-align: center;
    width: 200rpx;
    font-size: 17px;
    font-weight: bold;
    margin-left: 20rpx;
}

.tx-im {
    margin-top: 16rpx;
    width: 200rpx;
    height: 8rpx;
    margin-left: 20rpx;
    /* background-color: orange; */
    background-image: linear-gradient(-200deg, #f62604, #fea531, #fed35e, #fbe5c5);
    border-radius: 50%;
    /* box-shadow: 5rpx 5rpx 10rpx orange; */
    opacity: 0.6;
}
</style>
