<template>
    <view class="container">
        <view class="title">
            <text>物流信息</text>
        </view>
        <view class="content">
            <view class="express" v-if="routeList.length > 0">
                <view class="express-num">
                    <text>快递类型：{{ expressCompany }}</text>
                </view>
                <view class="express-num">
                    <text>快递单号：{{ expressNum }}</text>
                </view>
            </view>
            <view v-if="routeList.length > 0" class="main-container">
                <block v-for="(item, index) in routeList" :key="index">
                    <view class="item">
                        <view v-if="index == 0" style="height: 220%" class="item-one item-one1">
                            <view>
                                <image src="/static/images/e1.png"></image>
                            </view>
                        </view>
                        <view v-else-if="index != routeList.length - 1" style="height: 150%" class="item-one">
                            <view>
                                <image src="/static/images/e2.png"></image>
                            </view>
                        </view>
                        <view v-else-if="index == routeList.length - 1" style="height: 100%" class="item-one">
                            <view>
                                <image src="/static/images/e2.png"></image>
                            </view>
                        </view>
                        <view v-if="index == 0" class="item-two item-two1">
                            <view class="route-title">
                                <text>{{ item.day }} {{ item.time }} {{ item.week }}</text>
                            </view>
                            <view class="route-content">
                                <text>【{{ item.accept_address }}】 {{ item.remark }}</text>
                            </view>
                        </view>
                        <view v-else class="item-two">
                            <view class="route-title">
                                <text>{{ item.day }} {{ item.time }} {{ item.week }}</text>
                            </view>
                            <view class="route-content">
                                <text>【{{ item.accept_address }}】 {{ item.remark }}</text>
                            </view>
                        </view>
                    </view>
                </block>
            </view>
        </view>
        <view style="height: 100rpx"></view>
        <view v-if="routeList.length <= 0">
            <text style="color: red; display: inline-block; margin-left: 40rpx">暂无相关物流信息！</text>
        </view>
    </view>
</template>

