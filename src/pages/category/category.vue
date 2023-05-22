<template>
    <view style="height: 100%">
        <view style="height: 30rpx"></view>

        <!-- 搜索框 -->
        <view class="searchctl" @tap="toKeySearch">
            <image src="/static/images/l_search.png" style="width: 30rpx; height: 30rpx; margin-right: 20rpx"></image>
            <text>搜索你想要回收的产品型号</text>
        </view>

        <mainproduct-cmp></mainproduct-cmp>

        <kefu-cmp></kefu-cmp>
    </view>
</template>

<script>
import mainproductCmp from '@/components/mainproduct/mainproduct';
import kefuCmp from '@/components/kefuservice/kefuservice';
// pages/category/category.js
export default {
    components: {
        mainproductCmp,
        kefuCmp
    },
    data() {
        return {};
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {},
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
    onPullDownRefresh: function () {
        uni.reLaunch({
            url: '/' + this.route
        });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    methods: {
        toKeySearch: function () {
            uni.navigateTo({
                url: '/pages/search/search'
            });
        }
    }
};
</script>
<style>
/* pages/category/category.wxss */

page {
    background: white;
}

.searchctl {
    width: 90%;
    margin-left: 5%;
    background: #f3f3f3;
    height: 64rpx;
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    flex-direction: row;
    font-size: 26rpx;
    color: #999999;
    justify-content: center;
}
</style>
