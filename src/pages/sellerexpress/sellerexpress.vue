<!-- @format -->

<template>
	<view style="height: 100%">
		<!-- 用户晒单 -->
		<view class="container-ex">
			<container title="订单信息">
				<view
					slot="headerRight"
					data-url="orderdetails/orderdetail"
					:data-order="orderInfo"
					@click="toOrderDetail"
				>
					查看详情
				</view>
				<view class="order-has">
					<view class="order-title">
						<view class="order-number">
							<text>订单号：</text>
							<text class="text-number">{{ orderInfo.order_number }}</text>
						</view>
					</view>
					<view class="order-main">
						<!-- 机器图片 -->
						<image :src="domain + orderInfo.img" class="spu-avatar" />
						<!-- 机器简介 -->
						<view class="version-intro">
							<view class="version-title">{{ orderInfo.version_name }}</view>
							<view v-if="orderInfo.secondary_recycle != 0" class="order-other">
								<text class="order-other-3">二次报价：</text>
								<text class="order-other-2">￥</text>
								<text class="order-other-1">{{ orderInfo.secondary_recycle }}.00</text>
							</view>
							<view v-else class="order-other">
								<text class="order-other-3">回收价：</text>
								<text class="order-other-2">￥</text>
								<text class="order-other-1">{{ orderInfo.recycle_money }}.00</text>
							</view>
						</view>
					</view>
				</view>
			</container>

			<view class="receiveaddress" @click="copyAddress(address)">
				<text>收货信息： {{ address }}</text>
				<view class="copy-btn">
					<button>点击复制</button>
				</view>
			</view>

			<form class="formClass">
				<view class="content-box">
					<view class="express-cl">
						<!-- uni: 属性space不被支持，请调整 -->
						<text space="ensp" class="form-item-title">快递公司：</text>
						<view class="picker form-item-value">
							<picker onChange="chooseCompany" v-model="express_index" :range="expresses">
								<view class="form-item-value">
									{{ expresses[express_index] }}
									<uni-icons type="compose" size="16" />
								</view>
							</picker>
						</view>
					</view>
					<view class="j_express_number">
						<text class="form-item-title">快递单号：</text>
						<view class="form-item-value">
							<input
								type="text"
								v-model="j_express_number"
								placeholder="请输入快递单号"
								class="form-item-value"
							/>
						</view>
					</view>
					<view class="remark">
						<view>
							<text>备注信息（非必填）：</text>
						</view>
						<textarea v-model="remark" class="remark-detail" maxlength="50" />
					</view>
				</view>
				<!-- 提示部分 -->
				<view class="note">
					<text>
						请您使用顺丰快递/京东/EMS，运费由尖端数码承担。如果登录手机号不是您的常用号码，可在备注填写常用手机号等其他备注信息，方便客服与您联系。为了您的货物安全,建议您选择顺丰快递
					</text>
				</view>
				<button :plain="true" class="yuyue-btn" @click="formSubmit">提交</button>
			</form>
		</view>

		<my-drag-service />
	</view>
</template>
<script module="tool" src="./tool.sjs" lang="sjs"></script>
<script>
	// pages/sellerexpress/sellerexpress.js
	import { tips } from '../../utils/tips';
	import { commonDomain as domain } from '../../constant/common';
	import { dateTimePicker, getMonthDay } from '../../utils/util';
	const app = getApp();
	export default {
		components: {},
		data() {
			return {
				domain: domain.apiHost,
				paramData: null,
				userInfo: {},

				//用户信息
				orderInfo: null,

				address: '广东省深圳市龙岗区亿盛大厦，尖端数码回收收，18475563915',
				//上一个页面传递过来的订单信息
				expressShow: false,

				expresses: ['顺丰快递', 'EMS快递', '京东快递'],

				//默认显示顺丰快递
				express_index: 0,
				remark: '',
				j_express_number: '',
				remarkClass: ''
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function (options) {
			this.paramData = options;
			app.globalData.login();
			this.initData();
		},
		methods: {
			/**
			 * 订单跳转到详情页面
			 */
			toOrderDetail: function (e) {
				let data = JSON.stringify(e.target.dataset.order);
				data = encodeURIComponent(data);
				uni.navigateTo({
					url: '/pages/orderdetails/orderdetail?order=' + data
				});
			},

			initData() {
				const paramData = uni.getStorageSync('orderDetail') || '{}';
				let phoneNumber = uni.getStorageSync('phoneNumber'); //从缓存中获取用户的信息
				if (phoneNumber == null) {
					tips.ERROR_401();
					return;
				}
				this.setData({
					orderInfo: paramData
				});
			},

			//表单提交事件
			formSubmit() {
				/**对数据进行校验 */

				const companyName = this.expresses[this.express_index];

				if (this.j_express_number == null || this.j_express_number == '') {
					tips.ERROR_500000('请填写快递单号');
					return;
				}

				let _this = this;

				//按格式组合多个订单号
				let orderNumbers = _this.orderInfo.order_number;

				let data = {
					orderNumbers: orderNumbers,
					expree_company: companyName,
					express_number: this.j_express_number,
					order_remark: this.remark,
					//50字以内;
					token: uni.getStorageSync('token') //身份凭据【必填】
				};

				wx.request({
					url: `${domain.apiHost}/action/order/sendOut`, //提交地址
					method: 'POST',
					data: data,
					header: {
						'content-type': 'application/x-www-form-urlencoded' // 默认值
					},

					success(res) {
						//请求状态码
						if (res.data.status == '200') {
							//后台返回成功状态码
							uni.showModal({
								title: '提示',
								content: res.data.msg,
								buttonText: '确定',
								success: () => {
									uni.navigateTo({ url: '/pages/orderList/orderList' });
								}
							});
						} else if (res.data.status == '500') {
							uni.showModal({
								title: '提示',
								content: res.data.msg,
								buttonText: '确定'
							});
						} else if (res.data.status == '501') {
							_this.resLogin();
						} else if (res.data.status == '500000') {
							uni.showModal({
								title: '提示',
								content: '失败，请稍后再试！',
								buttonText: '确定'
							});
						}
					}
				});
			},

			copyAddress: function (address) {
				uni.setClipboardData({
					data: address,
					success: function () {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						});
					}
				});
			},

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

			//选择快递公司
			chooseCompany(e) {
				this.setData({
					express_index: e.detail.value
				});
			},

			//备注框聚焦时候的函数
			remarkAddClass() {
				this.setData({
					remarkClass: 'heightlight'
				});
			},

			//备注框失去焦点的时候
			remarkRemoveClass() {
				this.setData({
					remarkClass: null
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import './sellerexpress.scss';
</style>
