<template>
    <view style="height: 100%">
        <!-- 用户晒单 -->
        <!-- <header-cmp isShow="false">
  <view slot="question">
    <text>全部待发货订单</text>
  </view>
</header-cmp> -->
        <view style="width: 100%; height: 10rpx; opacity: 0.001"></view>
        <view class="container">
            <block>
                <view class="single-tip">
                    <view class="tip-box">
                        <text class="title">批量发货说明：</text>
                        <text class="text1">1.批量发货意味着您只需邮寄一个包裹，可发货多个回收订单</text>
                        <text class="text1">2.批量发货订单的物流单号将会统一设置为您发货的物流单号</text>
                        <text class="text1">3.多个机器邮寄物品贵重，建议妥善包装并使用顺丰运送</text>
                        <text class="text1">4.最多可同时勾选5个订单进行批量发货</text>
                    </view>
                </view>
            </block>
            <view class="order-box">
                <block v-for="(it, index) in allOrders" :key="index">
                    <view class="single-order" :data-number="it.order_number" @tap="choseFun">
                        <image class="main-img" :src="domain + it.img"></image>
                        <view class="center">
                            <text class="title">{{ it.version_name }}</text>
                            <text class="text1">订单编号：{{ it.order_number }}</text>
                            <text class="text1">下单时间：{{ it.seller_time }}</text>
                            <text class="text1 price">回收价格：{{ it.secondary_recycle == 0 ? it.recycle_money : it.secondary_recycle }}</text>
                        </view>
                        <view class="right">
                            <image v-if="it.isChose" src="/static/images/hook2.png"></image>
                            <image v-if="!it.isChose" src="/static/images/un_hook2.png"></image>
                        </view>
                    </view>
                </block>
            </view>
            <view class="save-btn" @tap="commit">已选择{{ choseArray.length }}个订单，立即发货</view>
        </view>
        <!-- <kefu-cmp>
</kefu-cmp> -->
    </view>
</template>

<script>
import headerCmp from '@/components/header/header';
import listmessageCmp from '@/components/listmessage/listmessage';
import kefuCmp from '@/components/kefuservice/kefuservice';
// pages/mulitSendOut/mulitSendOut.js
import { tips } from '../../utils/tips';
import { commonDomain as domain } from '../../constant/common';
import { dateTimePicker, getMonthDay } from '../../utils/util';
const app = getApp();
export default {
    components: {
        headerCmp,
        listmessageCmp,
        kefuCmp
    },
    data() {
        return {
            domain: domain.domain_qupingce,
            choseArray: [],

            //选中的订单号数组
            //待发货订单
            allOrders: [],

            dataLoad: false,

            it: {
                order_number: '',
                img: '',
                version_name: '',
                seller_time: '',
                secondary_recycle: 0,
                recycle_money: '',
                isChose: ''
            }
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getOrders();
    },
    /* 下拉刷新 */
    onPullDownRefresh: function () {
        this.getOrders();
        uni.stopPullDownRefresh();
    },
    methods: {
        //获取全部订单，并只取出待发货的订单
        /**
         * 获取近期订单
         *
         */
        getOrders: function () {
            var token = uni.getStorageSync('token');
            var that = this;
            that.setData({
                dataLoad: true
            });
            uni.request({
                url: `${domain.domain_qupingce}/view/order/getOrdersByUser`,
                data: {
                    token: token
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                dataType: 'json',
                method: 'POST',
                //get为默认方法/POST
                success: function (r) {
                    that.setData({
                        dataLoad: false
                    });
                    if (r.data.status == 200) {
                        //筛选出待发货的订单
                        let tempArray = [];
                        for (let k in r.data.data) {
                            if (r.data.data[k].order_status == 'waitdelivery') {
                                r.data.data[k].isChose = false;
                                tempArray.push(r.data.data[k]);
                            }
                        }
                        console.log(tempArray);
                        that.setData({
                            allOrders: tempArray
                        });
                    }
                },
                fail: function (err) {},
                //请求失败
                complete: function (r) {} //请求完成后执行的函数
            });
        },

        //勾选函数
        choseFun: function (e) {
            let that = this;
            let crtId = e.currentTarget.dataset.number;
            let datas = that.allOrders;
            let choseArray = [];
            for (let i in datas) {
                if (datas[i].order_number == crtId) {
                    //选中状态取反
                    datas[i].isChose = !datas[i].isChose;
                }
                //将选中的订单存起来
                if (datas[i].isChose) {
                    let temp = {
                        seller_time: datas[i].seller_time,
                        number: datas[i].order_number,
                        name: datas[i].version_name,
                        price: datas[i].secondary_recycle == 0 ? datas[i].recycle_money : datas[i].secondary_recycle
                    };
                    choseArray.push(temp);
                }
            }
            that.setData({
                allOrders: datas,
                choseArray: choseArray
            });
            // choseArray = JSON.stringify(choseArray)
            console.log(choseArray);
        },

        //提交
        commit: function () {
            let that = this;
            let param = that.choseArray;
            if (param.length > 5) {
                uni.showToast({
                    title: '最多5个订单',
                    icon: 'none'
                });
                return;
            }
            if (param.length < 1) {
                uni.showToast({
                    title: '至少选择一个订单',
                    icon: 'none'
                });
                return;
            }
            uni.showActionSheet({
                itemList: ['在线预约顺丰上门取件（推荐）', '自行发货填写单号，限顺丰快递'],
                success(res) {
                    if (res.tapIndex == 0) {
                        uni.redirectTo({
                            url: '/pages/onlineexpress/onlineexpress?orders=' + JSON.stringify(param)
                        });
                    } else if (res.tapIndex == 1) {
                        uni.redirectTo({
                            url: '/pages/sellerexpress/sellerexpress?orders=' + JSON.stringify(param)
                        });
                    }
                }
            });
        }
    }
};
</script>
<style>
/* pages/mulitSendOut/mulitSendOut.wxss */
page {
    font-family: '微软雅黑';
    width: 100%;
}

.container {
    width: 100%;
    background-color: #f8f8f8;
}

.tip-box {
    width: 92%;
    margin: 0 auto;
}
.single-tip {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 20rpx;
    margin: 18rpx 0;
    border-radius: 8rpx;
    box-shadow: 5rpx 5rpx 10rpx rgba(179, 190, 209, 0.1);
}
.single-tip text {
    display: block;
}
.order-box {
    width: 92%;
    margin: 0 auto;
}
.single-order {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 35rpx 15rpx 35rpx 25rpx;
    margin: 18rpx 0;
    border-radius: 8rpx;
    box-shadow: 5rpx 5rpx 10rpx rgba(179, 190, 209, 0.1);
}
.main-img {
    width: 130rpx;
    height: 130rpx;
}
.single-order text {
    display: block;
}
.center {
    /* background-color: rgb(84, 230, 198); */
    width: 65%;
}
.title {
    font-weight: bold;
    font-size: 34rpx;
    padding-bottom: 8rpx;
}
.text1 {
    font-size: 22rpx;
    color: rgb(174, 189, 197);
}
.price {
    color: #b55946;
    font-weight: bold;
}
.right image {
    width: 36rpx;
    height: 36rpx;
}

.save-btn {
    margin: 100rpx auto;
    text-align: center;
    background-color: #b55946;
    width: 65%;
    padding: 15rpx 10rpx;
    border-radius: 50rpx;
    color: #fff;
    box-shadow: 5rpx 5rpx 20rpx rgba(146, 90, 77, 0.5);
}
</style>
