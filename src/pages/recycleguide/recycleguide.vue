<template>
    <view style="height: 100%">
        <!-- pages/recycleguide/recycleguide.wxml -->
        <!-- 回收指南 -->
        <!-- 
<header-cmp isShow="false">
  <view slot="question">
    <text>回收指南</text>
  </view>
</header-cmp>


<view class="pic">
  <listmessage-cmp>
    <text slot="before" style="color:#999999;font-size:35rpx;">回收流程示意图</text>
  </listmessage-cmp>

  <view class="container">
    <view class="onetap">
      <image src="/images/sj.png" style="width:55rpx;height:55rpx" />
      <text>选择机型</text>
    </view>

    <view class="onetap">
      <image src="/images/jsq.png" style="width:55rpx;height:55rpx" />
      <text>免费估价</text>
    </view>

    <view class="onetap">
      <image src="/images/bg.png" style="width:55rpx;height:55rpx" />
      <text>下单发货</text>
    </view>

    <view class="onetap">
      <image src="/images/zz.png" style="width:55rpx;height:55rpx" />
      <text>验货打款</text>
    </view>
  </view>
</view> -->

        <view style="font-size: 24rpx">
            <view style="color: orangered; font-size: 30rpx; font-weight: bold">温馨提示：</view>
            <view>验机过程中，针对iPhone 13以下系列的苹果手机，会拆机确认主板是否进水，维修（正常在保机器不拆机，可直接联系客服确认）</view>
        </view>

        <view class="im">
            <image src="/static/images/use_pic.jpg" style="width: 730rpx; height: 1500rpx" />
        </view>
    </view>
</template>

<script>
import headerCmp from '@/components/header/header';
import listmessageCmp from '@/components/listmessage/listmessage';
// pages/recycleguide/recycleguide.js
export default {
    components: {
        headerCmp,
        listmessageCmp
    },
    data() {
        return {};
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    methods: {}
};
</script>
<style>
/* pages/recycleguide/recycleguide.wxss */

page {
    font-family: '微软雅黑';
    width: 94%;
    margin: auto;
}

.container {
    background: white;
    height: 130rpx;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
}

.pic {
    /* padding-top: 125rpx; */
}

.container .onetap {
    font-size: 25rpx;
    color: #666;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.im {
    width: 100%;
    text-align: center;
}
</style>
