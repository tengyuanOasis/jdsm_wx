<!-- @format -->

<template>
	<view class="recent-order">
		<!-- 订单列表 -->
		<view class="order-list">
			<!-- 没有订单 -->
			<view
				v-if="recentOrders.length == 0"
				class="order-null"
			>
				<empty
					v-if="recentOrders.length == 0"
					message="一个订单也没有"
					image="https://gw.alipayobjects.com/mdn/rms_7cc883/afts/img/A*PG7NQoXbN38AAAAAAAAAAAAAARQnAQ"
					class="no-order"
				/>
				<view v-else>
					<image src="/static/images/dataload.gif" />
				</view>
			</view>
			<!-- 有订单 -->
			<view v-else>
				<view
					class="order-has"
					v-for="(order, index) in recentOrders"
					:key="index"
				>
					<!-- 1 -->

					<view class="order-title1">
						<!-- 订单号 -->
						<view class="order-number">
							<text>订单号：</text>
							<text class="text-number">{{ order.order_number }}</text>
						</view>
						<!-- 订单状态 -->
						<view class="order-status">
							<text v-if="order.order_status == 'waitdelivery'">等待发货</text>
							<text v-else-if="order.order_status == 'cancel'">已取消</text>
							<text v-else-if="order.order_status == 'delivered'">回收中</text>
							<text v-else-if="order.order_status == 'Receiving'">回收中，正在验机</text>
							<text v-else-if="order.order_status == 'check'">已收货，正在验机</text>
							<text v-else-if="order.order_status == 'remit'">等待打款</text>
							<text v-else-if="order.order_status == 'successfully'">交易成功</text>
							<text v-else-if="order.order_status == 'waitdoor'">待上门</text>
							<text v-else-if="order.order_status == 'dooring'">上门中</text>
							<text v-else>交易失败</text>
						</view>
					</view>

					<!-- 2 -->

					<view class="order-main">
						<!-- 机器图片 -->
						<image :src="domain + order.img"></image>
						<!-- 机器简介 -->
						<view class="version-intro">
							<view class="version-title">
								<text>{{ order.version_name }}</text>
							</view>
							<view class="version-deatil">
								<text>规格:</text>
								<text
									v-for="(it, index1) in order.phone_info"
									:key="index1"
									>{{ it.option_name }}</text
								>
							</view>
							<view
								v-if="order.secondary_recycle != 0"
								class="order-other"
							>
								<text class="order-other-3">二次报价：</text>
								<text class="order-other-2">￥</text>
								<text class="order-other-1">{{ order.secondary_recycle }}.00</text>
							</view>
							<view
								v-else
								class="order-other"
							>
								<text class="order-other-3">回收价：</text>
								<text class="order-other-2">￥</text>
								<text class="order-other-1">{{ order.recycle_money }}.00</text>
							</view>
						</view>
					</view>

					<view class="order-button">
						<view
							data-url="orderdetails/orderdetail"
							:data-order="order"
							class="order-button-deatil button-view"
							@click="toOrderDetail(order)"
							>查看详情</view
						>
						<view
							v-if="
								order.is_agree_price == 'isagree' &&
								order.order_status != 'successfully' &&
								order.order_status != 'unsuccessful'
							"
						>
							<view
								class="button-view"
								@click="yesAgreedTo"
								:data-ordernumber="order.order_number"
								>同意报价</view
							>
							<view
								@click="notAgreedTo"
								:data-order="order"
								class="button-view"
								>不同意报价</view
							>
						</view>
						<view
							v-if="order.is_agree_price == 'False'"
							class="button-view"
							>未同意报价</view
						>
						<view
							v-if="order.is_agree_price == 'True'"
							class="button-view"
							>已同意报价</view
						>
						<view
							v-if="order.order_status == 'waitdelivery'"
							@click="sendOut(order)"
							:data-order="order"
							class="button-view sendOut"
							>去发货</view
						>
						<view
							v-if="order.order_status == 'cancel'"
							class="button-view"
							@click="delOrder"
							:data-ordernumber="order.order_number"
							>删除订单</view
						>
						<view
							v-if="['waitdelivery', 'delivered', 'visit', 'waitdoor'].includes(order.order_status)"
							class="button-view"
							@click="cancelOrderFun"
							:data-ordernumber="order.order_number"
						>
							取消订单
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { commonDomain as domain } from '../../constant/common';
	// pages/mine/user.js
	const app = getApp();
	export default {
		data() {
			return {
				domainName: domain.apiHost,
				domain: domain.apiHost,
				waitSendCount: 0,
				userInfo: {},

				//微信用户信息
				hasUserInfo: false,

				canIUse: uni.canIUse('button.open-type.getAuthorize'),
				userInfo1: null,

				//初始值
				recentOrders: [],

				//近期订单
				dataLoad: false,

				//数据加载
				error: {
					//弹框消息
					title: '',
					msg: '',
					confirm: '',
					cancel: ''
				},

				error1: {
					//弹框消息
					title: '',
					msg: '',
					confirm: '',
					cancel: ''
				},

				error3: {
					//操作错误提示
					title: '',
					msg: '',
					confirm: '',
					cancel: ''
				},

				//点击不同意报价订单item
				current: null,

				order: {
					order_number: '',
					order_status: '',
					img: '',
					version_name: '',
					phone_info: [],
					secondary_recycle: 0,
					recycle_money: '',
					is_agree_price: ''
				},

				it: {
					option_name: ''
				}
			};
		},
		onLoad: function (options) {
			console.log('options: ', options);
			this.getRecentOrders();
		},
		onShow: function () {
			//切换时不会加载
			this.getRecentOrders({});
		},
		onPullDownRefresh: function () {
			//近期订单
			this.getRecentOrders();
			uni.stopPullDownRefresh();
		},
		methods: {
			/**
			 * 生命周期函数--监听页面加载
			 */

			goProductionPage: function () {
				uni.navigateTo({
					url: '/pages/category/category'
				});
			},

			goPlaceOrderStepsPage: function () {
				const { versionId } = this.phoneInfo;
				uni.navigateTo({
					url: `/pages/placeordersteps/placeordersteps?versionId=${versionId}`
				});
			},

			/**
			 * 订单跳转到详情页面
			 */
			toOrderDetail(order) {
				uni.setStorageSync('orderDetail', order);
				uni.navigateTo({
					url: '/pages/orderdetails/orderdetail'
				});
			},

			gotoShowMulitOrder: function () {
				uni.navigateTo({
					url: 'ShowMulitOrder/ShowMulitOrder'
				});
			},

			/**
			 * 获取近期订单
			 *
			 */
			getRecentOrders: function () {
				uni.showLoading({
					content: '加载中...'
				});
				let token = uni.getStorageSync('token');
				let that = this;
				that.setData({ dataLoad: true });
				wx.request({
					url: `${domain.apiHost}/view/order/getOrdersByUser`,
					data: {
						token: token
					},
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						firm: 'jd'
					},
					dataType: 'json',
					method: 'POST', //get为默认方法/POST
					success: function (r) {
						that.setData({
							dataLoad: false
						});

						if (r.data.status == 200) {
							//  console.log(r.data.data)
							//计算待发货的数量,两个及以上就建议一键发货
							let count = 0;
							for (let k in r.data.data) {
								if (r.data.data[k].order_status == 'waitdelivery') {
									count++;
								}
							}
							//只取前5
							r.data.data = r.data.data.slice(0, 5);
							that.setData({
								recentOrders: r.data.data,
								waitSendCount: count
							});
						} else {
							that.resLogin(); //登录过期重新登录
						}
					},
					fail: function (err) {}, //请求失败
					complete: function (r) {
						uni.hideLoading();
					} //请求完成后执行的函数
				});
			},

			/**
			 * 未同意二次报价
			 */
			notAgreedTo: function (e) {
				var order = JSON.stringify(e.target.dataset.order);
				order = encodeURIComponent(order);
				uni.showActionSheet({
					title: '您可以选择退回机器或联系客服',
					items: ['直接退回机器', '联系客服'],
					cancelButtonText: '取消',
					success: (res) => {
						if (res.index === 0) {
							que;
							this.notAgreedToConfirm();
						} else if (res.index === 1) {
							uni.showModal({
								title: '小程序客服暂未开通，请您咨询淘宝客服'
							});
						} else {
							return null;
						}
					}
				});
				this.setData({
					current: order
				});
				/*    this.setData({
	          error: {
	            msg: "您可以选择退回机器或联系客服",
	            confirm: '直接退回机器',
	            cancel: '联系客服',
	            contact: true
	          },
	          current: order
	        });
	        this.dialog.showDialog(); */
			},

			/**
			 * 寄回机器
			 */
			notAgreedToConfirm: function () {
				var order = this.current;
				uni.navigateTo({
					url: '../returngoods/returngoods?order=' + order
				});
			},

			/**
			 * 联系客服
			 */
			notAgreedToCancel: function () {
				this.dialog.hideDialog();
			},

			/**
			 * 发货
			 */
			sendOut(order) {
				this.current = order;
				uni.setStorageSync('orderDetail', order);
				uni.showActionSheet({
					title: '选择上门回收或发货方式，自行寄出（仅限顺丰/EMS/京东快递）',
					itemList: ['上门回收/顺丰上门取件', '自行寄出'],
					cancelButtonText: '取消',
					success: (res) => {
						console.log('res: ', res);
						if (res.tapIndex === 1) {
							this.toSend();
						} else if (res.tapIndex === 0) {
							this.theDoorToTake();
						} else {
							return null;
						}
					}
				});
			},

			/**
			 * 自行寄出
			 */
			toSend: function () {
				uni.navigateTo({
					url: '../sellerexpress/sellerexpress'
				});
			},

			/**
			 * 上门取件
			 */
			theDoorToTake: function () {
				uni.navigateTo({
					url: '../onlineexpress/onlineexpress'
				});
			},

			/**
			 * 去发货隐藏
			 */
			hideDialogSendOut: function () {
				this.dialogSendOut.hideDialog();
			},

			/**
			 * 是否同意报价隐藏
			 */
			hideDialog: function () {
				this.dialog.hideDialog();
			},

			/**
			 * 删除订单
			 */
			delOrder: function (e) {
				var orderNumber = e.target.dataset.ordernumber;
				var token = uni.getStorageSync('token');
				var that = this;
				uni.showModal({
					title: '操作提示',
					content: '您将删除该订单，删除后无法恢复，是否确认此操作？',
					confirmText: '确定',
					cancelText: '取消',
					success: function (res) {
						if (res.confirm) {
							uni.showLoading({
								title: '正在删除',
								mask: true
							});
							uni.request({
								url: `${domain.apiHost}/action/order/delOrder`,
								data: {
									token: token,
									orderNumber: orderNumber
								},
								headers: {
									'Content-Type': 'applciation/json'
								},
								method: 'GET',
								//get为默认方法/POST
								success: function (r) {
									uni.hideLoading();
									if (r.data.status == 200) {
										uni.showToast({
											type: 'success',
											content: '订单已删除'
										});
										//that.action.autoHideDialog();
										that.getRecentOrders();
									} else if (r.data.status == 501) {
										that.resLogin();
									} else {
										that.setData({
											error3: {
												//操作错误提示
												title: '操作提示',
												msg: r.data.msg,
												confirm: '',
												cancel: ''
											}
										});
										that.action.autoHideDialog();
									}
								},
								fail: function (err) {},
								//请求失败
								complete: function (r) {} //请求完成后执行的函数
							});
						}
					}
				});
			},

			/**
			 * 取消订单
			 * */
			cancelOrderFun: function (e) {
				var orderNumber = e.target.dataset.ordernumber;
				var token = wx.getStorageSync('token');
				var that = this;
				wx.showModal({
					title: '操作提示',
					content: '您将取消该订单，取消后无法恢复，是否确认此操作？',
					confirmText: '确定',
					cancelText: '取消',
					success: function (res) {
						if (res.confirm) {
							wx.showLoading({
								title: '正在取消',
								mask: true
							});
							wx.request({
								url: `${domain.apiHost}/action/order/cancelingTheOrder`,
								data: {
									token: token,
									orderNumber: orderNumber
								},
								header: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								dataType: 'json',
								method: 'POST', //get为默认方法/POST
								success: function (r) {
									wx.hideLoading();
									if (r.data.status == 200) {
										wx.showToast({
											title: '取消成功',
											icon: 'none'
										});

										that.getRecentOrders();
									} else if (r.data.status == 501) {
										that.resLogin();
									} else {
										wx.showToast({
											title: r.data.msg,
											icon: 'none'
										});
									}
								},
								fail: function (err) {}, //请求失败
								complete: function (r) {} //请求完成后执行的函数
							});
						}
					}
				});
			},

			/**
			 * 同意报价
			 * */
			yesAgreedTo: function (e) {
				var orderNumber = e.target.dataset.ordernumber;
				var token = uni.getStorageSync('token');
				var that = this;
				uni.showModal({
					title: '操作提示',
					content: '您将同意该订单二次报价，是否确认此操作？',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					success: function (result) {
						if (result.confirm) {
							uni.showLoading({
								title: '操作中',
								mask: true
							});
							uni.request({
								url: `${domain.apiHost}/action/order/isAgreeChangePrice`,
								data: {
									token: token,
									order_number: orderNumber,
									is_agree_price: 'True'
								},
								headers: {
									'Content-Type': 'applciation/json'
								},
								method: 'get',
								//get为默认方法/POST
								success: function (r) {
									uni.hideLoading();
									if (r.data.status == 200) {
										uni.showModal({
											title: '提示',
											content: '操作成功'
										});
										//that.action.autoHideDialog();
										that.getRecentOrders();
									} else if (r.data.status == 501) {
										that.resLogin();
									} else {
										uni.showModal({
											title: '提示',
											content: r.data.msg
										});
										//that.action.autoHideDialog();
									}
								},

								fail: function (err) {},
								//请求失败
								complete: function (r) {} //请求完成后执行的函数
							});
						}
					}
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
					success: function (res) {
						if (res.confirm) {
							uni.showLoading({
								title: '登录中...',
								mask: true
							});
							//console.log('进入了reslogin函数')
							app.globalData.login(); //点击确认就重新登录

							uni.hideLoading();
						}
					}
				});
			},

			/**
			 * 解密手机号
			 */

			getPhoneNumber(e) {
				let self = this;
				/*     let mockResponse = {
	          "response":"dOZVk+OkEUwOvFMi/FSuuwQ8DBANQLO5kHagqBmFbxlkA2mx7sQ2qT/8h5OJsbqyL0cr9nAAc8f35/q9DM4VJQ==",
	          "sign":"bCy18T02Pby1/7kLsdw0057e2UG4MLFxvQjo5EUHo2XvpJjoDiSTKHrLpRjFNtc9U+C7mdhaWtWmVOQlBEuDnwdT9+f4eCV77gzZeQBqQx17UokVavmUzxdzmyBdv2f3GHDikiMJnGIpwDZ7Zf6wormCixpjjYqro8jyoJ/+KuzO7hlFkLR6BFj6aLcGVAt2cN0JdO6eGeT54Rc7+AOKUZKKfQ0ruCbe+JWkaYYSpUjCTzZZujThh1RnmJvuQRTLTjhgldEI/lInzvYgHc1us75Ux0ORg/WdPDX4eDIMc4PJfQVsZsRr9Q2TE9HNbaoLg7fNSHLTd1dR4oLQ5cLPBw=="
	          };
	         mockResponse = JSON.stringify(mockResponse); */
				uni.getPhoneNumber({
					success: (res) => {
						let encryptedData = res.response;
						console.log(res);
						console.log(encryptedData);
						uni.request({
							url: `${domain.apiHost}/user/ali/getAliPhoneNumber`,
							data: {
								response: encryptedData //正式后续要切换成encryptedData真报文(已切换)
							},

							headers: {
								'Content-Type': 'applciation/json',
								firm: 'jd'
							},
							method: 'get',
							//get为默认方法/POST
							success: function (r) {
								uni.hideLoading();
								if (r.data.code == 200) {
									//把获取出来的手机号存入缓存//TODO:
									uni.setStorageSync('phoneNumber', r.data.phoneNumber);
									//然后直接登录
									self.nowLogin();
								} else {
									uni.showModal({
										title: '提示',
										content: r.data.msg
									});
									//that.action.autoHideDialog();
								}
							},

							fail: function (err) {},
							//请求失败
							complete: function (r) {} //请求完成后执行的函数
						});
					},

					fail: (res) => {
						console.log(res);
						console.log('getPhoneNumber_fail');
					}
				});
			},

			/**
			 * 直接登录
			 */
			nowLogin: function (e) {
				var that = this;
				uni.showLoading({
					content: '登录中...'
				});
				app.globalData.login();
				setTimeout(function () {
					var token = uni.getStorageSync('token');
					if (token) {
						//近期订单
						that.getRecentOrders();
						that.hideModalUser();
						uni.hideLoading();
					}
				}, 2000);
			}
		}
	};
</script>
<style lang="scss">
	@import './orderList.scss';
</style>
