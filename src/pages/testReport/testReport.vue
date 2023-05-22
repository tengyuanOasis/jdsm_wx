<template>
    <view class="container test">
        <view class="title">
            <text>{{ name }}-验机报告</text>
        </view>
        <view>
            <view class="r-box">
                <view class="r-title">
                    <text>验机结果</text>
                </view>
                <view class="r-c">
                    <view class="r-c-i" :data-img="item.test_img" @tap="checkImage" v-for="(item, index) in main_data" :key="index">
                        <text style="color: #212123">{{ item.feature_name }}：</text>

                        <text style="color: #999999">{{ item.option_name }}</text>

                        <text style="color: #00935f; margin-left: 20rpx" v-if="item.isPass">通过</text>

                        <text style="color: #fa6334; margin-left: 20rpx" v-else>未通过</text>

                        <image v-if="item.isPass" src="/static/images/x2.png" />

                        <image v-else src="/static/images/x1.png" />
                    </view>
                </view>
            </view>
        </view>
        <view class="tip">
            <text>如有问题请联系客服，点击单列可查看图片</text>
        </view>
    </view>
    <!-- 提示 -->
    <!-- template没有找到这个wxml，已注释 -->
    <!-- <template is="UI-toast" :data="toastShow:toastShow, title: title"></template> -->
</template>

<script>
// pages/user/testReport/testReport.js
import { commonDomain as domain } from '../../constant/common';
export default {
    data() {
        return {
            domain: domain.domain_qupingce,
            main_data: {},
            machineCode: '',
            order_number: '',

            passOptions: {
                '95新': true,
                '99新': true,
                完美: true,
                无锁: true,
                全绿: true,
                无ID: true,
                正常: true
            },

            myorder_id: '',
            name: '',
            imei: '',
            toastShow: false,
            title: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        //只保留订单号里的数字
        this.setData({
            myorder_id: options.myorder_id,
            name: options.name,
            imei: options.imei
        });
        //
        this.getTest();
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getTest();
        //完成后关闭刷新
        uni.stopPullDownRefresh();
    },
    methods: {
        /**
         * 获取验机报告
         */
        getTest: function () {
            var that = this;
            uni.request({
                url: `${domain.domain_qupingce}/view/order/getOrderTest?order_id=` + that.myorder_id,
                headers: {
                    'Content-Type': 'applciation/json'
                },
                method: 'Post',
                success: function (r) {
                    if (r.data.status == 200) {
                        //加上是否折叠标志
                        for (let k = 0; k < r.data.data.length; k++) {
                            if (r.data.data[k].option_name == r.data.data[k].test_option_name) {
                                r.data.data[k].isPass = true;
                            } else {
                                r.data.data[k].isPass = false;
                            }
                        }
                        that.setData({
                            main_data: r.data.data
                        });
                        console.log(that.main_data);
                    } else {
                        my.alert({
                            title: '提示',
                            content: '暂无验机报告哦～',
                            confirmText: '我知道了',
                            success(res) {
                                setTimeout(function () {
                                    my.navigateBack();
                                }, 800);
                            }
                        });
                    }
                },
                fail: function (err) {},
                //请求失败
                complete: function (r) {} //请求完成后执行的函数
            });
        },

        //预览图片
        checkImage: function (event) {
            let that = this;
            let url = `${domain.domain_qupingce}` + event.target.dataset.img;
            console.log(url);
            uni.navigateTo({
                url: '/pages/testReport/checktestimg/checktestimg?url=' + encodeURIComponent(url)
            });
        },

        /**
         * 提示
         *
         */
        isShowToast: function (title) {
            this.setData({
                toastShow: true,
                title: title
            });
            var that = this;
            setTimeout(function () {
                that.setData({
                    toastShow: false
                });
            }, 1500);
        }
    }
};
</script>
<style>
.test {
    background-color: #f7f6fb;
}

.title {
    width: 100%;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    margin-left: 0;
    margin-top: 0;
    font-size: 32rpx;
    font-weight: 600;
}

.r-title {
    width: 350rpx;
    height: 60rpx;
    z-index: 999;
    margin-right: auto;
    margin-left: auto;
    margin-top: -90rpx;
    text-align: center;
    line-height: 60rpx;
    background-color: rgba(255, 255, 255, 0.3);
    padding: 10rpx;
    box-shadow: 2rpx 2rpx 10rpx rgb(218, 218, 230);
    border-radius: 20rpx;
}
.r-title text {
    color: #333;
    font-weight: 600;
}
.r-box {
    z-index: 1;
    width: 94%;
    height: auto;
    margin: 50rpx auto auto auto;
    background-color: white;
    padding-top: 50rpx;
    padding-bottom: 50rpx;
    border-radius: 30rpx;
}
.r-c {
    width: 94%;
    height: auto;
    margin: 50rpx auto;
}
.r-c .r-c-i {
    width: 100%;
    margin-top: 30rpx;
    overflow: hidden;
    display: block;
}
.r-c .r-c-i image {
    float: right;
    width: 30rpx;
    height: 30rpx;
}

.tip {
    width: 94%;
    margin: 50rpx auto;
    color: #999999;
    text-align: center;
    font-size: 0.7em;
}
</style>
