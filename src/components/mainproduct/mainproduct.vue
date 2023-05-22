<template>
    <view class="container">
        <view class="navigation">
            <view :class="signClass == 'phone' ? 'item-sign-flag' : ''" @tap="changeType" data-type="phone">手机</view>
            <view :class="signClass == 'pad' ? 'item-sign-flag' : ''" @tap="changeType" data-type="pad">平板</view>
            <view :class="signClass == 'computer' ? 'item-sign-flag' : ''" @tap="changeType" data-type="computer">笔记本</view>
            <view :class="signClass == 'digital' ? 'item-sign-flag' : ''" data-type="digital" @tap="changeType">智能数码</view>
        </view>
        <!-- main产品数据 -->
        <view class="main-container" v-if="flag == 'main'">
            <view class="left-brand">
                <scroll-view scroll-y :style="'width:200rpx;height:' + (windowHeight - 100) * 2 + 'rpx;'" :scroll-with-animation="true">
                    <!-- <view class="item {{brandId==0?'sign':''}}" data-brand-id="0"  bindtap="changeBrandItemBymain">
          <image src="../../images/duck1.png" style="width:50rpx;height:46rpx;margin-left:6rpx;margin-right:6rpx;margin-top:5rpx"></image>
          <text>全部</text>
        </view> -->
                    <block v-for="(item, index) in brandList" :key="index">
                        <view :class="'item ' + (item.brandId == brandId ? 'sign' : '')" :data-brand-id="item.brandId" @tap="changeBrandItemBymain">
                            <image :src="domainName + item.img"></image>
                            <text>{{ item.brandName }}</text>
                        </view>
                    </block>
                </scroll-view>
            </view>
            <view class="right-product">
                <scroll-view scroll-y :style="'height:' + (windowHeight - 100) * 2 + 'rpx;'" :scroll-with-animation="true" @scrolltolower="loadMore">
                    <block v-for="(item, index) in productList" :key="index">
                        <view :data-version-id="item.versionId" @tap="gotoCountPrice" class="right-pre-item">
                            <image :src="domainName + item.img"></image>
                            <text>{{ item.versionName }}</text>
                            <!-- <view wx:if="{{item.ismarkup == 2}}" class="active-mark">限时加价</view> -->
                        </view>
                    </block>
                    <!-- 加载动画 -->
                    <!-- <view wx:if="{{isShow}}" class="loading"><loading-cmp></loading-cmp></view> -->
                </scroll-view>
            </view>
        </view>
        <!-- 智能数码产品数据 -->
        <view v-if="flag == 'digital'" class="main-container">
            <view class="left-brand">
                <scroll-view scroll-y :style="'width:200rpx;height:' + (windowHeight - 100) * 2 + 'rpx;'" :scroll-with-animation="true">
                    <block v-for="(item, index) in typeList" :key="index">
                        <view
                            :class="'item ' + (item.type_id == typeId ? 'sign' : typeId == '' && index == 0 ? 'sign' : '')"
                            :data-type-id="item.type_id"
                            :data-type-name="item.type_name"
                            @tap="changeBrandItemByDigital"
                        >
                            <text style="margin-left: 30rpx">{{ item.remark_name }}</text>
                        </view>
                    </block>
                </scroll-view>
            </view>
            <view class="right-product">
                <scroll-view scroll-y :style="'height:' + (windowHeight - 100) * 2 + 'rpx;'" :scroll-with-animation="true" @scrolltolower="loadMoreDigital">
                    <block v-for="(item, index) in digitalBrandList" :key="index">
                        <view @tap="gotoDigitalList" :data-brand-id="item.brand_id" class="right-pre-item">
                            <image :src="domainName + item.brand_img" :lazy-load="true"></image>
                            <text>{{ item.brand_name }}</text>
                        </view>
                    </block>
                    <!-- 加载动画 -->
                    <!-- <view wx:if="{{isShow}}" class="loading2"><loading-cmp></loading-cmp></view> -->
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script>
import loadingCmp from '@/components/loading/loading';
import { tips } from '../../utils/tips';
import { commonDomain as domain } from '../../constant/common';
export default {
    components: {
        loadingCmp
    },
    data() {
        return {
            domainName: '',
            signClass: 'phone',
            brandId: '85001ac13f7e4c56ab949328165e0ed6',
            flag: 'main',
            type: 'phone',
            typeId: '',
            typeName: '',
            brandList: [],
            productList: [],
            typeList: [],
            digitalBrandList: [],
            windowHeight: 555,
            page: 1,
            limit: 15,
            total: 0,
            isShow: false
        };
    },
    /**
     * 组件的属性列表
     */
    props: {},
    methods: {
        attached: function () {
            var that = this;
            var clientInfo = uni.getSystemInfoSync();
            var windowHeight = clientInfo.windowHeight;
            if (clientInfo.model == 'PAHM00' || clientInfo.model == 'PAFM00' || clientInfo.model == 'PAFT00') {
                windowHeight = 680;
            }
            try {
                let brandId = uni.getStorageSync('brandId');
                let the_type = uni.getStorageSync('the_type');
                if (brandId == null || brandId == '') {
                    brandId = '85001ac13f7e4c56ab949328165e0ed6';
                }
                if (the_type == null || the_type == '') {
                    the_type = 'phone';
                }
                that.setData({
                    brandId: brandId,
                    signClass: the_type,
                    type: the_type,

                    //@hbp
                    domainName: domain.domain_qupingce,

                    windowHeight: windowHeight < 555 ? 555 : windowHeight
                });
            } catch (e) {
                console.log('CatchClause', e);
                console.log('CatchClause', e);
                tips.ERROR_500();
            }
            that.initMainProduct();
            uni.removeStorageSync('brandId'); //把缓存里面的数据清空
            uni.removeStorageSync('the_type'); //把缓存里面的数据清空@hbp
        },

        loadMore: function () {
            let that = this;
            if (that.page + 1 <= this.total) {
                that.setData({
                    page: that.page + 1
                });
                uni.showLoading({
                    content: '加载中～'
                });
                uni.request({
                    url: `${domain.domain_qupingce}/page/ChooseTypeByBrandByPage`,
                    method: 'GET',
                    data: {
                        type: that.type,
                        brandId: that.brandId,
                        page: that.page,
                        limit: that.limit,
                        company: 'jd'
                    },
                    success: function (res) {
                        if (res.statusCode == 200) {
                            if (res.data.status == 200) {
                                that.setData({
                                    productList: that.productList.concat(res.data.data),
                                    total: Math.ceil(res.data.total / that.limit) //小数向前进1
                                });
                            } else {
                                tips.ERROR_500();
                            }
                        }
                    },
                    fail: function (err) {
                        tips.ERROR_500();
                    },
                    complete: function () {
                        setTimeout(function () {
                            uni.hideLoading();
                        }, 1000);
                    }
                });
            }
        },

        loadMoreForDigital: function () {
            let that = this;
            if (that.page + 1 <= this.total) {
                that.setData({
                    page: that.page + 1
                });

                //setTimeout(() => {
                uni.showLoading({
                    content: '加载中～'
                });
                uni.request({
                    url: `${domain.domain_qupingce}/page/getIRBrandByPage`,
                    method: 'GET',
                    data: {
                        type_id: that.typeId,
                        page: that.page,
                        limit: that.limit
                    },
                    success: function (res) {
                        if (res.status == 200) {
                            let firstTypeId = '';
                            let firstTypeName = '';
                            if (res.data.data.data.length > 0) {
                                firstTypeId = res.data.data.data[0].type_id;
                                firstTypeName = res.data.data.data[0].type_name;
                            }
                            if (res.data.status == 200) {
                                that.setData({
                                    digitalBrandList: that.digitalBrandList.concat(res.data.data.data),
                                    typeId: firstTypeId,
                                    typeName: firstTypeName,
                                    total: res.data.data.data.total
                                });
                            } else {
                                tips.ERROR_500();
                            }
                        }
                    },
                    fail: function (err) {
                        tips.ERROR_500();
                    },
                    complete: function () {
                        that.setData({
                            isShow: false
                        });
                    }
                });
            }
        },

        initMainProduct: function () {
            let that = this;
            uni.request({
                url: `${domain.domain_qupingce}/page/getAllBrandByType`,
                method: 'GET',
                data: {
                    type: that.type
                },
                success: function (res) {
                    if (res.statusCode == 200) {
                        if (res.data.status == 200) {
                            that.setData({
                                brandList: res.data.data
                            });
                        } else {
                            tips.ERROR_500();
                        }
                    }
                },
                fail: function (err) {
                    tips.ERROR_500();
                }
            });
            uni.request({
                url: `${domain.domain_qupingce}/page/ChooseTypeByBrandByPage`,
                method: 'GET',
                data: {
                    type: that.type,
                    brandId: that.brandId,
                    page: that.page,
                    limit: that.limit,
                    company: 'jd'
                },
                success: function (res) {
                    if (res.statusCode == 200) {
                        if (res.data.status == 200) {
                            that.setData({
                                productList: res.data.data,
                                total: Math.ceil(res.data.total / that.limit)
                                //小数向前进1
                                //isShow: false
                            });
                        } else {
                            tips.ERROR_500();
                        }
                    }
                },
                fail: function (err) {
                    tips.ERROR_500();
                }
            });
        },

        initDigitalProduct() {
            let _this = this;
            uni.request({
                url: `${domain.domain_qupingce}/page/getIRTypeList`,
                method: 'GET',
                data: '',
                success: function (res) {
                    if (res.statusCode == 200) {
                        if (res.data.status == 200) {
                            _this.setData({
                                typeList: res.data.data
                            });
                        } else {
                            tips.ERROR_500();
                        }
                    }
                },
                fail: function (err) {
                    tips.ERROR_500();
                }
            });
            uni.request({
                url: `${domain.domain_qupingce}/page/getIRBrandByPage`,
                method: 'GET',
                data: {
                    type_id: _this.typeId,
                    page: _this.page,
                    limit: _this.limit
                },
                success: function (res) {
                    if (res.statusCode == 200) {
                        let firstTypeId = '';
                        let firstTypeName = '';
                        if (res.data.data.data.length > 0) {
                            firstTypeId = res.data.data.data[0].type_id;
                            firstTypeName = res.data.data.data[0].type_name;
                        }
                        if (res.data.status == 200) {
                            _this.setData({
                                digitalBrandList: res.data.data.data,
                                typeId: firstTypeId,
                                typeName: firstTypeName,
                                total: res.data.data.total
                            });
                        } else {
                            tips.ERROR_500();
                        }
                    }
                },
                fail: function (err) {
                    tips.ERROR_500();
                }
            });
        },

        changeType: function (event) {
            uni.removeStorageSync('brandId');
            if (event.currentTarget.dataset.type != 'digital') {
                this.setData({
                    signClass: event.currentTarget.dataset.type,
                    type: event.currentTarget.dataset.type,
                    flag: 'main',
                    brandId: '85001ac13f7e4c56ab949328165e0ed6',
                    page: 1,
                    total: 0
                });
                this.initMainProduct();
            } else {
                this.setData({
                    signClass: event.currentTarget.dataset.type,
                    type: event.currentTarget.dataset.type,
                    flag: 'digital',
                    brandId: '85001ac13f7e4c56ab949328165e0ed6',
                    page: 1,
                    total: 0
                });
                this.initDigitalProduct();
            }
        },

        changeBrandItemBymain(event) {
            this.setData({
                brandId: event.currentTarget.dataset.brandId,
                page: 1,
                total: 0
            });
            this.initMainProduct();
        },

        changeBrandItemByDigital(event) {
            this.setData({
                typeId: event.currentTarget.dataset.typeId,
                typeName: event.currentTarget.dataset.typeName,
                page: 1,
                total: 0
            });
            this.initDigitalProduct();
        },

        gotoCountPrice(event) {
            let versionId = event.currentTarget.dataset.versionId;
            if (versionId == null || versionId == '') {
                tips.ERROR_500();
            } else {
                uni.navigateTo({
                    url: '/pages/placeordersteps/placeordersteps?versionId=' + versionId
                });
            }
        },

        gotoDigitalList(event) {
            let brandId = event.currentTarget.dataset.brandId;
            let typeId = this.typeId;
            let typeName = this.typeName;
            uni.navigateTo({
                url: `/pages/digitallist/digitallist?brandId=${brandId}&typeId=${typeId}&typeName=${typeName}`
            });
        },

        loadMoreDigital() {
            console.log('占位：函数 loadMoreDigital 未声明');
        }
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    created: function () {}
};
</script>
<style>
.container {
    width: 100%;
    background: #fff;
}

.container .navigation {
    margin-left: 40rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border-bottom: 2rpx #f8f8f8 solid;
    flex-wrap: nowrap;
}

.container .navigation view {
    font-weight: bolder;
    font-size: 30rpx;
    display: inline-block !important;
    padding: 24rpx !important;
}

.item-sign-flag {
    /* border-bottom: 4rpx #4BA7EC solid; */
    border-top: 6rpx white solid;
    background: #f3f3f3;
}

.left-brand {
    display: inline-block;
}

.main-container {
    display: flex;
    flex-direction: row;
}

.left-brand .item {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    font-size: 28rpx;
    padding-top: 35rpx !important;
    padding-bottom: 35rpx !important;
    padding-left: 12rpx !important;
}

.left-brand .sign {
    border-left: 6rpx #4ba7ec solid;
    color: #4ba7ec;
}

.left-brand .item > image {
    width: 70rpx;
    height: 70rpx;
}

.container .right-product {
    display: inline-block;
    height: 900rpx;
    margin-left: 12rpx;
}

.container .right-product .right-pre-item {
    width: 160rpx;
    height: 250rpx;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: space-around; */
    text-align: center;
    margin-right: 10rpx;
    position: relative;
}

.container .right-product .right-pre-item text {
    font-size: 24rpx;
    color: #808080;
    margin-top: 30rpx;
}

.container .right-product image {
    width: 120rpx;
    height: 120rpx;
}

.digital-container {
    display: flex;
    flex-direction: row;
}

.loading {
    position: relative;
    left: 50%;
    margin-left: -100rpx;
    width: 200rpx;
    padding-bottom: 10rpx;
}

.loading2 {
    position: relative;
    right: -140rpx;
}

.active-mark {
    height: 28rpx;
    width: 100rpx;
    background-color: #f33;
    color: #fff3f3;
    top: 28%;
    right: 10%;
    margin-right: 12rpx;
    margin-top: 10rpx;
    font-size: 21rpx;
    position: absolute;
    transform: rotate(15deg);
    -ms-transform: rotate(15deg);
    /* IE 9 */
    -moz-transform: rotate(15deg);
    /* Firefox */
    -webkit-transform: rotate(15deg);
    /* Safari 和 Chrome */
    -o-transform: rotate(15deg);
    border-top-left-radius: 40rpx;
    border-top-right-radius: 90rpx;
    box-shadow: 0 5rpx 5rpx #c1350b;
}
</style>
