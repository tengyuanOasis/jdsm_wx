<template>
    <!-- pages/mine/per/updateinfo/updateinfo.wxml -->
    <view class="container">
        <!-- title -->
        <view class="header">
            <view @tap="backePage">取消</view>

            <button class="logout" @tap="save" :disabled="disabled">
                {{ time }}
            </button>
        </view>

        <view class="box">
            <input type="number" :placeholder="seller_phone" @input="phoneChange" />
        </view>

        <!-- 弹框 -->
        <view class="toast-box" v-if="isHiden">
            <view class="toastbg"></view>
            <view class="showToast">
                <view class="toast-title">
                    <text>验证码</text>
                </view>
                <view class="toast-main">
                    <view class="input-title" v-if="error">
                        <text>{{ error }}</text>
                    </view>
                    <view class="toast-input">
                        <input placeholder="请输入验证码" type="number" @input="codeChange" />
                    </view>
                </view>
                <view class="toast-button">
                    <view class="button1">
                        <button @tap.stop.prevent="cancel">取消</button>
                    </view>
                    <view class="button2">
                        <button @tap.stop.prevent="confirm">确定</button>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// pages/mine/per/updateinfo/updateinfo.js
var interval = null;
const app = getApp();
export default {
    data() {
        return {
            seller_phone: '绑定手机号',
            time: '保存',

            //倒计时
            currentTime: 61,

            isHiden: false,
            code: '',
            error: '',
            disabled: false
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        var seller_phone = options.seller_phone;
        if (seller_phone) {
            this.setData({
                seller_phone: seller_phone
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
        uni.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    methods: {
        /***/
        phoneChange: function (e) {
            this.setData({
                seller_phone: e.detail.value,
                error: ''
            });
        },

        backePage: function () {
            uni.navigateBack({
                delta: 1
            });
        },

        save: function () {
            //先获取验证码 后再请求改变
            var that = this;
            var phone = this.seller_phone;
            var regPhone = new RegExp('^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', 'g');
            if (!regPhone.exec(phone)) {
                uni.showModal({
                    title: '错误提示',
                    content: '请输入正确的手机号！',
                    showCancel: false
                });
                return false;
            }

            //
            //加载动画
            uni.showLoading({
                title: '发送中...',
                mask: true
            });
            uni.request({
                url: 'https://sso.qupingce.com/code/sendcode',
                data: {
                    remark: 'setPhone',
                    phone: phone
                },
                header: {
                    'Content-Type': 'applciation/json'
                },
                method: 'GET',
                //get为默认方法/POST
                success: function (r) {
                    uni.hideLoading();
                    if (r.data.status == 200) {
                        //发送成功不能重复点
                        that.getCode();
                        that.setData({
                            disabled: true
                        });
                        //成功后 填写验证码
                        that.setData({
                            isHiden: true
                        });
                    } else {
                        uni.showModal({
                            title: '错误提示',
                            content: r.data.msg,
                            showCancel: false
                        });
                    }
                },
                fail: function (err) {
                    uni.showToast({
                        title: '暂无网络！',
                        image: '/static/images/icon/500_error.png',
                        duration: 2000,
                        mask: true
                    });
                },
                //请求失败
                complete: function (r) {} //请求完成后执行的函数
            });
        },

        /**
         * 倒计时
         */
        getCode: function (options) {
            var that = this;
            var currentTime = that.currentTime;
            interval = setInterval(function () {
                currentTime--;
                that.setData({
                    time: currentTime
                });
                if (currentTime <= 0) {
                    clearInterval(interval);
                    that.setData({
                        time: '保存',
                        currentTime: 61,
                        disabled: false
                    });
                }
            }, 1000);
        },

        /**
         * 验证码改变
         */
        codeChange: function (e) {
            this.setData({
                code: e.detail.value,
                error: ''
            });
        },

        /**
         * 取消输入
         */
        cancel: function () {
            this.setData({
                isHiden: false
            });
        },

        /**
         * 确认
         */
        confirm: function () {
            var that = this;
            var phone = this.seller_phone;
            var code = this.code;
            var wxId = uni.getStorageSync('wxId');
            var regPhone = new RegExp('^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', 'g');
            if (!regPhone.exec(phone)) {
                that.setData({
                    error: '请输入正确的手机号！'
                });
                return false;
            }
            if (code == '' || !code) {
                that.setData({
                    error: '请输入验证码！'
                });
                return false;
            }
            if (!wxId) {
                that.setData({
                    error: '绑定失败！'
                });
                return false;
            }
            //加载动画
            uni.showLoading({
                title: '绑定中...',
                mask: true
            });
            uni.request({
                url: 'https://sso.qupingce.com/qpc/modPhone',
                data: {
                    seller_phone: phone,
                    code: code,
                    wxId: wxId
                },
                header: {
                    'Content-Type': 'applciation/json'
                },
                method: 'GET',
                //get为默认方法/POST
                success: function (r) {
                    uni.hideLoading();
                    that.setData({
                        code: '',
                        isHiden: false
                    });
                    if (r.data.status == 200) {
                        uni.showToast({
                            title: '成功！',
                            icon: 'success',
                            duration: 2000,
                            mask: true
                        });
                        //绑定成功后发起登录请求
                        app.globalData.login();
                        //关闭倒计时
                        clearInterval(interval);
                        that.setData({
                            time: '保存',
                            currentTime: 61,
                            disabled: false
                        });
                        //跳转到user
                        setTimeout(function () {
                            uni.switchTab({
                                url: '/pages/mine/user'
                            });
                        }, 1000);
                    } else {
                        uni.showModal({
                            title: '错误提示',
                            content: r.data.msg,
                            showCancel: false
                        });
                    }
                },
                fail: function (err) {
                    uni.showToast({
                        title: '暂无网络！',
                        image: '/static/images/icon/500_error.png',
                        duration: 2000,
                        mask: true
                    });
                },
                //请求失败
                complete: function (r) {} //请求完成后执行的函数
            });
        }
    }
};
</script>
<style>
/* pages/mine/per/updateinfo/updateinfo.wxss */

.header {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-image: linear-gradient(336deg, #ffb400, #ffef40);
}

.header view {
    float: left;
    margin-left: 10rpx;
}

.header .logout {
    font-size: 1em;
    float: right;
    margin-right: 10rpx;
    margin-top: 25rpx;
    background-color: rgba(255, 255, 255, 0);
}

.box {
    position: relative;
    width: 80%;
    height: 100rpx;
    margin: 20rpx auto;
    line-height: 100rpx;
    border-bottom: 2rpx #ffd22b solid;
}

.box input {
    position: relative;
    bottom: -20rpx;
    width: 100%;
    height: 90rpx;
    text-align: center;
    font-size: 1em;
}

button[disabled] {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0) !important;
    background-color: rgba(255, 255, 255, 0) !important;
}
input:disabled {
    background-color: rgba(255, 255, 255, 0) !important;
}

/* 弹框 */
.toast-box {
    width: 100%;
    height: 100%;
    opacity: 1;
    position: fixed;
    top: 0px;
    left: 0px;
}

.toastbg {
    opacity: 0.2;
    background-color: black;
    position: absolute;
    width: 100%;
    min-height: 120vh;
}

.showToast {
    position: absolute;
    opacity: 1;
    width: 70%;
    margin-left: 15%;
    margin-top: 40%;
}

.toast-title {
    padding-left: 5%;
    background-color: #ffd22b;
    color: white;
    padding-top: 2vh;
    padding-bottom: 2vh;
    border-top-right-radius: 16rpx;
    border-top-left-radius: 16rpx;
}

.toast-main {
    padding-top: 2vh;
    padding-bottom: 2vh;
    background-color: white;
    text-align: center;
}

.toast-input {
    margin-left: 5%;
    margin-right: 5%;
    border: 1px solid #ddd;
    padding-left: 2vh;
    padding-right: 2vh;
    padding-top: 1vh;
    padding-bottom: 1vh;
}

.toast-button {
    display: flex;
}
.input-title {
    padding-top: 1vh;
    padding-bottom: 1vh;
}

.input-title text {
    font-size: 0.8em;
    color: red;
}

.button1 {
    width: 50%;
}

.button2 {
    width: 50%;
}

.button1 button {
    width: 100%;
    background-color: white;
    color: #ddd;
    border-radius: 0px;
    border-bottom-left-radius: 16rpx;
    padding-bottom: 2vh;
}

.button2 button {
    width: 100%;
    background-color: white;
    color: black;
    border-radius: 0px;
    border-bottom-right-radius: 16rpx;
    padding-bottom: 2vh;
}

.picker {
    padding-top: 1vh;
    padding-bottom: 1vh;
}
</style>
