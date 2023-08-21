<!-- @format -->

<template>
	<view style="height: 100%">
		<view class="header">{{ product_title.product_name }}</view>
		<view class="container">
			<form class="formClass">
				<view class="order-box">
					<view class="j-address single-input">
						<!-- uni: 属性space不被支持，请调整 -->
						<text class="label" space="emsp" decode="decode" style="color: #212123">联系人:</text>
						<input
							class="form-value"
							type="text"
							placeholder-class="placeholderStyle"
							placeholder="输入联系电话"
							name="dealPhone"
							v-model="phoneNumber"
						/>
					</view>
					<view class="j-address single-input">
						<text decode="decode" class="label" style="color: #212123">验证码:</text>
						<input
							class="form-value"
							placeholder-class="placeholderStyle"
							type="text"
							name="checkCode"
							v-model="checkCode"
							placeholder="输入验证码"
						/>
						<view :disabled="ifPress" class="getCodeBtn" @click="getCheckCode">
							{{ btntext }}
						</view>
					</view>
					<view class="j-address single-input">
						<text decode="decode" class="label" style="color: #212123">收款方式:</text>

						<view class="form-value">支付宝</view>
					</view>

					<view class="j-address single-input">
						<text class="label" space="ensp" style="color: #212123">支付宝账号:</text>
						<input
							class="form-value"
							placeholder-class="placeholderStyle"
							type="text"
							name="dealAccount"
							v-model="dealAccount"
							placeholder="支付宝绑定的手机号或邮箱"
						/>
					</view>
					<view class="j-address single-input">
						<!-- uni: 属性space不被支持，请调整 -->
						<text class="label" decode="decode" style="color: #212123">收款人:</text>
						<input
							class="form-value"
							placeholder-class="placeholderStyle"
							type="text"
							name="dealName"
							v-model="dealName"
							placeholder="收款账号对应的实名姓名"
						/>
					</view>
					<view class="j-address single-input">
						<text class="proSource label" space="nbsp" style="color: #212123">机器来源:</text>
						<picker
							class="source-picker"
							onChange="bindPickerChange"
							name="source"
							:value="source"
							:range="sourceList"
							@change="sourceChange"
						>
							<view class="picker" style="color: #999">
								{{ sourceList[index] }}
								<uni-icons type="compose" size="20" color="#9b9b9b" />
							</view>
						</picker>
					</view>
					<view v-if="!isDigital" class="j-address single-input">
						<!-- uni: 属性space不被支持，请调整 -->
						<text decode="decode" class="label" style="color: #212123">序列号:</text>
						<input
							class="form-value"
							placeholder-class="placeholderStyle"
							type="text"
							name="imei"
							v-model="imei"
							placeholder="输入当前估价机型的序列号/IMEI"
						/>
					</view>
					<view v-if="!isDigital" class="codeTipsBox">
						<image class="askImg" src="/static/images/ask.png" />
						<view class="codeTipsText" @click="showTeach">查看序列号</view>
					</view>
				</view>
				<view class="footer">
					<view class="agreeRules">
						<view @click="agreeFun" :class="isAgree ? 'checkbox check' : 'checkbox'">
							<uni-icons v-if="isAgree" type="checkmarkempty" color="#fff" size="16" />
						</view>
						<text :decode="true">&nbsp;我已阅读并同意</text>
						<navigator url="../servicerule/servicerule">《服务条款》</navigator>
					</view>
					<button
						class="count_btn"
						size="default"
						type="button"
						:plain="false"
						primarySize="default"
						@click="formSubmit"
					>
						立即提交
					</button>
				</view>
			</form>

			<my-evaluation />

			<my-drag-service />

			<view class="recycleTips">
				<view class="attention">注意：</view>
				<view>
					尖端数码回收拒绝回收不合法来源的脏机，无法注销D的机器，收到此类机器将会拒收退回。
				</view>
				<view class="littleTips">小贴士：</view>
				<view>
					1.根据我们以往回收经验，为了您的机器安全，强烈建议您选择顺丰快递，邮费为到付由尖端数码回收承担.
				</view>
				<view>
					2.请您务必在机器寄出前清除机器的锁屏密码,并退出ID账号,否则将严重影响最终回收价格.
				</view>
				<view>
					3.建议您清除机器内的所有个人信息,如果您忘记清除信息,我们将为您清除数据,尖端数码回收承诺坚决保护用户隐私.
				</view>
				<view>
					4.根据以往经验，如果选择其他快递丢件风险比较大，如果出现意外
					尖端数码回收不予承担责任，请知悉.
				</view>
				<view>
					5.华为/荣耀旗下机型保修时间需查询满一年保修才可按照全新机标准回收，有疑问可联系客服确认.
				</view>
				<view class="normalQ" @click="seeQuestions">查看常见问题</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import headerCmp from '@/components/header/header';
	import { commonDomain as domain } from '../../constant/common';
	export default {
		components: { headerCmp },
		data() {
			return {
				channelNo: '',
				phoneNumber: '',
				checkCode: null,
				dealAccount: null,
				dealName: null,
				source: 0,
				imei: null,

				scrollTop: 0,
				//滚动条高度
				isDigital: false,
				//是否来源于智能数码估价
				showModal: false,
				//控制弹出层
				orderNumber: null,
				//下单成功返回的订单号
				token: '',
				aliId: null,
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
				sourceList: ['自己购买', '活动获得', '他人赠送'],
				index: '0',
				//机器来源默认选中第一个
				markers: [
					{
						longitude: 114.055013,
						latitude: 22.633965,
						title: '趣评测科技-深圳市龙岗区坂田街道大发路29号深澳文化产业园9栋（李杰灵）15989408771'
					}
				],
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
			this.channelNo = uni.getStorageSync('channelNo') || '';
			//取出上个页面缓存的数据
			let that = this;
			uni.getStorage({
				key: 'phoneNumber',
				success(res) {
					that.setData({
						dealAccount: res.data,
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
				key: 'myId',
				success(res) {
					that.setData({
						aliId: res.data
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
					console.log('选项信息');
					console.log(res);
					console.log('选项信息');
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
		onShow: function () {
			uni.showModal({
				title: '重要提示',
				content:
					'全新机下单后请在24小时内发货（之前订单不受影响），非全新机请在72小时内发货，超出发货时效的订单需重新下单估价，相关服务条款已更新，详见本页面下方《服务条款》，点击下单即代表您已阅读并同意服务条款内的全部内容，感谢您的支持！',
				buttonText: '我已知晓'
			});
		},
		onPullDownRefresh: function () {
			uni.stopPullDownRefresh();
		},
		methods: {
			sourceChange(e) {
				this.source = e.detail.value;
			},
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

			getCheckCode: function () {
				// 发送验证码参数
				var send_code_params = {
					phone: '',
					remark: 'placeOrder'
				};
				let if_pass;
				let mobile = /^1[3-9]\d{9}$/;
				let param_phone = this.codeValue;
				if (param_phone) {
					param_phone = param_phone.replace(/\s+/g, '');
				}
				if_pass = mobile.test(param_phone);
				if (if_pass) {
					send_code_params.phone = param_phone; // 发送验证码

					this.sendCodeFun(send_code_params);
				} else {
					uni.showModal({
						title: '请输入有效的手机号码'
					});
				}
			},

			//限制45s验证码获取间隔
			// 15084422039
			timeDown: function () {
				let that = this;
				let t;
				let tiktok = this.tiktok; // console.log('禁止');
				// console.log(tiktok)
				tiktok--;
				//console.log(tiktok)
				that.setData({
					tiktok: tiktok
				});
				//禁止点击的效果

				this.btntext = tiktok + '秒后再试';
				this.ifPress = true;
				// this.btnColor = '#4BA7EC';

				t = setTimeout(function () {
					that.timeDown();
				}, 1000);

				if (that.tiktok <= 0) {
					// 计时重置为45秒
					//this.data.tiktok = 45;
					that.setData({
						tiktok: 45
					});
					clearTimeout(t); //恢复点击的效果

					this.btntext = '再次获取';
					this.ifPress = false;
					this.btnColor = '#fff';
				}
			},

			sendCodeFun: function (send_code_params) {
				uni.request({
					url: `${domain.apiHost}/common/sendCode`,
					method: 'get',
					header: {
						firm: 'jd'
					},
					data: send_code_params,
					dataType: 'json',
					success: (res) => {
						if (res.data.status === 200) {
							uni.showToast({
								title: '发送成功',
								icon: 'success',
								duration: 2000,
								mask: false
							}); //发送成功才禁止点击

							this.timeDown();
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
				});
			},

			//点击下单按钮，先表单验证，再下单
			formSubmit: function (e) {
				if (
					!this.checkCode ||
					!this.dealAccount ||
					!this.dealName ||
					!this.phoneNumber ||
					!this.imei ||
					(!this.source && +this.source !== 0)
				) {
					uni.showToast({
						title: '请补充用户信息再提交',
						icon: 'none',
						duration: 2000,
						mask: true
					});
					return;
				}
				if (!this.isAgree) {
					uni.showToast({
						title: '请阅读并同意服务条款',
						icon: 'none',
						duration: 2000,
						mask: true
					});
					return;
				}

				//正则
				let mobile = /^1[3-9]\d{9}$/;
				let check_name = /^[\u4E00-\u9FA5]+$/; //中文正则
				let check_mail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //邮箱
				//let check_bank = /^([1-9]{1})(\d{15}|\d{18})$/;//银行卡号验证
				let check_bank = /^\d{16,19}$/; //订单参数

				let order_params = {
					channel_no: this.channelNo,
					collect_money_account: this.dealAccount,
					//收款账号
					collect_money_account_name: this.dealName,
					//收款人姓名
					seller_phone: this.phoneNumber,
					//手机号码
					code: this.checkCode,
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
					// money_account_type: this.dealWay,
					money_account_type: '支付宝',
					//收款方式
					source: this.source,
					sourceName: this.sourceList[this.source],
					//机器来源
					imei: this.imei,
					token: this.token,
					aliId: this.aliId,
					original_money: this.old_final_price,
					//没有加上加价卷金额的估价
					markup_money: this.product_title.markup_money,
					//加价卷金额
					markup_id: this.product_title.markup_id,

					//llq 范围加价券参数===============2021-9-2
					mrremark: this.product_title.markup_money != 0 ? this.product_title.mrremark : '', //哪种类型的加价券文字备注
					//llq 范围加价券参数===========结束====2021-9-2

					//加价卷id
					isNew: this.isNew //是否全新机
				};

				let if_pass_phone = mobile.test(order_params.seller_phone); //手机号验证;

				let if_pass_account =
					mobile.test(order_params.collect_money_account) ||
					check_mail.test(order_params.collect_money_account) ||
					check_bank.test(order_params.collect_money_account);

				let if_pass_name = check_name.test(order_params.collect_money_account_name); //名字验证

				if (
					order_params.imei == undefined ||
					order_params.imei == null ||
					order_params.imei == 'undefined'
				) {
					order_params.imei = '';
				}

				if (!if_pass_phone) {
					return uni.showToast({
						title: '请输入有效的手机号码！',
						icon: 'none',
						duration: 2000,
						mask: false
					});
				}

				if (order_params.code.length <= 1) {
					return uni.showToast({
						title: '请输入验证码',
						icon: 'none',
						duration: 2000,
						mask: false
					});
				}

				if (!if_pass_account) {
					return uni.showToast({
						title: '请输入有效的收款账号',
						icon: 'none',
						duration: 2000,
						mask: false
					});
				}
				if (
					if_pass_name &&
					order_params.collect_money_account_name.length > 1 &&
					order_params.collect_money_account_name.length < 9
				) {
					this.orderFun(order_params);
				} else {
					uni.showToast({
						title: '名字应由2-8位中文组成',
						icon: 'none',
						duration: 2000,
						mask: false
					});
				}
			},

			//下单函数
			orderFun: function (order_params) {
				uni.showLoading({
					title: '下单中...'
				});
				if (order_params.token == null || order_params.token == undefined) {
					order_params.token = '';
				}
				if (order_params.aliId == null || order_params.aliId == undefined) {
					order_params.aliId = '';
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
				let _this = this;

				wx.request({
					url: `${domain.apiHost}/place/order/placeAnOrderFromWX`,
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
								_this.setData({
									orderNumber: res.data.orderNumber
								});
								wx.setStorage({
									key: 'token',
									data: res.data.token
								});
								uni.hideLoading();
								wx.showModal({
									title: '报价已提交',
									content:
										'请及时寄出机器，并在个人中心填写发货信息，否则将导致延迟打款甚至无法完成回收',
									confirmText: '去发货',
									showCancel: false,
									success(res) {
										if (res.confirm) {
											uni.redirectTo({
												url: '/pages/orderList/orderList'
											});
										} else {
											uni.switchTab({
												url: '/pages/mine/user'
											});
										}
									}
								});
							} else if (res.data.status === 501) {
								_this.resLogin();
							} else {
								wx.showToast({
									title: res.data.msg,
									icon: 'none',
									duration: 2000,
									mask: false
								});
							}
						} else {
							wx.showToast({
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
						wx.showToast({
							title: '下单请求未发出',
							icon: 'none'
						});
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
					content:
						'手机在拨号界面输入*＃06＃,即可查看imei,平板在设置-关于本机，即可查看序列号/IMEI，新机可从包装盒查看(部分双卡手机会有两个IMEI,通常以第一个为准)',
					confirmButtonText: '我知道了',
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
				const isAgree = this.isAgree;
				this.setData({
					isAgree: !isAgree
				});
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

			/**
			 * 弹出层函数end
			 */
		}
	};
</script>
<style lang="scss">
	@import './orderpage.scss';
</style>
