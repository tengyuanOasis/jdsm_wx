<template>
    <!-- pages/showcountprice/showcountprice.axml -->
    <view class="container-showprice">
        <image class="bg-img" src="/static/images/evaluate_bg.png"></image>
        <view class="sec_con">
            <view class="question">
                <text style="font-weight: bold">{{ product_title.product_name }}</text>
            </view>

            <view class="price_content_text">
                <view class="price">预估报价</view>
                <view v-if="product_title.markup_money != 0" class="show_final_price">
                    ￥{{ final_price }}
                    <text style="font-size: 36rpx">(已加价{{ product_title.markup_money }}元)</text>
                </view>
                <view v-if="product_title.markup_money == 0" class="show_final_price">￥{{ final_price }}</view>

                <view class="per_cl">
                    回收
                    <text style="color: #fadf9c; font-weight: bold">价格高过{{ percent_pri }}%的同行</text>
                    商家，欢迎比价。
                </view>

                <view class="per_cl2">预计下月下跌{{ next_month_cut }}元</view>
            </view>

            <view class="detail-box">
                <view class="per_cl3_0">
                    <text class="per_cl3">估价详情</text>
                </view>

                <view class="detail-list" v-for="(item, index) in product_details" :key="index">
                    {{ Tool.backStr(product_details[index]) }}
                    ：

                    <text style="color: #999999">{{ Tool.backStr2(product_details[index]) }}</text>
                </view>
            </view>

            <view class="tips">注意：请确保您选择的机器描述与实际情况一致，否则可能导致议价或退回。</view>
            <!-- <button class="count_btn" bindtap="getAuthCode" type="primary" plain="{{false}}">立即换钱</button> -->

            <button v-if="phoneNumber" @tap="getPhoneNumber" class="button4 count_btn" size="default" type="button" :plain="false" primarySize="default">立即回收</button>
            <button v-else open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="button4 count_btn" size="default" type="button" :plain="false" primarySize="default">
                立即回收（授权手机号）
            </button>
        </view>
    </view>
</template>
<script module="Tool" lang="wxs">
var cutStr = function(val) {
  return val.replace("【",'').replace("】",'').replace(":",'：').split('：')[0]
}

var cutStr2 = function(val) {
  return val.replace("【",'').replace("】",'').replace(":",'：').split('：')[1]
}
module.exports = {
  backStr: cutStr,
  backStr2: cutStr2
}
</script>
<script>
import headerCmp from '@/components/header/header';
// pages/showcountprice/showcountprice.js
import { commonDomain as domain } from '../../constant/common';
const app = getApp();
export default {
    components: {
        headerCmp
    },
    data() {
        return {
            phoneNumber: '',
            //手机号
            product_title: {
                product_name: '',
                markup_money: 0
            },
            //机器基本信息
            final_price: 0,
            //报价
            old_final_price: 0,
            product_details: [],
            //选中详情

            //同行百分比
            percent_pri: '90',
            //下月预计跌
            next_month_cut: '99'
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let _key = '';
        uni.getStorage({
            key: 'product_title',
            success(res) {
                that.setData({
                    product_title: res.data
                });
                _key = res.data.product_name + '001';
                if (uni.getStorageSync('_key') != '') {
                    console.log('有缓存');

                    //取缓存
                    that.setData({
                        percent_pri: uni.getStorageSync('_key').split('-')[0],
                        next_month_cut: uni.getStorageSync('_key').split('-')[1]
                    });
                } else {
                    let val1 = that.random(85, 99);
                    let val2 = that.random(70, 230);
                    console.log('没有缓存');
                    uni.setStorageSync('_key', val1 + '-' + val2); //存缓存
                    that.setData({
                        percent_pri: val1,
                        next_month_cut: val2
                    });
                }
            }
        });
        uni.getStorage({
            key: 'Arry_name',
            success(res) {
                that.setData({
                    product_details: res.data
                });
            }
        });
        uni.getStorage({
            key: 'final_price',
            success(res) {
                that.setData({
                    final_price: res.data
                });
            }
        });
        uni.getStorage({
            key: 'old_final_price',
            success(res) {
                that.setData({
                    old_final_price: res.data
                });
            }
        });
        uni.getStorage({
            key: 'phoneNumber',
            success(res) {
                that.setData({
                    phoneNumber: res.data
                });
            }
        });
    },
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
    methods: {
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },

        getPhoneNumber: function (e) {
            let that = this;
            console.log('换钱');
            if (that.phoneNumber) {
                uni.navigateTo({
                    url: '/pages/orderpage/orderpage'
                });
            } else {
                if (e.detail.iv) {
                    uni.showLoading();
                    uni.request({
                        url: `${domain.domain_qupingce}/user/wx/getPhoneNumber`,
                        data: {
                            code: uni.getStorageSync('powerCode'),
                            encryptedData: e.detail.encryptedData,
                            iv: e.detail.iv
                        },
                        header: {
                            'Content-Type': 'applciation/json',
                            firm: 'jd'
                        },
                        method: 'get',
                        //get为默认方法/POST
                        success: function (r) {
                            uni.hideLoading();
                            if (r.data.code == 200) {
                                //console.log(r.data);
                                uni.setStorageSync('phoneNumber', r.data.token.phoneNumber);
                                that.setData({
                                    phoneNumber: r.data.token.phoneNumber
                                });
                                app.globalData.login();
                                setTimeout(() => {
                                    uni.hideLoading();
                                    uni.navigateTo({
                                        url: '/pages/orderpage/orderpage'
                                    });
                                }, 1000);
                            }
                        },
                        fail: function (err) {},
                        //请求失败
                        complete: function (r) {} //请求完成后执行的函数
                    });
                } else {
                    uni.showToast({
                        title: '请您先授权后再下单',
                        icon: 'none',
                        duration: 2000,
                        mask: true
                    });
                    return;
                }
            }
        }
    }
};
</script>
<style>
/* pages/showcountprice/showcountprice.wxss */
.container-showprice {
    background-color: rgb(255, 255, 255) !important;
    position: relative;
}

