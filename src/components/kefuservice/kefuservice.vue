<template>
    <view style="height: 100%">
        <!-- components/kefuservice/kefuservice.axml -->
        <!-- TODO:此客服组件已经无法支持支付宝小程序，后续考虑支付宝官方一键客服 -->
        <!-- <view class="main" style="">
  <movable-area class="move-box" style="">
    <movable-view class="move-view" style="" direction="all">
      <view>
        <view class="kefu"> -->
        <!-- WX2MY: 属性open-type=contact时，不被支持，请调整。 -->
        <!-- <button open-type="contact" class="kefu-img"><image src="/images/kefu.png"/></button> -->
        <!-- <contact-button tnt-inst-id="oXK_i3Zu" scene="SCE00262611"/> -->
        <!-- WX2MY: 属性open-type=contact时，不被支持，请调整。 -->
        <!-- <button class="kefu-text">
            <text>客服</text>
          </button>
        </view>
      </view>
    </movable-view>
  </movable-area>
</view> -->

        <!-- 客服 -->
        <view class="main">
            <movable-area class="move-box">
                <movable-view class="move-view" direction="all">
                    <view>
                        <view class="kefu" @tap="kffunc">
                            <image src="/static/images/kfimg.png" style="width: 100rpx; height: 100rpx" />
                        </view>
                    </view>
                </movable-view>
            </movable-area>
        </view>

        <!-- 客服弹框 -->
        <!-- 弹框 -->
        <view class="mark_model" v-if="isShowEditModel">
            <view class="mark_content">
                <form>
                    <view class="form-pre" style="margin-top: 80rpx">
                        <label style="font-size: 26rpx" @tap="copyAddress">客服微信：jianduan123123（点击复制）</label>
                    </view>

                    <view class="form-pre">
                        <label style="font-size: 26rpx" @tap="copyPhone">客服电话：18475563915（点击复制）</label>
                    </view>
                </form>
            </view>

            <view class="kfbtn">
                <image src="/static/images/closekf.png" @tap="closekf" style="width: 50rpx; height: 50rpx"></image>
            </view>
        </view>
    </view>
</template>

<script>
// components/kefuservice/kefuservice.js
export default {
    data() {
        return {
            isShowEditModel: false
        };
    },
    /**
     * 组件的属性列表
     */
    props: {},
    /**
     * 组件的方法列表
     */
    methods: {
        move: function (e) {
            console.log(move);
        },
        kffunc: function () {
            this.setData({
                isShowEditModel: true
            });
        },
        closekf: function () {
            this.setData({
                isShowEditModel: false
            });
        },
        copyAddress: function () {
            uni.setClipboardData({
                data: 'jianduan123123',
                success(res) {
                    uni.getClipboardData({
                        success(res) {
                            // console.log(1) // data
                        }
                    });
                }
            });
        },
        copyPhone: function () {
            uni.setClipboardData({
                data: '18475563915',
                success(res) {
                    uni.getClipboardData({
                        success(res) {
                            // console.log(1) // data
                        }
                    });
                }
            });
        }
    },
    created: function () {}
};
</script>
<style>
.main {
    position: fixed;
    bottom: 29%;
    right: 4%;
    width: 10rpx;
    height: 150rpx;
    z-index: 99999;
}

.move-box {
    height: 250px;
    width: 10px;
}

.move-view {
    height: 100px;
    width: 10px;
    margin-top: 200rpx;
}

.kefu {
    position: fixed;
    bottom: 4%;
    right: 4%;
    text-align: center;
    width: 100rpx;
    height: 153rpx;
    display: flex;
    flex-direction: column;
}

.kefu .kefu-img image {
    margin-top: 10rpx;
    padding: 15rpx;
    line-height: 50rpx;
    width: 45rpx;
    height: 45rpx;
    border-radius: 50%;
    margin-left: 6%;
    margin-bottom: 10rpx;
}

.mark_model {
    width: 100%;
    height: 100%;
    background-color: rgba(110, 110, 110, 0.3);
    position: fixed;
    top: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;
    text-align: center;
}

.mark_model form {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    background: white;
    border-radius: 20rpx;
}

.mark_model form view {
    padding: 10rpx 10rpx;
}

.mark_model form .form-pre {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
}

.mark_model .mark_content {
    width: 80%;
    margin-left: 10%;
    height: 300rpx;
    background-color: white;
    border-radius: 16rpx;
    position: relative;
    margin-top: 420rpx;
}

.kfbtn {
    width: 100%;
    text-align: center;
    margin-top: 30rpx;
}
</style>
