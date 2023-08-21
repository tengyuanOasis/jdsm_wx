<!-- @format -->

<script>
	import { commonDomain as domain } from './constant/common';
	export default {
		data() {
			return {};
		},
		globalData: {
			userInfo: null,

			versionCheck: function () {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function (res) {});
				updateManager.onUpdateReady(function () {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，是否重启应用？',
						success: function (res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});
				});
				updateManager.onUpdateFailed(function () {
					// 新版本下载失败
					uni.showModal({
						title: '提示',
						content: '新版本下载失败,请退出重试',
						buttonText: '我知道了',
						success: () => {}
					});
				});
			},

			/**
			 * 获取myId
			 */
			getOpenId: function (code) {
				//way=refresh_token&refresh_token=xxx
				var has_my_id = uni.getStorageSync('myId');
				var refreshToken = uni.getStorageSync('refreshToken');
				//已经登录过，就用刷新token的方式请求，见参数取值
				uni.request({
					url: `${domain.apiHost}/user/ali/aliLogin`,
					data: {
						auth_code: refreshToken ? null : code,
						way: refreshToken ? 'refresh_token' : 'authorization_code',
						refresh_token: refreshToken ? refreshToken : null
					},
					header: {
						'Content-Type': 'applciation/json'
					},
					dataType: 'JSON',
					method: 'get',
					//get为默认方法/POST
					success: function (r) {
						console.log('app.js-getOppenId()获取的myid信息如下：');
						console.log(r.data);
						if (r.data.code == 200) {
							uni.setStorageSync({
								key: 'myId',
								data: r.data.ali_response.userId
							});
							uni.setStorageSync('refreshToken', r.data.ali_response.refreshToken);
							// console.log(r.data.ali_response.userId)
							console.log(r.data);
							uni.setStorageSync('token', r.data.token);
						} else if (r.data.code == 501) {
							uni.showModal({
								title: '提示',
								content: r.data.msg,
								buttonText: '我知道了',
								success: () => {}
							});
							uni.setStorageSync('token', r.data.token);
						} else if (r.data.code == 502) {
							uni.showModal({
								title: '提示',
								content: r.data.msg,
								buttonText: '我知道了',
								success: () => {}
							});
							uni.setStorageSync('token', r.data.token);
						} else {
							uni.showModal({
								title: '提示',
								content: '获取用户aliId失败',
								buttonText: '我知道了',
								success: () => {}
							});
							uni.setStorageSync('token', r.data.token);
						}
					},
					fail: function (err) {
						uni.showModal({
							title: '提示',
							content: '网络跑丢啦',
							buttonText: '我知道了',
							success: () => {}
						});
					},
					//请求失败
					complete: function (r) {} //请求完成后执行的函数
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
							that.login();
							uni.hideLoading();
						}
					}
				});
			},

			/**
			 * 获取用户信息
			 */
			getUserInfo: function (token1) {
				let that = this;
				var token;
				if (token1) {
					token = token1;
				} else {
					token = uni.getStorageSync('token');
				}
				if (!token) {
					//如果没有token就不需要去获取用户信息
					return false;
				}
				uni.request({
					url: `${domain.apiHost}/user/getuserinfo`,
					data: {
						token: token
					},
					header: {
						'Content-Type': 'applciation/json'
					},
					method: 'GET',
					//get为默认方法/POST
					success: (r) => {
						uni.hideLoading();
						if (r.data.status == 200) {
							uni.setStorageSync('userInfo', r.data.data);
						} else {
							that.resLogin(); //登录过期重新登录
						}
					},

					fail: function (err) {},
					//请求失败
					complete: function (r) {} //请求完成后执行的函数
				});
			},
			// 支付宝电话号码授权
			getAliPayPhoneNumber() {
				return new Promise((resolve, reject) => {
					my.getPhoneNumber({
						success: (res) => {
							resolve(res);
						},
						fail: (err) => {
							reject(err);
						}
					});
				});
			},

			/**
			 * 登录
			 */
			// login: function () {
			// 	return new Promise((resolve, reject) => {
			// 		let phoneNumber = uni.getStorageSync('phoneNumber');

			// 		uni.request({
			// 			url: `${domain.apiHost}/user/wx/wxLogin`,
			// 			data: { phone: phoneNumber, firm: 'jd' },
			// 			header: {
			// 				'Content-Type': 'applciation/json',
			// 				firm: 'jd'
			// 			},
			// 			method: 'GET',
			// 			success: function (r) {
			// 				if (r.data.code == 200) {
			// 					const token = r.data.token;
			// 					uni.setStorageSync('token', token);
			// 					resolve(token);
			// 					console.log('app.js登录获取的token如下：', token);
			// 				} else {
			// 					uni.showModal({
			// 						title: '提示',
			// 						content: r.data.msg,
			// 						buttonText: '我知道了',
			// 						success: () => {}
			// 					});
			// 					resolve(false);
			// 				}
			// 			},
			// 			fail: function (err) {
			// 				resolve(false);
			// 			}
			// 		});
			// 	});
			// }
			login: function (getUserinfo) {
				return new Promise((resolve, reject) => {
					//授权时请求登录登录
					let code = wx.getStorageSync('powerCode');
					let phone = wx.getStorageSync('phoneNumber');

					wx.request({
						url: `${domain.apiHost}/user/wx/wxLogin`,
						data: {
							code: code,
							phone: phone
						},
						header: {
							'Content-Type': 'applciation/json'
						},
						method: 'get', //get为默认方法/POST
						success: function (r) {
							if (r.data.code == 200) {
								wx.showToast({
									title: '已登录',
									icon: 'none'
								});
								wx.setStorageSync('token', r.data.token);
								resolve(r.data.token);
								if (getUserinfo) {
									getUserinfo(r.data.token);
								}
							} else {
								resolve(false);
								wx.showModal({
									content: r.data.msg,
									confirmText: '确定',
									showCancel: false
								});
							}
						},
						//请求失败
						fail: function (err) {
							resolve(false);
						}
					});
				});
			}
		},
		onLaunch: function () {
			this.globalData.versionCheck();
			this.setPower();
			this.autoLogin();
			uni.getSetting({
				success: (res) => {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
						uni.getUserInfo({
							success: (res) => {
								console.log(res);
								// 可以将 res 发送给后台解码出 unionId
								this.globalData.userInfo = res.userInfo; // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
								// 所以此处加入 callback 以防止这种情况

								if (this.userInfoReadyCallback) {
									this.userInfoReadyCallback(res);
								}
							}
						});
					}
				}
			});
		},
		methods: {
			autoLogin() {
				const phone = uni.getStorageSync('phoneNumber');
				if (!phone) return;
				this.globalData.login();
			},
			setPower() {
				uni.login({
					success: (res) => {
						//一打开就将授权码存入缓存，后面在用户中心解密手机号，和登录都需要
						uni.setStorageSync('powerCode', res.code);
					}
				});
			}
		}
	};
</script>
<style>
	@import './app.css';
</style>
