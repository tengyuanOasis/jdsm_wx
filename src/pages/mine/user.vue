<!-- @format -->

<template>
	<!-- 我的 -->
	<view class="container">
		<!-- 用户信息栏 -->
		<view class="user-info">
			<view v-if="!isLogin" class="user">
				<view class="user-avatar">
					<button v-if="!userInfo" class="auth-button" @click="getAliUserInfo">
						<my-avatar size="medium" />
					</button>
					<my-avatar v-else size="medium" :src="userInfo.avatar" />
				</view>
				<view class="content">
					<!-- #ifdef MP-ALIPAY -->
					<button class="auth-button" hover-class="none" @click="getAliPhoneNumber">
						<view class="nickName">未登录</view>
						<view class="notice">点击授权登陆</view>
					</button>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN -->
					<button
						hover-class="none"
						open-type="getPhoneNumber"
						@getphonenumber="getWxPhoneNumber"
						class="auth-button"
					>
						<view class="nickName">未登录</view>
						<view class="notice">点击授权登陆</view>
					</button>
					<!-- #endif -->
				</view>
			</view>

			<!-- 已登陆 -->
			<view class="user" v-else>
				<view class="user-avatar">
					<button
						v-if="!userInfo"
						class="auth-button"
						open-type="getAuthorize"
						onGetAuthorize="getAliUserInfo"
						onError="onAuthError"
						scope="userInfo"
					>
						<my-avatar size="medium" />
					</button>
					<my-avatar v-else size="medium" :src="userInfo.avatar" />
				</view>
				<!-- 用户信息 -->
				<view class="content">
					<view class="nickName">{{ welcome }} {{ userInfo.nickName || '' }}</view>
					<view class="notice">欢迎使用尖端爱疯数码回收</view>
				</view>
			</view>
		</view>

		<!-- 回收机型 -->
		<view v-if="phoneInfo.phoneName" class="card spu-info">
			<view class="spu-header card-header">
				<view class="spu-header-left card-header-title">热门回收</view>
				<view class="spu-header-right" @click="goProductionPage">换一个卖</view>
			</view>

			<view class="spu-content">
				<image class="spu-avatar" :src="phoneInfo.versionImg" />
				<view class="spu-content-center">
					<view class="spu-content-center-item">
						<text class="color-gray font-12">当前机型：</text>
						<text class="spu-name">{{ phoneInfo.phoneName }}</text>
					</view>
					<view class="spu-content-center-item">
						<text class="color-gray font-12">预估价格：</text>
						<text class="spu-price">
							<text class="font-12">¥</text>
							{{ phoneInfo.much_money }}
						</text>
					</view>
				</view>
				<view class="sell-phone" @click="goPlaceOrderStepsPage">立即估价</view>
			</view>
		</view>

		<container>
			<view class="tool-bar">
				<view class="tool-bar-item" @click="toOrderList">
					<fui-icon name="order-fill" :size="30" />
					我的订单
				</view>
				<view class="tool-bar-item" @click="toQuestion">
					<fui-icon name="qa" :size="30" />
					常见问题
				</view>
				<view class="tool-bar-item" @click="goProductionPage">
					<fui-icon name="mobile-fill" :size="30" />
					更多机型
				</view>
				<view class="tool-bar-item" @click="makePhoneCall">
					<fui-icon name="kefu-fill" :size="30" />
					联系我们: 18475563915
				</view>
				<view class="tool-bar-item">
					<my-service />
					<fui-icon name="message-fill" :size="30" />
					在线客服
				</view>
			</view>
		</container>

		<view class="Company">爱疯尖端数码回收</view>
	</view>
</template>

