<template>
    <!-- 搜索页面 -->

    <view class="container">
        <view class="section">
            <view class="section_img">
                <image src="/static/images/l_search.png"></image>
            </view>
            <input placeholder="请输入机型名称" :focus="focus" @input="getkey" confirm-type="search" :value="prikey" />
        </view>

        <view v-if="prikey != '' && searchArray.length > 0" class="selectArr">
            <block v-for="(item, index) in searchArray" :key="index">
                <view @tap="enterFun" :data-variable="item" class="selectItem">
                    {{ item.version_name }}
                </view>
            </block>
        </view>
        <view v-if="prikey != '' && searchArray.length == 0" class="selectArr">
            <view class="selectItem" style="color: #808080">暂无数据~</view>
        </view>

        <view class="section2" v-if="latestArray.length > 0">
            <view class="first_bank">
                <text style="font-weight: bold">历史搜索</text>
                <view style="color: #696969; font-size: 28rpx; font-weight: bold" @tap="clearHisStor">清空</view>
            </view>
            <view v-if="latestArray.length > 0" class="his">
                <block v-for="(item, index) in latestArray" :key="index">
                    <view @tap="getSearchKeyByHis" :data-variable="item" class="hisItem">
                        {{ item.version_name }}
                    </view>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
import headerCmp from '@/components/header/header';
import kefuCmp from '@/components/kefuservice/kefuservice';
// pages/search/search.js
import { commonDomain as domain } from '../../constant/common';
export default {
    components: {
        headerCmp,
        kefuCmp
    },
    data() {
        return {
            focus: true,
            prikey: '',
            searchArray: [],
            //根据关键字查的机型数组
            latestArray: [] //历史搜索缓存数据
        };
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
    onShow: function () {
        this.setData({
            latestArray: []
        });
        if (uni.getStorageSync('latestArray').length > 0) {
            //取缓存
            this.setData({
                latestArray: uni.getStorageSync('latestArray')
            });
        }
    },
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
        uni.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    methods: {
        getkey: function (e) {
            var oldkey = this.prikey;
            this.setData({
                prikey: e.detail.value
            });
            if (this.prikey != oldkey) {
                let _this = this;
                uni.request({
                    url: `${domain.domain_qupingce}/search/serarchByKey`,
                    header: {
                        'content-type': 'application/json' // 默认值
                    },

                    data: {
                        key: _this.prikey,
                        company: 'jd'
                    },
                    method: 'GET',
                    success(res) {
                        if (res.statusCode == '200') {
                            //请求状态码
                            if (res.data.status == '200') {
                                //后台返回成功状态码
                                _this.setData({
                                    searchArray: res.data.data //搜索机型数组赋值
                                });
                            }
                        }
                    }
                });
            }
        },

        enterFun: function (e) {
            var item = e.currentTarget.dataset.variable;
            if (uni.getStorageSync('latestArray').length > 0) {
                this.setData({
                    latestArray: uni.getStorageSync('latestArray')
                });
                var arr = this.latestArray;
                var ret = arr.findIndex((value, index, arr) => {
                    //缓存数组排重
                    return value.version_id == item.version_id;
                });
                if (ret == -1) {
                    //缓存数组不存在当前搜索
                    this.latestArray.unshift(item);
                }
            } else {
                this.latestArray.unshift(item);
            }
            uni.setStorageSync('latestArray', this.latestArray); //存缓存

            if (item.flag == 'main' || (item.flag == 'digital') & (item.type_name == 'watch')) {
                uni.navigateTo({
                    url: '/pages/placeordersteps/placeordersteps?versionId=' + item.version_id
                });
            } else {
                uni.navigateTo({
                    url: '/pages/digitalordersteps/digitalordersteps?versionId=' + item.version_id
                });
            }
        },

        clearHisStor: function () {
            //清空历史纪录
            let that = this;
            if (uni.getStorageSync('latestArray').length > 0) {
                uni.showModal({
                    title: '',
                    content: '确定要清空所有历史记录吗',
                    success(res) {
                        if (res.confirm) {
                            uni.removeStorageSync('latestArray');
                            that.setData({
                                latestArray: []
                            });
                        }
                    }
                });
            }
        },

        serviceConsult: function () {
            //联系客服
            // var url = 'http://p.qiao.baidu.com/cps/chat?siteId=12191591&userId=25807133&c' +
            //   'p=%E6%9D%A5%E8%87%AA%E5%9B%9E%E6%94%B6%E7%BD%91%E7%AB%99&cr=%E5%9B%9E%E6%94%B6%E7%BD%91%E7%AB%99&cw=%E8%B6' +
            //   '%A3%E8%AF%84%E6%B5%8B%E5%9B%9E%E6%94%B6%E5%AE%A2%E6%88%B7';
            // wx.navigateTo({
            //   url: "/components/webviewpage/webviewpage?paramUrl=" + url,
            // })
        },

        getSearchKeyByHis: function (e) {
            var item = e.currentTarget.dataset.variable;
            this.setData({
                prikey: item.version_name
            });
            this.focus = true;
            let that = this;
            uni.request({
                url: `${domain.domain_qupingce}/search/serarchByKey`,
                data: {
                    key: that.prikey,
                    company: 'jd'
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },

                success(res) {
                    if (res.statusCode == '200') {
                        //请求状态码
                        if (res.data.status == '200') {
                            //后台返回成功状态码
                            that.setData({
                                searchArray: res.data.data //搜索机型数组赋值
                            });
                        }
                    }
                }
            });
        }
    }
};
</script>
<style>
/* pages/search/search.wxss */

page {
    font-family: '微软雅黑';
    width: 100%;
    background: #f7f6fb;
}

.container {
    width: 100%;
    padding-top: 40rpx;
}

.section {
    display: flex;
    width: 90%;
    margin-left: 5%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    height: 70rpx;
    border-radius: 10rpx;
    color: #aeaeae;
    border: 3rpx #4ba7ec solid;
    background: white;
    margin-bottom: 40rpx;
}

.holder {
    color: #aeaeae;
}

.section input {
    width: 80%;
    height: 60rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #aeaeae;
    background-color: white;
    border-radius: 0 50rpx 50rpx 0;
}

.section_img {
    width: 8%;
    text-align: center;
    height: 60rpx;
    background: white;
    border-radius: 50rpx 0 0 50rpx;
}

.section_img image {
    width: 35rpx;
    height: 35rpx;
    margin-top: 13rpx;
}

.section2 {
    margin-top: 40rpx;
    width: 100%;
    background: white;
    min-height: 210rpx;
}

.first_bank {
    margin-left: 5%;
    font-size: 30rpx;
    color: black;
    display: flex;
    align-items: center;
    width: 90%;
    height: 80rpx;
    justify-content: space-between;
    border-bottom: 1px solid #f4f4f4;
}

.sec_bank {
    width: 100%;
    height: 120rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sec_button {
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    background: #f8f8f8;
    width: 94%;
    height: 75rpx;
    border-radius: 5rpx;
}

.section3 {
    height: 100rpx;
    line-height: 100rpx;
    font-size: 28rpx;
    color: #999;
    float: right;
    margin-right: 30rpx;
}

.digital {
    display: inline;
    color: #10d057;
    font-size: 30rpx;
    font-weight: bold;
}

.selectArr {
    margin-top: 40rpx;
    width: 100%;
    background: #fff;
    font-size: 28rpx;
}

.selectItem {
    text-indent: 20rpx;
    margin-left: 2%;
    width: 96%;
    padding-top: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: solid 1px #f4f4f4;
}

.his {
    margin-top: 30rpx;
    width: 90%;
    margin-left: 5%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.hisItem {
    font-size: 25rpx;
    color: #808080;
    padding: 15rpx 20rpx;
    background: #f5f4f9;
    border-radius: 30rpx;
    margin-right: 30rpx;
    margin-bottom: 30rpx;
}
</style>
