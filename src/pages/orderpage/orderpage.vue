<template>
    <view style="height: 100%">
        <!-- pages/placeorderpage/placeorderpage.wxml -->
        <!-- 顶部大标题组件 -->
        <header-cmp :isShow="false">
            <view slot="question">
                <text>{{ product_title.product_name }}</text>
            </view>
        </header-cmp>
        <!-- /顶部大标题组件 -->
        <view class="container">
            <form @submit="formSubmit" class="formClass">
                <view class="order-box">
                    <view class="j-address single-input">
                        <!-- WX2MY: 属性space不被支持，请调整 -->
                        <text space="emsp" decode="decode" style="color: #212123">&emsp;联系人:</text>
                        <input type="text" onInput="listenCodeInput" placeholder-class="placeholderStyle" placeholder="输入联系电话" name="dealPhone" :value="phoneNumber" />
                    </view>
                    <view class="j-address single-input">
                        <!-- WX2MY: 属性space不被支持，请调整 -->
                        <text decode="decode" style="color: #212123">&emsp;验证码:</text>
                        <input class="codeInput" placeholder-class="placeholderStyle" type="text" name="checkCode" placeholder="输入验证码" />
                        <button
                            :style="'background-color:' + btnColor"
                            :disabled="ifPress"
                            class="getCodeBtn"
                            @tap="getCheckCode"
                            size="default"
                            type="button"
                            primarySize="default"
                        >
                            {{ btntext }}
                        </button>
                    </view>
                    <view class="section single-input" style="padding-left: 1rpx" v-if="isShow">
                        <view class="section__title deal-way" style="color: #212123">收款方式:</view>
                        <radio-group name="dealWay">
                            <label style="margin-left: 35rpx; font-size: 26rpx; color: #999">
                                <radio value="支付宝" color="#4BA7EC" checked />
                                支付宝
                                <text style="color: #4ba7ec; font-size: 20rpx"></text>
                            </label>
                            <label style="margin-left: 20rpx; font-size: 26rpx; color: #999">
                                <radio value="银行卡" color="#4BA7EC" />
                                银行卡
                                <text style="font-size: 20rpx; color: red"></text>
                            </label>
                        </radio-group>
                    </view>

                    <view class="j-address single-input" v-if="isShow">
                        <!-- WX2MY: 属性space不被支持，请调整1 -->
                        <text space="ensp" style="color: #212123">收款账号:</text>
                        <input placeholder-class="placeholderStyle" type="text" name="dealAccount" placeholder="非常重要,请认真填写" />
                    </view>
                    <view class="j-address single-input" v-if="isShow">
                        <!-- WX2MY: 属性space不被支持，请调整 -->
                        <text decode="decode" style="color: #212123">&emsp;收款人:</text>
                        <input placeholder-class="placeholderStyle" type="text" name="dealName" placeholder="收款账号对应的实名姓名" />
                    </view>
                    <view class="j-address single-input">
                        <!-- WX2MY: 属性space不被支持，请调整 -->
                        <text class="proSource" space="nbsp" style="color: #212123">机器来源:</text>
                        <picker onChange="bindPickerChange" name="source" :value="index" :range="array">
                            <view class="picker" style="color: #999">{{ array[index] }}</view>
                        </picker>
                    </view>
                    <view class="j-address single-input" v-if="!isDigital">
                        <!-- WX2MY: 属性space不被支持，请调整 -->
                        <text decode="decode" style="color: #212123">&emsp;序列号:</text>
                        <input placeholder-class="placeholderStyle" type="text" name="imei" placeholder="输入当前估价机型的序列号/IMEI" />
                    </view>
                    <view v-if="!isDigital" class="codeTipsBox">
                        <image class="askImg" src="/static/pages/orderpage/images/ask.png"></image>
                        <view class="codeTipsText" @tap="showTeach">查看序列号</view>
                    </view>
                </view>

                <view class="agreeRules">
                    <image v-if="!isAgree" @tap="agreeFun" data-type="no" src="/static/pages/orderpage/images/no-agree.png"></image>
                    <image v-if="isAgree" @tap="agreeFun" data-type="yes" src="/static/pages/orderpage/images/agree.png"></image>
                    <!-- WX2MY: 属性decode不被支持，请调整 -->
                    <text :decode="true">&nbsp;我已阅读并同意</text>
                    <navigator url="../servicerule/servicerule">《服务条款》</navigator>
                </view>
                <button v-if="show1 && isAgree" class="count_btn" formType="submit" size="default" type="button" :plain="false" primarySize="default">立即提交</button>
                <button v-if="show1 && !isAgree" class="count_btn_fake">立即提交</button>
            </form>
            <view class="recycleTips">
                <view class="attention">注意：</view>
                <view>尖端数码拒绝回收不合法来源的脏机，无法注销D的机器，收到此类机器将会拒收退回。</view>
                <view class="littleTips">小贴士：</view>
                <view>1.根据我们以往回收经验，为了您的机器安全，强烈建议您选择顺丰快递，邮费为到付由尖端数码回收承担.</view>
                <view>2.请您务必在机器寄出前清除机器的锁屏密码,并退出ID账号,否则将严重影响最终回收价格.</view>
                <view>3.建议您清除机器内的所有个人信息,如果您忘记清除信息,我们将为您清除数据,尖端数码回收承诺坚决保护用户隐私.</view>
                <view>4.根据以往经验，如果选择其他快递丢件风险比较大，如果出现意外 尖端数码回收不予承担责任，请知悉.</view>
                <view>5.华为/荣耀旗下机型保修时间需查询满一年保修才可按照全新机标准回收，有疑问可联系客服确认.</view>
                <view class="normalQ" @tap="seeQuestions">查看常见问题</view>
            </view>
            <!-- 表单信息结束 -->
            <!-- 弹出层 -->
            <view @tap="closeModal" class="mask" @touchmove.stop.prevent="preventTouchMove" v-if="showModal"></view>
            <view class="modalBox" v-if="showModal">
                <view class="myModal-title">电池情况</view>
                <image @tap="closeModal" mode="aspectFit" class="outImg" src="/static/pages/orderpage/images/out.png" />
                <image mode="aspectFit" class="demoImg" src="/static/pages/orderpage/images/demo.png" />
                <text class="explain">这里是一些解释这里是一些解释这里是一些解释这里是一些解释这里是一些解释这里是一些解释</text>
            </view>
            <!-- <button bindtap="myModalShow">展示说明</button> -->
            <!-- /弹出层 -->
        </view>

        <kefu-cmp></kefu-cmp>
    </view>
