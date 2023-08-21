<!-- @format -->

<template>
	<!-- pages/returngoods/returngoods.axml -->

	<view class="retrun-container">
		<view class="title">
			<text>填写退货信息</text>
		</view>
		<view class="order-has">
			<!-- 1 -->
			<view class="order-title1">
				<!-- 订单号 -->
				<view class="order-number">
					<text>订单号：</text>
					<text class="text-number">{{ orderInfo.order_number }}</text>
				</view>
			</view>
			<!-- 2 -->
			<view class="order-main">
				<!-- 机器图片 -->
				<image :src="domain + orderInfo.img"></image>
				<!-- 机器简介 -->
				<view class="version-intro">
					<view class="version-title">
						<text>{{ orderInfo.version_name }}</text>
					</view>

					<view class="order-other" v-if="orderInfo.secondary_recycle != 0">
						<text class="order-other-3">二次报价：</text>
						<text class="order-other-2">￥</text>
						<text class="order-other-1">{{ orderInfo.secondary_recycle }}.'00'</text>
					</view>
					<view class="order-other" v-else>
						<text class="order-other-3">回收价：</text>
						<text class="order-other-2">￥</text>
						<text class="order-other-1">{{ orderInfo.recycle_money }}.'00'</text>
					</view>
				</view>
			</view>
			<view class="order-button"></view>
		</view>
		<view style="height: 10rpx"></view>
		<view class="form-box">
			<form onSubmit="bindFormSubmit">
				<view class="c-box">
					<view class="thecontent">
						<label>收货姓名：</label>
						<input placeholder="请输入收货姓名" :focus="true" name="sellername" />
					</view>
					<view class="thecontent">
						<label>手机号码：</label>
						<input placeholder="请输入手机号码" name="phone" />
					</view>
					<view class="thecontent2" onTap="changefocus">
						<view class="borderclass">
							<label class="tarea_label">详细退回地址：</label>
							<textarea class="tarea" name="address"></textarea>
						</view>
					</view>
				</view>
				<view class="note">
					<view class="checkCode">
						很遗憾没能与您完成交易，在您提交完整地址信息后，工作人员一般会在当日晚八点前寄出快递退回您的机器
					</view>
				</view>
				<button form-type="submit" class="btn1">提交</button>
			</form>
		</view>

		<view style="height: 100rpx"></view>
	</view>
</template>
<script module="tool" src="./tool.sjs" lang="sjs"></script>
<script>
	import headerCmp from '@/components/header/header';
	import listmessageCmp from '@/components/listmessage/listmessage';
	import { commonDomain as domain } from '../../constant/common';
	import { tips } from '../../utils/tips';
	const app = getApp();
	export default {
		components: {
			headerCmp,
			listmessageCmp
		},
		data() {
			return {
				hasOrder: false,
				domain: domain.apiHost,
				userInfo: null,
				orderInfo: null,
				areaf: false
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function (options) {
			if (options.order == null || options.order == undefined) {
				tips.ERROR_500();
				return;
			}
			var order = decodeURIComponent(options.order);
			let userInfo = uni.getStorageSync('userInfo'); //从缓存中获取用户的信息

			if (userInfo == null) {
				tips.ERROR_401();
				return;
			} else if (order == null) {
				tips.ERROR_500();
				return;
			}
			this.setData({
				userInfo: userInfo,
				orderInfo: JSON.parse(order),
				hasOrder: true
			});
		},
		methods: {
			resLogin: function () {
				var that = this;
				uni.showModal({
					title: '登录提示',
					content: '登录已过期或登录失败，是否重新登录？',
					confirmText: '确定',
					cancelText: '取消',
					success: function (res) {
						if (res.confirm) {
							uni.showLoading({
								title: '登录中...',
								mask: true
							});
							app.globalData.login(); //点击确认就重新登录

							uni.hideLoading();
						}
					}
				});
			},

			changefocus(e) {
				//地址输入框改变焦点事件
				this.setData({
					areaf: true
				});
			},

			/**
			 * 订单跳转到详情页面
			 */
			toOrderDetail: function (e) {
				var data = JSON.stringify(e.target.dataset.order);
				data = encodeURIComponent(data);
				var url = e.target.dataset.url;
				uni.navigateTo({
					url: url + '?order=' + data
				});
			},

			bindFormSubmit(e) {
				if (!this.hasOrder) {
					uni.alert({
						title: '',
						content: '暂无订单可退'
					});
					return;
				}
				var mobilereg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
				var sellername = e.detail.value.sellername;
				var phone = e.detail.value.phone;
				var address = e.detail.value.address;
				if (sellername == '') {
					uni.alert({
						title: '',
						content: '名字长度或格式错误'
					});
					return;
				}
				if (phone == '' || !mobilereg.test(phone)) {
					uni.alert({
						title: '',
						content: '请输入正确的手机号'
					});
					return;
				}
				if (address == '') {
					uni.alert({
						title: '',
						content: '地址不能为空'
					});
					return;
				}
				let _this = this;
				let data = {
					order_number: _this.orderInfo.order_number,
					is_agree_price: 'False',
					//用户不同意二次报价
					return_name: sellername,
					//收件人地址【必填】
					return_phone: phone,
					//收件人电话【必填】
					return_address: address,
					//收件人地址【必填】
					token: uni.getStorageSync('token') //身份凭据【必填】
				};

				uni.request({
					url: `${domain.apiHost}/action/order/isAgreeChangePrice`,
					//提交地址
					method: 'GET',
					data: data,
					headers: {
						'content-type': 'application/json' // 默认值
					},

					success(res) {
						//请求状态码
						if (res.data.status == '200') {
							//后台返回成功状态码
							uni.alert({
								title: '提示',
								content: '退件信息已成功提交！',
								success(re) {
									uni.navigateBack({});
								}
							});
						} else if (res.data.status == '500') {
							uni.alert({
								title: '提示',
								content: res.data.msg
							});
						} else if (res.data.status == '501') {
							// wx.showModal({
							//   title: '',
							//   content: "登录已过期",
							//   showCancel: false
							// });
							_this.resLogin();
						} else if (res.data.status == '500000') {
							uni.alert({
								title: '提示',
								content: '失败，请稍后再试！',
								showCancel: false
							});
						}
					}
				});
			}
		}
	};
</script>
<style>
	@import './returngoods.css';
</style>