<script>
import headerCmp from '@/components/header/header';
import { tips } from '../../../utils/tips';
import { commonDomain as domain } from '../../../constant/common';
import { mine as route } from '../../../model/mine';
const myRoute = new route();
export default {
    components: {
        headerCmp
    },
    data() {
        return {
            domain: domain.domain_qupingce,
            expressNum: '',

            //快递单号
            routeList: [],

            //物流数据
            userInfo: null,

            expressCompany: ''
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (uni.getStorageSync('phoneNumber') == null || uni.getStorageSync('phoneNumber') == '') {
            tips.ERROR_401('您还没有登录');
        }
        let that = this;
        let expressNum = options.expressNum; //页面传递过来的快递单号
        let expressCompany = options.exprssCompany; //页面传递过来的快递公司
        let token = uni.getStorageSync('token'); //从缓存中获取token身份凭证
        let routeApi = '/order/logistics/sf'; //查询顺丰物流的api
        if (expressNum == null || expressNum == '' || expressCompany == '' || expressCompany == null) {
            tips.ERROR_500('暂无网络！');
        } else if (token == null || token == '') {
            tips.ERROR_401('登录过期！');
        } else {
            if (expressCompany != '顺丰快递') {
                routeApi = '/order/logistics/ot'; //查询其它物流的快递api
            }

            myRoute.getRoute(routeApi, token, expressNum, function (res) {
                if (res.status == '200') {
                    that.setData({
                        expressNum: expressNum,
                        userInfo: uni.getStorageSync('userInfo')
                    });
                    that.collectionData(res.data); //归纳这些路由数据
                } else {
                    tips.MODAL('物流异常', res.msg);
                }
            });
        }
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
    onPullDownRefresh: function () {
        //完成后关闭刷新
        uni.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    methods: {
        //归纳服务器返回的路由数据
        collectionData(data) {
            let mapList = new Map();
            let mapListArray = [];
            if (data.Head == 'OK') {
                for (let [index, value] of data.routeList.entries()) {
                    let key = value.day + ',' + value.week;
                    if (mapList.has(key)) {
                        mapList.get(key).push({
                            time: value.time,
                            remark: value.remark
                        });
                    } else {
                        let valueArray = [];
                        valueArray.push({
                            time: value.time,
                            remark: value.remark
                        });
                        mapList.set(key, valueArray);
                    }
                }
                for (let [K, V] of mapList.entries()) {
                    mapListArray.push({
                        key: K,
                        value: V,
                        length: V.length
                    });
                }
                this.setData({
                    routeList: mapListArray
                });
            } else {
                tips.ERROR_500('网络跑丢啦！#2');
            }
        }
    }
};
</script>
<style>
.container {
    width: 100%;
    background-color: #f7f6fb;
}

.title {
    position: relative;
    width: 92%;
    margin-left: auto;
    margin-right: auto;
    top: 20rpx;
}
.title text {
    color: #212123;
    font-size: 1.2em;
    font-weight: 600;
}
.content {
    width: 92%;
    margin: 50rpx auto;
    background-color: white;
    border-radius: 30rpx;
}
.express {
    position: relative;
    width: 94%;
    margin: 20rpx auto;
    top: 40rpx;
    height: 140rpx;
    border-bottom: 1rpx #c7c5c5 solid;
}
.express-num {
    margin: 30rpx auto 0 auto;
    font-size: 28rpx;
    color: #212123;
}

.express-num text {
    display: inline-block;
}

.main-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-top: 70rpx;
    /* align-items: center; */
}

.main-container .item {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: nowrap;
    margin-top: 80rpx;
    position: relative;
    margin-bottom: 60rpx;
}

.item .item-one {
    width: 3rpx;
    background: #cbcbcb;
    position: absolute;
    left: 60rpx;
    top: 10rpx;
}

.item .item-one view {
    width: 50rpx;
    height: 50rpx;
    overflow: hidden;
    position: relative;
    left: -23rpx;
    top: -60rpx;
    border-radius: 50%;
    /* background-image: linear-gradient(-90deg, #ffd40080 0%, #ff4d5a 64%);
  background: -webkit-linear-gradient(left, #d8ffad, #ff9508);
  background: -moz-linear-gradient(left, #d8ffad, #ff9508);
  background: -o-linear-gradient(left, #d8ffad, #ff9508);
  background: -ms-linear-gradient(left, #d8ffad, #ff9508); */
}
.item .item-one1 view {
    background-color: #fee0d6;
}
.item .item-one image {
    position: relative;
    z-index: 9999;
    width: 40rpx;
    height: 40rpx;
    left: 5rpx;
    top: 5rpx;
}

.item .item-two {
    width: 70%;
    position: relative;
    left: 40rpx;
    top: -30rpx;
    background-color: #fff;
    padding: 10rpx;
}
.item .item-two1 .route-title {
    color: #212123 !important;
}
.item-two .route-contant {
    font-size: 24rpx;
    color: #726f77;
    -webkit-font-smoothing: antialiased;
    font-family: helvetica, arial, tahoma, verdana;
}

.item-two .route-contant .pre-item {
    border-bottom: 1rpx dashed #ffc5c5;
    margin-bottom: 20rpx;
}

.pre-item image {
    width: 28rpx;
    height: 28rpx;
}

.item-two .route-title {
    font-family: 'Dosis', arial, tahoma, verdana;
    padding: 10rpx;
    color: #999999;
    margin: -20rpx -20rpx 0 -20rpx;
    position: relative;
    top: -20rpx;
    font-size: 30rpx;
}
.item-two1 .route-content {
    font-size: 27rpx;
    color: #212123 !important;
}
.item-two .route-content {
    font-size: 27rpx;
    color: #999999;
}
.item-two .route-title image {
    width: 40rpx;
    height: 40rpx;
    position: absolute;
    left: -30rpx;
    top: 20rpx;
    z-index: 9999999;
}
</style>