</template>

<script>
import headerCmp from '@/components/header/header';
import kefuCmp from '@/components/kefuservice/kefuservice';
// pages/placeorderpage/placeorderpage.js
const app = getApp();
import { tips } from '../../utils/tips';
import { commonDomain as domain } from '../../constant/common';
export default {
    components: {
        headerCmp,
        kefuCmp
    },
    data() {
        return {
            isShow: false,
            //是否显示
            other_money: 0,
            //初始加价活动
            phoneNumber: '',
            //手机号
            scrollTop: 0,
            //滚动条高度
            isDigital: false,
            //是否来源于智能数码估价
            showModal: false,
            //控制弹出层
            orderNumber: null,
            //下单成功返回的订单号
            token: '',
            wxId: null,
            versionId: null,
            btnColor: '#fff',
            //短信按钮颜色
            ifPress: false,
            //是否允许短信按钮点击
            tiktok: 45,
            //获取验证码的间隔，秒
            btntext: '获取验证码',
            //短信按钮文字
            codeValue: null,
            array: ['自己购买', '活动获得', '他人赠送'],
            index: '0',
            //机器来源默认选中第一个

            show1: true,
            //show1,show2控制两个方式的显示
            show2: false,
            product_title: {
                product_name: ''
            },
            //机器基本信息
            final_price: 0,
            //报价
            old_final_price: 0,
            isNew: false,
            //是否全新机
            product_details: [],
            //选中详情
            isAgree: false //是否同意协议
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log(options.isDigital)
        //取出上个页面缓存的数据
        let that = this;
        uni.getStorage({
            key: 'phoneNumber',
            success(res) {
                that.setData({
                    phoneNumber: res.data,
                    codeValue: res.data
                });
            }
        });
        uni.getStorage({
            key: 'is_new',
            success(res) {
                that.setData({
                    isNew: res.data
                });
            }
        });
        uni.getStorage({
            key: 'product_title',
            success(res) {
                console.log(res.data);
                that.setData({
                    product_title: res.data
                });
            }
        });
        uni.getStorage({
            key: 'wxId',
            success(res) {
                that.setData({
                    wxId: res.data
                });
            }
        });
        uni.getStorage({
            key: 'token',
            success(res) {
                that.setData({
                    token: res.data
                });
            }
        });
        uni.getStorage({
            key: 'versionId',
            success(res) {
                that.setData({
                    versionId: res.data
                });
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
            key: 'isDigital',
            success(res) {
                that.setData({
                    isDigital: res.data
                });
            }
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //this.mapCtx = wx.createMapContext('myMap')//地图
    },
    onShow: function () {
        uni.showModal({
            title: '重要提示',
            content:
                '全新机下单后请在24小时内发货（之前订单不受影响），非全新机请在72小时内发货，超出发货时效的订单需重新下单估价，相关服务条款已更新，详见本页面下方《服务条款》，点击下单即代表您已阅读并同意服务条款内的全部内容，感谢您的支持！',
            showCancel: false,
            confirmText: '我已知晓'
        });
    },
    onPullDownRefresh: function () {
        uni.stopPullDownRefresh();
    },
    /**
     * 弹出层函数end
     */
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
    methods: {
        //弹出下拉选择事件
        bindPickerChange: function (e) {
            //console.log('picker发送选择改变，携带值为', e.detail.value)
            this.setData({
                index: e.detail.value
            });
        },

        //切换显示
        changeShow1: function () {
            this.setData({
                show1: false,
                show2: true
            });
        },

        changeShow2: function () {
            this.setData({
                show2: false,
                show1: true
            });
        },

        //点击常见问题
        seeQuestions: function () {
            uni.navigateTo({
                url: '../questionguide/questionguide'
            });
        },

        //单独获取手机号的输入值
        listenCodeInput: function (e) {
            // console.log(e)
            let that = this;
            that.setData({
                codeValue: e.detail.value
            });
        },

        getCheckCode: function () {
            // 发送验证码参数
            var send_code_params = {
                phone: '',
                remark: 'placeOrder'
            };
            let if_pass;
            let mobile = /^1([35789][0-9]|4[579]|66|7[0135678]|9[189])[0-9]{8}$/;
            let param_phone = this.codeValue;
            param_phone = param_phone.replace(/\s+/g, '');
            if_pass = mobile.test(param_phone);
            if (if_pass) {
                send_code_params.phone = param_phone;
                // 发送验证码
                this.sendCodeFun(send_code_params);
            } else {
                uni.showToast({
                    title: '请输入有效的手机号码',
                    icon: 'none',
                    duration: 2000,
                    mask: false
                });
            }
        },

        //限制45s验证码获取间隔
        // 15084422039
        times: function () {
            let that = this;
            let t;
            this.tiktok--;
            // console.log('禁止');
            //禁止点击的效果
            this.setData({
                btntext: this.tiktok + '秒后再试',
                ifPress: true,
                btnColor: '#ffd22b'
            });
            //console.log(this.data.tiktok)
            t = setTimeout(function () {
                that.times();
            }, 1000);
            if (this.tiktok <= 0) {
                // 计时重置为45秒
                this.tiktok = 45;
                clearTimeout(t);
                //恢复点击的效果
                this.setData({
                    btntext: '再次获取',
                    ifPress: false,
                    btnColor: '#B55946'
                });
            }
        },

        sendCodeFun: function (send_code_params) {
            let that = this;
            uni.request({
                url: `${domain.domain_qupingce}/common/sendCode`,
                method: 'get',
                header: {
                    firm: 'jd'
                },
                data: send_code_params,
                dataType: 'json',
                success: (res) => {
                    if (res.statusCode === 200) {
                        if (res.data.status === 200) {
                            that.setData({
                                isShow: true
                            });
                            uni.showToast({
                                title: '发送成功',
                                icon: 'success',
                                duration: 2000,
                                mask: false
                            });
                            //发送成功才禁止点击
                            this.times();
                        } else {
                            //  console.log(res.data.msg)
                            uni.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 2000,
                                mask: false
                            });
                        }
                    }
                }
            });
        },

        //点击下单按钮，先表单验证，再下单
        formSubmit: function (e) {
            console.log('下单下单1');
            // console.log(this.data.product_title);
            // wx.getStorageInfo({
            //   success(res) {
            //     console.log(res)
            //   }
            // })
            //正则
            let mobile = /^1([35789][0-9]|4[579]|66|7[0135678]|9[189])[0-9]{8}$/;
            let check_name = /^[\u4E00-\u9FA5]+$/; //中文正则
            let check_mail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //邮箱
            //let check_bank = /^([1-9]{1})(\d{15}|\d{18})$/;//银行卡号验证
            let check_bank = /^\d{16,19}$/;
            //订单参数
            var order_params = {
                collect_money_account: e.detail.value.dealAccount,
                //收款账号
                collect_money_account_name: e.detail.value.dealName,
                //收款人姓名
                seller_phone: e.detail.value.dealPhone,
                //手机号码
                code: e.detail.value.checkCode,
                //验证码
                version_name: this.product_title.product_name,
                //机型名称
                version_id: this.versionId,
                //机型id
                brand_name: this.product_title.brand_name,
                //品牌名字
                recycle_money: this.final_price,
                //估价
                version_infos_array: this.product_details,
                //机器信息
                money_account_type: e.detail.value.dealWay,
                //收款方式
                source: e.detail.value.source,
                //机器来源
                imei: e.detail.value.imei,
                token: this.token,
                // wxId: this.data.wxId,
                original_money: this.old_final_price,
                //没有加上加价卷金额的估价

                markup_money: this.product_title.markup_money,
                //加价卷金额
                markup_id: this.product_title.markup_id,
                //加价卷id

                //llq 范围加价券参数===============2021-9-2
                mrremark: this.product_title.markup_money != 0 ? this.product_title.mrremark : '',
                //哪种类型的加价券文字备注
                mstart_time: this.product_title.markup_money != 0 && '机型加价' != this.product_title.markup_money.mrremark ? this.product_title.start_time : '',
                //范围加价券开始
                mend_time: this.product_title.markup_money != 0 && '机型加价' != this.product_title.markup_money.mrremark ? this.product_title.end_time : '',
                //范围加价券结束
                //llq 范围加价券参数===========结束====2021-9-2

                isNew: this.isNew,
                //是否全新机
                other_money: this.other_money ? this.other_money : 0 //初始加价活动
            };

            console.log('order_params');
            console.log(order_params);
            console.log('order_params');
            let if_pass_phone;
            let if_pass_account;
            let if_pass_name; //验证
            if_pass_phone = mobile.test(order_params.seller_phone); //手机号验证
            mobile.test(order_params.collect_money_account) || check_mail.test(order_params.collect_money_account) || check_bank.test(order_params.collect_money_account)
                ? (if_pass_account = true)
                : (if_pass_account = false); //收款账号验证
            if_pass_name = check_name.test(order_params.collect_money_account_name); //名字验证
            if (order_params.imei == undefined || order_params.imei == null || order_params.imei == 'undefined') {
                order_params.imei = '';
            } //智能数码没有imei
            if (if_pass_phone) {
                if (order_params.code.length > 1) {
                    if (if_pass_account) {
                        if (if_pass_name && order_params.collect_money_account_name.length > 1 && order_params.collect_money_account_name.length < 9) {
                            this.orderFun(order_params);
                        } else {
                            uni.showToast({
                                title: '名字应由2-8位中文组成',
                                icon: 'none',
                                duration: 2000,
                                mask: false
                            });
                        }
                    } else {
                        uni.showToast({
                            title: '请输入有效的收款账号',
                            icon: 'none',
                            duration: 2000,
                            mask: false
                        });
                    }
                } else {
                    uni.showToast({
                        title: '请输入验证码',
                        icon: 'none',
                        duration: 2000,
                        mask: false
                    });
                }
            } else {
                uni.showToast({
                    title: '请输入有效的手机号码！',
                    icon: 'none',
                    duration: 2000,
                    mask: false
                });
            }
        },

        //15084422039
        //下单函数
        orderFun: function (order_params) {
            console.log('下单下单2');
            uni.showLoading({
                mask: true
            });
            if (order_params.token == null || order_params.token == undefined) {
                order_params.token = '';
            }
            if (order_params.wxId == null || order_params.wxId == undefined) {
                order_params.wxId = '';
            }
            switch (order_params.source) {
                case '0':
                    order_params.source = '自己购买';
                    break;
                case '1':
                    order_params.source = '活动获得';
                    break;
                case '2':
                    order_params.source = '他人赠送';
                    break;
            }
            let that = this;
            console.log('order_params');
            //console.log(order_params)
            //order_params,order_params.token =22;
            uni.request({
                url: `${domain.domain_qupingce}/place/order/placeAnOrderFromWX`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    firm: 'jd'
                },
                data: order_params,
                dataType: 'json',
                method: 'post',
                success: function (res) {
                    if (res.statusCode === 200) {
                        if (res.data.status === 200) {
                            console.log(res.data);
                            that.setData({
                                orderNumber: res.data.orderNumber
                            });
                            uni.setStorage({
                                key: 'token',
                                data: res.data.token
                            });
                            uni.showModal({
                                title: '报价已提交',
                                content: '请及时寄出机器，并在个人中心填写发货信息，否则将导致延迟打款甚至无法完成回收',
                                confirmText: '去发货',
                                showCancel: false,
                                success(res) {
                                    if (res.confirm) {
                                        //console.log('用户点击确定')
                                        uni.switchTab({
                                            url: '/pages/mine/user'
                                        });
                                    }
                                }
                            });
                        } else if (res.data.status === 501) {
                            that.resLogin();
                        } else {
                            uni.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 2000,
                                mask: false
                            });
                        }
                    } else {
                        uni.showToast({
                            title: '下单请求发送失败，请您联系客服',
                            icon: 'none',
                            duration: 4000,
                            mask: false
                        });
                    }
                },
                fail: function (r) {
                    // console.log('2222222222222222')
                    // _this.orderFun();
                    console.log(r);
                    uni.showToast({
                        title: '下单请求未发出',
                        icon: 'none'
                    });
                }
            });
            uni.hideLoading({
                mask: true
            });
        },

        /**
         * 501错误重新登录
         */
        resLogin: function () {
            var that = this;
            uni.showModal({
                title: '登录提示',
                content: '登录已过期或登录失败，是否重新登录？',
                confirmText: '确定',
                cancelText: '取消',
                success: function (re) {
                    if (re.confirm) {
                        uni.showLoading({
                            title: '登录中...',
                            mask: true
                        });
                        app.globalData.login(); //点击确认就重新登录
                        //console.log(that.data.token)
                        setTimeout(function () {
                            that.setData({
                                token: uni.getStorageSync('token')
                            });
                        }, 500);
                        uni.hideLoading();
                    }
                }
            });
        },

        showTeach: function () {
            uni.showModal({
                title: '如何查看序列号/IMEI',
                content: '手机在拨号界面输入*＃06＃,即可查看imei,平板在设置-关于本机，即可查看序列号/IMEI，新机可从包装盒查看(部分双卡手机会有两个IMEI,通常以第一个为准)',
                confirmText: '我知道了',
                showCancel: false,
                decode: 'true',
                success(res) {
                    if (res.cancel) {
                        //console.log('用户点击取消')
                    }
                }
            });
        },

        //勾选协议
        agreeFun: function (event) {
            let that = this;
            let type = event.currentTarget.dataset.type;
            if (type === 'no') {
                // 点击勾选
                that.setData({
                    isAgree: true
                });
            } else if (type === 'yes') {
                //点击取消勾选
                that.setData({
                    isAgree: false
                });
            }
        },

        /**
         * 弹出层函数
         */
        myModalShow: function () {
            this.setData({
                showModal: true
            });
        },

        preventTouchMove: function () {
            //此空函数阻止touchmove向下冒泡传递
        },

        closeModal: function () {
            this.setData({
                showModal: false
            });
        }
    }
};
</script>
<style>
/* pages/placeorderpage/placeorderpage.wxss */

