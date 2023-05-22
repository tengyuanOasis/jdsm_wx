<template>
    <!-- pages/mine/per/binding/binding.wxml -->
    <view class="container">
        <!-- title -->
        <view class="header"></view>

        <view class="user-info">
            <!-- 鸭子 -->
            <view class="user-image">
                <image src="/static/images/LOGO.png"></image>
            </view>
        </view>

        <view class="bind-main">
            <view class="box">
                <text>手机号：</text>
                <input type="number" placeholder="输入手机号码" @input="phoneChange" />
            </view>
            <view class="box bind-main-l">
                <button :disabled="disabled" @tap="getVerificationCode" class="code">{{ time }}</button>
                <text>验证码：</text>
                <input type="number" placeholder="输入验证码" @input="codeChange" />
            </view>
        </view>
        <view class="userBind">
            <button @tap="binding">绑定</button>
        </view>
    </view>
</template>

<script>
// pages/mine/per/binding/binding.js
var interval = null;
export default {
    data() {
        return {
            time: '获取验证码',

            //倒计时
            currentTime: 61,

            phone: '',
            code: '',
            disabled: false
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
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
    methods: {
        /**
         * 手机号改变
         * */
        phoneChange: function (e) {
            this.setData({
                phone: e.detail.value
            });
        },

        codeChange: function (e) {
            this.setData({
                code: e.detail.value
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
                    time: currentTime + '秒'
                });
                if (currentTime <= 0) {
                    clearInterval(interval);
                    that.setData({
                        time: '重新发送',
                        currentTime: 61,
                        disabled: false
                    });
                }
            }, 1000);
        },

        /**
         * 获取验证码
         */
        getVerificationCode() {
            var that = this;
            var phone = this.phone;
            var regPhone = new RegExp('^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', 'g');
            if (!regPhone.exec(phone)) {
                uni.showModal({
                    title: '错误提示',
                    content: '请输入正确的手机号！',
                    showCancel: false
                });
                return false;
            }

            //加载动画
            uni.showLoading({
                title: '发送中...',
                mask: true
            });
            uni.request({
                url: 'https://sso.qupingce.com/code/sendcode',
                data: {
                    remark: 'wxBinding',
                    phone: phone
                },
                header: {
                    'Content-Type': 'applciation/json'
                },
                method: 'GET',
                //get为默认方法/POST
                success: function (r) {
                    if (r.data.status == 200) {
                        //发送成功后60秒后再试
                        that.getCode();
                        that.setData({
                            disabled: true
                        });
                        uni.showToast({
                            title: '发送成功',
                            icon: 'success',
                            duration: 2000,
                            mask: true
                        });
                    } else {
                        uni.showToast({
                            title: '发送失败！',
                            image: '/static/images/icon/500_error.png',
                            duration: 2000,
                            mask: true
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
         * 绑定
         */
        binding: function () {
            var that = this;
            var phone = this.phone;
            var code = this.code;
            var wxId = uni.getStorageSync('wxId');
            var regPhone = new RegExp('^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', 'g');
            if (!regPhone.exec(phone)) {
                uni.showModal({
                    title: '提示',
                    content: '请输入正确的手机号！',
                    showCancel: false
                });
                return false;
            }
            if (code == '') {
                uni.showModal({
                    title: '提示',
                    content: '请输入验证码！',
                    showCancel: false
                });
                return false;
            }
            if (!wxId) {
                uni.showModal({
                    title: '提示',
                    content: '未获取到微信用户信息！',
                    showCancel: false
                });
                return false;
            }
            //加载动画
            uni.showLoading({
                title: '绑定中...',
                mask: true
            });
            uni.request({
                url: 'https://sso.qupingce.com/qpc/wxBinding',
                data: {
                    seller_phone: phone,
                    code: code,
                    tu: 'wx',
                    wxId: wxId
                },
                header: {
                    'Content-Type': 'applciation/json'
                },
                method: 'GET',
                //get为默认方法/POST
                success: function (r) {
                    uni.hideLoading();
                    if (r.data.code == 200) {
                        uni.setStorageSync('token', r.data.token);
                        uni.showToast({
                            title: '绑定成功',
                            icon: 'success',
                            duration: 2000,
                            mask: true,
                            complete: function () {
                                uni.switchTab({
                                    url: '/pages/mine/user'
                                });
                            }
                        });
                    } else {
                        uni.showModal({
                            title: '提示',
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
/* pages/mine/per/binding/binding.wxss */

.header {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #ffba5e), color-stop(1, #ffd22b));
}

.header view {
    float: left;
    margin-left: 10rpx;
}

.header image {
    width: 60rpx;
    height: 60rpx;
    margin-top: 10rpx;
}

.header .logout {
    float: right;
    margin-right: 10rpx;
}

/*  */

.user-info {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 184rpx;
    background: #ffd22b;
}

.user-image {
    width: 170rpx;
    height: 170rpx;
    margin: auto;
}

.user-image image {
    width: 100%;
    height: 100%;
}

.bind-main {
    width: 100%;
    height: auto;
}

.bind-main .box {
    position: relative;
    height: 100rpx;
    margin: 50rpx 0;
    background: white;
    padding: 0 3%;
    overflow: hidden;
}

.bind-main-l {
    margin-top: 20rpx !important;
}

.box text {
    position: absolute;
    width: 20%;
    height: 100%;
    left: 3%;
    line-height: 100rpx;
}

.box input {
    width: 78%;
    height: 100%;
    padding: 0 3%;
    border: none;
    text-indent: 1.5rem;
    outline: none;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    font: inherit;
    margin-left: 18%;
    -webkit-appearance: textfield;
    background-color: white;
    -webkit-rtl-ordering: logical;
    cursor: text;
}

.bind-main-l input {
    width: 45% !important;
}

.bind-main .box .code {
    position: absolute;
    left: 65%;
    background-color: #ffd22b;
    padding: 0rpx 15rpx;
    text-align: center;
    width: 30%;
    height: 100%;
    line-height: 100rpx;
}

.userBind button {
    width: 80%;
    height: 3em;
    line-height: 3em;
    background-color: #ffd22b;
    margin: auto;
}
</style>