<script>
	import Models from '@/utils/modelList.js';
	import { commonDomain as domain } from '@/constant/common';
	const app = getApp();
	export default {
		components: {},
		data() {
			return {
				isLogin: false,
				domainName: domain.apiHost,
				domain: domain.apiHost,

				phoneInfo: {
					phoneName: '',
					versionImg: ''
				},

				//机型
				userInfo: {
					avatar: '',
					nickName: ''
				},

				//用户信息
				hasUserInfo: false,

				canIUse: uni.canIUse('button.open-type.getAuthorize'),

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
				cancelOrder: null,

				showModalStatus: false,
				animationData: ''
			};
		},
		computed: {
			welcome() {
				let hour = new Date().getHours();
				let welcome = '';
				if (hour < 6) {
					welcome = '凌晨好';
				} else if (hour < 9) {
					welcome = '早上好';
				} else if (hour < 12) {
					welcome = '上午好';
				} else if (hour < 14) {
					welcome = '中午好';
				} else if (hour < 17) {
					welcome = '下午好';
				} else if (hour < 19) {
					welcome = '傍晚好';
				} else {
					welcome = '晚上好';
				}
				return welcome;
			}
		},
		onShow() {
			this.pageInit();
		},
		onPullDownRefresh() {
			this.pageInit();
			//完成后关闭刷新
			uni.stopPullDownRefresh();
		},
		methods: {
			pageInit() {
				this.getSystemInfo();
				const userInfo = uni.getStorageSync('userInfoAli');

				const token = uni.getStorageSync('token');

				this.setData({
					userInfo: userInfo || null,
					isLogin: Boolean(token)
				});

				if (!token) return;

				//回收用户信息
				app.globalData.getUserInfo();
			},

			toOrderList() {
				uni.navigateTo({
					url: '/pages/orderList/orderList'
				});
			},

			goProductionPage() {
				uni.switchTab({
					url: '/pages/category/category'
				});
			},

			makePhoneCall() {
				uni.makePhoneCall({
					phoneNumber: '18475563915'
				});
			},

			toQuestion() {
				uni.navigateTo({
					url: '/pages/questionguide/questionguide'
				});
			},

			goPlaceOrderStepsPage() {
				const { versionId } = this.phoneInfo;
				uni.navigateTo({
					url: `/pages/placeordersteps/placeordersteps?versionId=${versionId}`
				});
			},

			getSystemInfo() {
				let that = this;
				let modelTemp = Models.appleModel;
				let tempObj = {};
				/* 统一转小写 */
				for (let key in modelTemp) {
					let value_ = modelTemp[key].toLowerCase();
					let key_ = key.toLowerCase();
					tempObj[key_] = value_;
				}
				modelTemp = tempObj;
				uni.getSystemInfo({
					success(res) {
						let model = res.model;
						model = model.toLowerCase();
						model = model.replace(/\s+/g, ''); //取出转换后的机型名字
						let commonName = modelTemp[model]; //用转换后的名字去对比数据库
						if (commonName) {
							that.searchByName(commonName);
						} else {
							that.searchByName('iPhone 14 Pro Max');
						}
					}
				});
			},

			searchByName(key) {
				let that = this;
				uni.request({
					url: `${domain.apiHost}/search/serarchByKey`,
					data: { key },
					header: { 'content-type': 'application/json' },
					method: 'GET',
					success(res) {
						if (+res.statusCode !== 200 || +res.data.status !== 200) return;
						let content = res.data.data; //重新建个数组newArray[]，里面只存机型名字和id，并且机型名字去空格转小写
						let newArray = [];
						for (let t = 0; t < content.length; t++) {
							newArray.push({
								normal_name: content[t].version_name,
								name: content[t].version_name.toLowerCase().replace(/\s+/g, ''),
								id: content[t].version_id,
								title_img: content[t].title_img,
								much_money: content[t].much_money
							});
						}
						let formatKey = key.toLowerCase().replace(/\s+/g, '');
						console.log('formatKey: ', formatKey);
						for (let v = 0; v < newArray.length; v++) {
							if (newArray[v].name == formatKey) {
								that.phoneInfo = {
									phoneName: newArray[v].normal_name,
									versionId: newArray[v].id,
									versionImg:
										that.domainName + '/GetFile/getUploadImg?fileName=' + newArray[v].title_img,
									much_money: newArray[v].much_money
								};
								return;
							}
						}
					}
				});
			},

			getAliUserInfo(e) {
				//支付宝获取用户信息
				uni.getOpenUserInfo({
					fail: (res) => {},
					success: (res) => {
						let userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
						//用户允许
						this.setData({
							userInfo: userInfo,
							hasUserInfo: true,
							canIUse: uni.canIUse('button.open-type.getAuthorize')
						});
						uni.setStorageSync('userInfoAli', userInfo);
						const url = e.target.dataset.url;
						if (url) {
							uni.navigateTo({
								url: url
							});
							this.setData({
								showModalStatus: false
							});
						}
					}
				});
			},

			onAuthError() {
				uni.showToast({
					title: '需授权后继续访问',
					image: '/static/images/icon/500000_error.png',
					duration: 2000,
					mask: true
				});
			},

			gotoAllOrders(e) {
				//未授权无法跳转到个人资料
				if (!this.hasUserInfo && this.canIUse) {
					uni.showToast({
						title: '未授权',
						image: '/static/images/icon/500000_error.png',
						duration: 2000,
						mask: true
					});
					return;
				} else {
					uni.navigateTo({
						url: 'allorders/allorders'
					});
				}
			},

			toOrderDetail(e) {
				let data = JSON.stringify(e.target.dataset.order);
				data = encodeURIComponent(data);
				console.log('data: ', data);
				uni.navigateTo({
					url: '/pages/orderdetails/orderdetail?order=' + data
				});
			},

			gotoShowMulitOrder() {
				uni.navigateTo({
					url: 'ShowMulitOrder/ShowMulitOrder'
				});
			},

			/**
			 * 未同意二次报价
			 */
			notAgreedTo(e) {
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
							uni.showToast({
								title: '小程序客服暂未开通，请您咨询淘宝客服',
								icon: 'none'
							});
						} else {
							return null;
						}
					}
				});
				this.setData({
					cancelOrder: order
				});
			},

			/**
			 * 寄回机器
			 */
			notAgreedToConfirm() {
				var order = this.cancelOrder;
				uni.navigateTo({
					url: '../returngoods/returngoods?order=' + order
				});
			},

			/**
			 * 联系客服
			 */
			notAgreedToCancel() {
				this.dialog.hideDialog();
			},

			/**
			 * 发货
			 */
			sendOut(e) {
				//春节暂停代码start
				// wx.showModal({
				//   title: '春节暂停回收',
				//   content: '很抱歉，春节期间(2019.01.27-2019.02.11)暂停回收，春节过后恢复正常，谢谢您的理解',
				//   confirmText: '我知道了',
				//   showCancel: false,
				//   success(res) {
				//     if (res.confirm) {
				//       //console.log('用户点击确定')
				//       return;
				//     }
				//   }
				// })
				// return;
				//春节暂停代码end
				var order = JSON.stringify(e.target.dataset.order);
				order = encodeURIComponent(order);
				this.setData({
					cancelOrder: order
				});
				uni.showActionSheet({
					title: '选择上门回收或发货方式，自行寄出（仅限顺丰/EMS/京东快递）',
					items: ['上门回收/顺丰上门取件', '自行寄出'],
					cancelButtonText: '取消',
					success: (res) => {
						if (res.index === 1) {
							this.toSend();
						} else if (res.index === 0) {
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
			toSend() {
				var order = JSON.parse(decodeURIComponent(this.cancelOrder));
				let param = [order];
				param = JSON.stringify(param);
				uni.navigateTo({
					url: '../sellerexpress/sellerexpress?orders=' + param
				});
			},

			/**
			 * 上门取件
			 */
			theDoorToTake() {
				var order = JSON.parse(decodeURIComponent(this.cancelOrder));
				let param = [order];
				param = JSON.stringify(param);
				uni.navigateTo({
					url: '../onlineexpress/onlineexpress?orders=' + param
				});
			},

			/**
			 * 去发货隐藏
			 */
			hideDialogSendOut() {
				this.dialogSendOut.hideDialog();
			},

			/**
			 * 是否同意报价隐藏
			 */
			hideDialog() {
				this.dialog.hideDialog();
			},

			/**
			 * 同意报价
			 * */
			yesAgreedTo(e) {
				var orderNumber = e.target.dataset.ordernumber;
				var token = uni.getStorageSync('token');
				var that = this;
				uni.showModal({
					title: '操作提示',
					content: '您将同意该订单二次报价，是否确认此操作？',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					success(result) {
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
								success(r) {
									uni.hideLoading();
									if (r.data.status == 200) {
										uni.showToast({
											title: '操作成功',
											icon: 'success'
										});

										//that.action.autoHideDialog();
										that.getRecentOrders();
									} else if (r.data.status == 501) {
										that.resLogin();
									} else {
										uni.showToast({
											title: r.data.msg,
											icon: 'none'
										});
									}
								},

								fail(err) {},
								//请求失败
								complete(r) {} //请求完成后执行的函数
							});
						}
					}
				});
			},

			/**
			 * 501错误重新登录
			 */
			resLogin() {
				var that = this;
				uni.showModal({
					title: '登录提示',
					content: '登录已过期或登录失败，是否重新登录？',
					confirmText: '确定',
					cancelText: '取消',
					success(res) {
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

			hideModalUser() {
				// 隐藏遮罩层
				var animation = uni.createAnimation({
					duration: 200,
					timingFunction: 'linear',
					delay: 0
				});
				this.animation = animation;
				animation.translateY(300).step();
				this.setData({
					animationData: animation.export()
				});
				setTimeout(
					function () {
						animation.translateY(0).step();
						this.setData({
							animationData: animation.export(),
							showModalStatus: false
						});
					}.bind(this),
					200
				);
			},
			// 支付宝电话号码授权
			getAliPhoneNumber() {
				const _this = this;
				my.getPhoneNumber({
					success: (res) => {
						let encryptedData = res.response;
						my.request({
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
									app.login();
								} else {
									uni.showToast({
										title: r.data.msg,
										icon: 'none'
									});
								}
							},
							fail: function (err) {}
						});
					},
					fail: (res) => {
						console.log(res);
						console.log('getPhoneNumber_fail');
					}
				});
			},

			/**
			 * 解密手机号
			 */

			async getWxPhoneNumber(e) {
				let _this = this;
				uni.showLoading({
					title: '登录中...'
				});
				if (e.detail.iv) {
					uni.request({
						url: `${domain.apiHost}/user/wx/getPhoneNumber`,
						data: {
							code: uni.getStorageSync('powerCode'),
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv
						},
						header: {
							'Content-Type': 'applciation/json',
							firm: 'jd'
						},
						method: 'get',
						success: function (r) {
							console.log('r: ', r);
							if (r.data.code == 200) {
								uni.setStorageSync('phoneNumber', r.data.token.phoneNumber);
								_this.hasPhoneNumber = true;
								app.globalData.login().then((token) => {
									console.log('token: ', token);
									if (!token) return;
									_this.isLogin = true;
									console.log('_this.isLogin: ', _this.isLogin);
								});
								_this.hideModalUser();
							} else {
								uni.showModal({
									title: '操作提示',
									content: r.data.msg
								});
							}
						},
						complete: function (r) {
							uni.hideLoading();
						}
					});
				} else {
					uni.showToast({
						title: '需授权后使用',
						icon: 'none',
						duration: 2000,
						mask: true
					});
				}
			},

			/**
			 * 直接登录
			 */
			async nowLogin(event) {}
		}
	};
</script>
<style lang="scss" scoped>
	@import './user.scss';
</style>