input {
    width: 376rpx;
    background-color: #f5f5f5;
    font-size: 24rpx;
    padding: 10rpx 20rpx;
    border-radius: 10rpx;
}

.container {
    margin-top: 100rpx;
    background-color: #f7f6fb;
}

.chose-box {
    width: 100%;
    height: 200rpx;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    text-align: center;
    /* padding: 20rpx; */
    padding-top: 20rpx;
}

.img1 {
    width: 400rpx;
}

.img1 image {
    width: 200rpx;
    height: 180rpx;
}

/**表单部分样式开始**/

.container .formClass {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 30rpx;
    color: #333;
}
.container .formClass .order-box input {
    background-color: white;
}
.formClass .order-box {
    width: 94%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 40rpx;
    background-color: white;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    min-height: 500rpx;
}
.single-input {
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: row;
    background-color: #fff;
    align-items: center;
    padding: 20rpx;
    margin-top: 10rpx;
    border-bottom: #f1f1f1 2rpx solid;
}

.j-address input {
    color: #999;
}

.formClass .j-province-city-county .picker {
    width: 480rpx;
    position: relative;
}

.j-province-city-county .picker image {
    position: absolute;
    right: 10rpx;
    width: 48rpx;
    height: 48rpx;
}

.formClass .j-phone {
    background-color: #f1f1f1;
}