.bg-img {
    width: 100%;
    min-height: 550rpx;
    position: absolute;
    z-index: 1;
}

.sec_con {
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

.question {
    height: 100rpx;
    width: 100%;
    text-align: center;
    line-height: 100rpx;
    overflow: hidden;
    font-size: 32rpx;
}

.price_content_text {
    margin-bottom: 60rpx;
    display: block;
    text-align: center;
    width: 100%;
    font-size: 24rpx;
    color: white;
}

.price {
    font-weight: bold;
    margin-bottom: 30rpx;
}

.show_final_price {
    font-size: 60rpx;
    line-height: 60rpx;
    margin-bottom: 30rpx;
    font-weight: bold;
}

.per_cl {
    font-weight: bold;
    margin-bottom: 10rpx;
}

.per_cl2 {
    font-weight: bold;
}

.detail-box {
    position: relative;
    background: white;
    border-radius: 30rpx;
    min-height: 300rpx;
    font-size: 24rpx;
    width: 88%;
    margin-left: 6%;
    padding: 50rpx 0 30rpx 0;
}

.per_cl3_0 {
    top: -20rpx;
    position: absolute;
    display: block;
    text-align: center;
    opacity: 0.7;
    margin: auto;
    width: 100%;
}

.per_cl3 {
    padding: 15rpx 60rpx 15rpx 60rpx;
    font-weight: bold;
    font-size: 28rpx;
    border-radius: 10rpx;
    background: white;
    box-shadow: 0px 10px 10px #e8f5f1;
}

.detail-list {
    padding: 0 30rpx 0 30rpx;
    line-height: 50rpx;
}

.tips {
    -webkit-tap-highlight-color: transparent;
    font-family: 'Microsoft YaHei';
    list-style-type: none;
    text-decoration: none;
    outline: 0;
    display: block;
    height: auto;
    line-height: 40rpx;
    text-align: left;
    margin: 30rpx 20rpx 20rpx 0;
    margin-right: 20rpx;
    padding: 0 40rpx 40rpx 40rpx;
    font-size: 24rpx;
    color: #a2a2a2;
}

.count_btn {
    margin-left: 15%;
    padding: 25rpx;
    height: auto;
    background-image: linear-gradient(90deg, #89c7f9, #4ba7ec);
    color: white;
    font-size: 30rpx;
    width: 70%;
    border-radius: 40rpx;
}
</style>
