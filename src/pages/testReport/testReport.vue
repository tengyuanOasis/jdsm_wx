<!-- @format -->

<template>
	<view style="height: 100%">
		<view class="container test">
			<view class="title">
				<text>{{ name }}-验机报告</text>
			</view>
			<view>
				<view class="r-box">
					<view class="r-title">
						<text>验机结果</text>
					</view>
					<view class="r-c">
						<view
							class="r-c-i"
							:data-img="item.test_img"
							onTap="checkImage"
							v-for="(item, index) in main_data"
							:key="index"
						>
							<text class="question">{{ item.feature_name }}：</text>

							<text class="answer">{{ item.option_name }}</text>

							<text
								v-if="item.isPass"
								class="pass"
								>通过</text
							>

							<text
								v-else
								class="pass-fail"
								>未通过</text
							>

							<!-- <icon
								v-if="item.isPass"
								type="CheckCircleFill"
								class="pass-icon res-icon"
							/>

							<icon
								type="CloseCircleFill"
								class="pass-fail-icon res-icon"
							/> -->
						</view>
					</view>
				</view>
			</view>
			<view class="tip">
				<text>如有问题请联系客服，点击单列可查看图片</text>
			</view>
		</view>

		<my-drag-service />
	</view>
</template>

<script>
	import { commonDomain as domain } from '../../constant/common';
	// pages/user/testReport/testReport.js
	export default {
		data() {
			return {
				main_data: {},
				myorder_id: '',
				name: '',
				imei: '',
				toastShow: false,
				title: ''
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */ onLoad: function (options) {
			const detail = uni.getStorageSync('orderDetail');
			//只保留订单号里的数字
			this.setData({
				myorder_id: detail.myorder_id,
				name: detail.name,
				imei: detail.imei
			});
			this.getTest();
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function () {
			this.getTest(); //完成后关闭刷新

			uni.stopPullDownRefresh();
		},
		methods: {
			/**
			 * 获取验机报告
			 */
			getTest: function () {
				var that = this;
				uni.request({
					url: `${domain.apiHost}/view/order/getOrderTest?order_id=` + that.myorder_id,
					headers: {
						'Content-Type': 'applciation/json'
					},
					method: 'Post',
					success: function (r) {
						console.log(r);
						if (r.data.status == 200) {
							//加上是否折叠标志
							for (let k = 0; k < r.data.data.length; k++) {
								if (r.data.data[k].option_name == r.data.data[k].test_option_name) {
									r.data.data[k].isPass = true;
								} else {
									r.data.data[k].isPass = false;
								}
							}
							that.setData({
								main_data: r.data.data
							});
							console.log(that.main_data);
						} else {
							uni.alert({
								title: '提示',
								content: '暂无验机报告哦～',
								confirmText: '我知道了',
								success(res) {
									setTimeout(function () {
										uni.navigateBack();
									}, 800);
								}
							});
						}
					},
					fail: function (err) {},
					//请求失败
					complete: function (r) {} //请求完成后执行的函数
				});
			},

			//预览图片
			checkImage: function (event) {
				console.log('event', event);
				let url = `${domain.apiHost}` + event.target.dataset.img;
				uni.navigateTo({
					url: '/pages/testReport/checktestimg/checktestimg?url=' + encodeURIComponent(url)
				});
			},

			/**
			 * 提示
			 *
			 */
			isShowToast: function (title) {
				this.setData({
					toastShow: true,
					title: title
				});
				var that = this;
				setTimeout(function () {
					that.setData({
						toastShow: false
					});
				}, 1500);
			}
		}
	};
</script>
<style lang="scss">
	@import './testReport.scss';
</style>