/**表单部分样式结束**/

.count_btn {
    width: 80%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 40rpx;
    margin-bottom: 50rpx;
    padding: 30rpx 20rpx;
    background-image: linear-gradient(to right, #409ee6, #4ba7ec);
    color: white;
    font-size: 27rpx;
    border-radius: 30rpx;
}

.count_btn_fake {
    width: 80%;
    margin-right: auto;
    margin-left: auto;
    margin-top: 40rpx;
    margin-bottom: 50rpx;
    padding: 30rpx 20rpx;
    background-color: #c9c9c9;
    color: white;
    font-size: 27rpx;
    border-radius: 30rpx;
}

.placeholderStyle {
    font-size: 24rpx;
    color: #c5c5c5;
}

.picker {
    font-size: 26rpx;
    color: rgb(65, 192, 122);
    margin-left: 25rpx;
}

.section radio-group {
    /* margin-top: 25rpx; */
    margin-left: 25rpx;
}

.codeTipsBox {
    width: 94%;
    margin-top: 10rpx;
    margin-left: auto;
    margin-right: auto;
    background-color: white !important;
    height: 30rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
}

.deal-way {
    margin-left: 17rpx;
    font-size: 26rpx;
    color: #5a4a39;
    font-weight: bolder;
}

.askImg {
    width: 30rpx;
    height: 30rpx;
}

.codeTipsText {
    /* margin-top: -30rpx !important; */
    padding: 10rpx;
    /* background-color: #fbfbfb !important; */
    color: #fa6334;
    font-size: 26rpx;
    background-color: white;
}

.recycleTips {
    width: 94%;
    margin-left: auto;
    margin-right: auto;
    color: #a3a29e;
    font-size: 26rpx;
    padding: 20rpx;
}

.attention {
    font-size: 32rpx;
    color: #212123;
    font-weight: bold;
    margin-top: 30rpx;
    margin-bottom: 30rpx;
}

.littleTips {
    font-size: 32rpx;
    color: #212123;
    font-weight: bold;
    margin-top: 30rpx;
    margin-bottom: 30rpx;
}

.recycleTips view {
    padding: 8rpx;
}

.title-line {
    display: block;
    position: relative;
    width: 90%;
    text-align: left;
    color: #000;
    float: left;
    padding-left: 20rpx;
    margin-top: 40rpx;
    border-left: 14rpx solid #ffd22b;
    /* display: flex;
  flex-direction: row;
  justify-content: space-between; */
    margin: 10rpx 0;
    margin-bottom: 10rpx;
}

.count-title-left {
    display: flex;
    width: auto;
    flex-direction: row;
    align-items: center;
}

.featrue-name {
    font-size: 32rpx;
    font-weight: bold;
}

#myMap {
    /* position: absolute; */
    margin: 0 auto;
    width: 95%;
    height: 100rpx;
    margin-top: 50rpx;
}

