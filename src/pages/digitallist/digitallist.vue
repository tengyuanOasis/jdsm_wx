<template>
    <view style="height: 100%">
        <view style="height: 30rpx"></view>

        <!-- 搜索框 -->
        <view class="searchctl" @tap="toKeySearch">
            <image src="/static/images/l_search.png" style="width: 30rpx; height: 30rpx; margin-right: 20rpx"></image>
            <text>搜索你想要回收的产品型号</text>
        </view>

        <view class="container-ex">
            <view class="navigation">
                <view>智能数码</view>
            </view>
            <view class="main-content">
                <block v-for="(item, index) in digitalList" :key="index">
                    <view style="position: relative" :data-version-id="item.versionId" @tap="gotoCountPrice">
                        <image :src="domain + item.img"></image>
                        <text>{{ item.versionName }}</text>
                    </view>
                </block>
            </view>
        </view>

        <kefu-cmp></kefu-cmp>
    </view>
</template>

<script>
import kefuCmp from '@/components/kefuservice/kefuservice';
import { tips } from '../../utils/tips';
import { commonDomain as domain } from '../../constant/common';
export default {
    components: {
        kefuCmp
    },
    data() {
        return {
            domain: '',
            brandId: '',
            //品牌Id
            typeId: '',
            //类型ID
            typeName: '',
            //类型名字
            digitalList: []
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取上一个页面传递过来的数据
        this.setData({
            brandId: options.brandId,
            typeId: options.typeId,
            typeName: options.typeName,
            domain: domain.domain_qupingce
        });
        let that = this;
        //初始化页面的数据
        uni.request({
            url: `${domain.domain_qupingce}/page/getIRVersion`,
            type: 'GET',
            data: {
                brandId: this.brandId,
                typeId: this.typeId,
                typeName: this.typeName,
                company: 'jd'
            },
            success(res) {
                if (res.statusCode == 200) {
                    if (res.data.status == 200) {
                        that.setData({
                            digitalList: res.data.data
                        });
                    } else {
                        tips.ERROR_500000(res.data.msg);
                    }
                } else {
                    tips.ERROR_500();
                }
            },
            fail: function (err) {
                tips.ERROR_500();
            }
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        uni.stopPullDownRefresh();
    },
    methods: {
        //跳转到去估价页面
        gotoCountPrice(event) {
            let versionId = event.currentTarget.dataset.versionId;
            let typeName = this.typeName;
            if (versionId == null || versionId == '') {
                tips.ERROR_500();
            } else {
                //如果类型名字不为手表就跳到通用的估价页面去
                if (typeName != 'watch') {
                    /**
                     * TODO:非手表的估价页面
                     */
                    uni.navigateTo({
                        url: `/pages/digitalordersteps/digitalordersteps?versionId=${versionId}&typeName=${typeName}`
                    });
                } else {
                    //如果为手表的话就跳转到通用的页面进行处理
                    uni.navigateTo({
                        url: `/pages/placeordersteps/placeordersteps?versionId=${versionId}&typeName=${typeName}`
                    });
                }
            }
        },

        toKeySearch() {
            console.log('占位：函数 toKeySearch 未声明');
        }
    }
};
</script>
<style>
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

.container-ex {
    width: 100%;
    background-color: #fff;
    min-height: 1000rpx;
}

.top-left {
    width: 110rpx;
    height: 110rpx;
    margin-left: 30rpx;
}

.container-ex .navigation {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border-bottom: 2rpx #f8f8f8 solid;
    flex-wrap: nowrap;
}

.container-ex .navigation view {
    font-weight: bolder;
    font-size: 30rpx;
    display: inline-block !important;
    padding: 24rpx !important;
}

.main-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
}

.main-content view {
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    margin-bottom: 24rpx;
    position: relative;
}

.main-content view image {
    width: 160rpx;
    height: 160rpx;
}

.main-content view text {
    font-size: 24rpx;
    color: #808080;
}

.active-mark {
    height: 28rpx;
    width: 130rpx !important;
    background-color: #f33;
    color: #fff3f3;
    top: 32%;
    right: 20%;
    margin-right: 12rpx;
    margin-top: 10rpx;
    font-size: 21rpx;
    position: absolute !important;
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
