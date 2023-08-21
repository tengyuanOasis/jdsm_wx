<!-- @format -->

<template>
	<view style="height: 100%">
		<!-- pages/showcountprice/showcountprice.axml -->
		<view class="container-showprice">
			<container class="price-content" :title="product_title.product_name">
				<view class="price_content_text">
					<view class="price-title">预估报价</view>
					<view v-if="product_title.markup_money != 0" class="show_final_price">
						<text class="yuan">￥</text>
						{{ final_price }}
						<text class="price-add">(已加价{{ product_title.markup_money }}元)</text>
					</view>
					<view v-if="product_title.markup_money == 0" class="show_final_price">
						￥{{ final_price }}
					</view>

					<view class="per_cl">
						回收
						<text style="color: orange; font-weight: bold">价格高过{{ percent_pri }}%的同行</text>
						商家，欢迎比价。
					</view>

					<view class="per_cl2">预计下月下跌{{ next_month_cut }}元</view>
				</view>
			</container>

			<view class="detail-box">
				<view class="per_cl3_0">
					<text class="per_cl3">估价详情</text>
				</view>

				<view class="detail-list" v-for="(item, index) in product_details" :key="index">
					{{
						product_details[index]
							.replace('【', '')
							.replace('】', '')
							.replace(':', '：')
							.split('：')[0]
					}}
					：

					<text style="color: #999999">
						{{
							product_details[index]
								.replace('【', '')
								.replace('】', '')
								.replace(':', '：')
								.split('：')[1]
						}}
					</text>
				</view>
			</view>

			<view class="tips">注意：请确保您选择的机器描述与实际情况一致，否则可能导致议价或退回。</view>
		</view>
		<view class="footer">
			<button
				v-if="phoneNumber"
				@click="getPhoneNumber"
				class="submit_btn"
				size="default"
				type="button"
				plain="false"
				primarySize="default"
				hover-class="none"
			>
				立即回收
			</button>
			<button
				v-else
				open-type="getPhoneNumber"
				@getphonenumber="getPhoneNumber"
				class="submit_btn"
				size="default"
				type="button"
				plain="false"
				primarySize="default"
				hover-class="none"
			>
				立即回收（授权手机号）
			</button>
		</view>
	</view>
</template>

<script>
	import headerCmp from '@/components/header/header';
	import { commonDomain as domain } from '../../constant/common';
	const app = getApp();
	export default {
		components: {
			headerCmp
		},
		data() {
			return {
				phoneNumber: '',

				//手机号
				product_title: {
					product_name: '',
					markup_money: 0
				},

				//机器基本信息
				final_price: 0,

				//报价
				old_final_price: 0,

				product_details: [],

				//选中详情

				//同行百分比
				percent_pri: '90',

				//下月预计跌
				next_month_cut: '99',

				codeValue: ''
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function (options) {
			let that = this;
			let _key = '';
			uni.getStorage({
				key: 'phoneNumber',
				success(res) {
					that.phoneNumber = res.data;
					that.codeValue = res.data;
				}
			});
			uni.getStorage({
				key: 'product_title',
				success(res) {
					that.setData({
						product_title: res.data
					});
					_key = res.data.product_name + '001';
					if (uni.getStorageSync(_key) != null) {
						//取缓存
						that.setData({
							percent_pri: uni.getStorageSync(_key).split('-')[0],
							next_month_cut: uni.getStorageSync(_key).split('-')[1]
						});
					} else {
						let val1 = that.random(85, 99);
						let val2 = that.random(70, 230);
						uni.setStorageSync(_key, val1 + '-' + val2); //存缓存
						that.setData({
							percent_pri: val1,
							next_month_cut: val2
						});
					}
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
		},
		onShow: function () {},
		methods: {
			getAuthCode() {
				//支付宝获取授权码，用于给后台换取用户唯一userid
				uni.getAuthCode({
					scopes: 'auth_user',
					success: ({ authCode }) => {
						console.log('用户授权码：' + authCode);
					}
				});
			},

			onGetAuthorize(res) {
				//支付宝获取用户信息
				uni.getOpenUserInfo({
					fail: (res) => {},
					success: (res) => {
						let userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
						console.log(userInfo);
						uni.navigateTo({
							url: '/pages/orderpage/orderpage'
						});
					}
				});
			},

			onAuthError: function () {
				uni.showToast({
					title: '需授权后继续访问',
					image: '/static/images/icon/500000_error.png',
					duration: 2000,
					mask: true
				});
			},
			/**
			 * 解密手机号
			 */

			getPhoneNumber: function (e) {
				let self = this;
				if (self.phoneNumber) {
					wx.navigateTo({
						url: '/pages/orderpage/orderpage'
					});
					return;
				}

				if (e.detail.iv) {
					wx.showLoading();
					wx.request({
						url: `${domain.apiHost}/user/wx/getPhoneNumber`,
						data: {
							code: wx.getStorageSync('powerCode'),
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv
						},
						header: {
							'Content-Type': 'applciation/json',
							firm: 'jd'
						},
						method: 'get', //get为默认方法/POST
						success: function (r) {
							wx.hideLoading();
							if (r.data.code == 200) {
								wx.setStorageSync('phoneNumber', r.data.token.phoneNumber);
								self.phoneNumber = r.data.token.phoneNumber;
								app.globalData.login();
								setTimeout(() => {
									wx.hideLoading();
									wx.navigateTo({
										url: '/pages/orderpage/orderpage'
									});
								}, 1000);
							}
						},
						fail: function (err) {}, //请求失败
						complete: function (r) {} //请求完成后执行的函数
					});
				} else {
					wx.showToast({
						title: '请您先授权后再下单',
						icon: 'none',
						duration: 2000,
						mask: true
					});
					return;
				}
			},

			random: function (min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			}
		}
	};
</script>
<style lang="scss">
	@import './showcountprice.scss';
</style>