.recycleTips2 {
    margin-top: 100rpx;
}

.normalQ {
    font-size: 32rpx;
    color: #4ba7ec;
    font-weight: bold;
    text-align: center;
    margin-right: 30rpx;
    margin-top: 50rpx;
    margin-bottom: 100rpx;
}

.getCodeBtn {
    width: 160rpx;
    padding: 18rpx 15rpx;
    color: #fcb501;
    font-size: 23rpx;
    border-radius: 120rpx;
    margin-left: 20rpx;
    border: #fcb501 solid 2rpx;
}

.codeInput {
    width: 190rpx !important;
}

/* 弹出层样式------------------ */

.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    z-index: 9000;
    opacity: 0.7;
}

.modalBox {
    width: 630rpx;
    height: 670rpx;
    position: fixed;
    top: 50%;
    left: 0;
    z-index: 9999;
    margin: -345rpx 60rpx;
    background-color: #fff;
    border-radius: 6rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.demoImg {
    width: 400rpx;
    height: 400rpx;
}

.outImg {
    width: 50rpx;
    height: 50rpx;
    position: absolute;
    right: -15rpx;
    top: -15rpx;
}

.myModal-title {
    padding-top: 25rpx;
    font-size: 40rpx;
    position: relative;
    height: 80rpx;
    width: 100%;
    background-color: rgb(252, 207, 83);
    text-align: center;
    font-weight: bold;
}

.closeModalBtn {
    margin-top: 50rpx;
    color: rgb(252, 145, 83);
    font-size: 30rpx;
}

.explain {
    font-size: 26rpx;
    padding: 15rpx;
    color: rgb(143, 115, 76);
}

/* /弹出层样式------------------ */

.single-input text {
    font-size: 26rpx;
    color: #5a4a39;
    font-weight: bolder;
    min-width: 170rpx;
}

.agreeRules {
    display: flex;
    /* height: 100rpx; */
    width: 54%;
    margin-right: auto;
    margin-left: auto;
    flex-direction: row;
    align-content: center;
    justify-content: flex-start;
    font-size: 25rpx;
    color: gray;
    margin-top: 30rpx;
}

.agreeRules image {
    width: 28rpx;
    height: 28rpx;
}

.agreeRules navigator {
    color: #999999;
}
</style>
