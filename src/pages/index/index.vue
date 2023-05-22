<!-- @format -->

<template>
	<view style="height: 100%">
		<view class="con">
			<view style="height: 36rpx"></view>
			<!-- 搜索框 -->
			<view
				class="searchctl"
				@tap="toKeySearch"
			>
				<image
					src="/static/images/l_search.png"
					style="width: 30rpx; height: 30rpx; margin-left: 36rpx; margin-right: 20rpx"
				></image>
				<text>点击快速搜索机型</text>
			</view>
			<view class="con-list">
				<view class="con-list-left">
					<image
						src="/static/images/yj.png"
						style="width: 10rpx; height: 36rpx"
					></image>
					<text>回收品牌</text>
				</view>
				<view class="con-list-right"> </view>
			</view>
			<!-- 品牌 -->
			<view
				class="brandctl"
				v-if="brandList.length > 0"
			>
				<block
					v-for="(item, index) in brandList"
					:key="index"
				>
					<view
						class="b-item"
						v-if="index < 5"
						:data-brand-id="item.brandId"
						@tap="toCategoryFun"
					>
						<image
							:src="domainName + item.img"
							style="width: 100rpx; height: 100rpx"
						></image>
						<text>{{ item.brandName }}</text>
					</view>

					<view
						class="b-item"
						v-if="index == 5"
						data-brand-id=""
						@tap="toCategoryFun"
					>
						<image
							src="/static/images/more_brand.jpg"
							style="width: 90rpx; height: 90rpx; margin-top: 10rpx; margin-bottom: 10rpx"
						></image>
						<text>更多</text>
					</view>
				</block>
			</view>
			<view
				class="brandctl"
				v-else
				>暂无分类~</view
			>
		</view>
		<view
			class="con"
			v-if="phoneName"
			style="position: relative; overflow: hidden; height: 400rpx"
		>
			<view
				class="con-list"
				style="z-index: 2; position: absolute; top: 0"
			>
				<view class="con-list-left">
					<image
						src="/static/images/yj.png"
						style="width: 10rpx; height: 36rpx"
					></image>
					<text>我的机器</text>
				</view>
				<view class="con-list-right"></view>
			</view>
			<navigator
				class="version-identify"
				:url="'../placeordersteps/placeordersteps?versionId=' + versionId"
			>
				<view class="picctl">
					<image
						:src="versionImg"
						style="width: 110rpx; height: 110rpx; margin-bottom: 10rpx"
					></image>
					<view>
						<text>{{ phoneName }}</text>
					</view>
				</view>
				<view class="picctl2">
					<text style="font-size: 25rpx; font-weight: 500">最高可卖</text>
					<view style="font-size: 40rpx; color: #f271a3; font-weight: bold">
						<text style="margin-left: 10rpx; margin-right: 10rpx; font-weight: 500">¥</text>
						<text style="font-size: 80rpx">{{ much_money }}</text>
					</view>
					<button class="btnctl">获取精准估价</button>
				</view>
			</navigator>
		</view>
		<!-- 回收流程 -->
		<view
			class="con"
			style="position: relative; overflow: hidden; height: 290rpx"
		>
			<view
				class="con-list"
				style="position: absolute; top: 0; z-index: 2"
			>
				<view class="con-list-left">
					<image
						src="/static/images/yj.png"
						style="width: 10rpx; height: 36rpx"
					></image>
					<text>下单流程</text>
				</view>
			</view>
			<view
				class="con-list-right"
				style="position: absolute; top: 41rpx; z-index: 2; right: 0"
				@tap="toCommonProblem"
			>
				<text style="font-size: 30rpx; color: #f271a3; font-weight: bold">问题汇总</text>
			</view>
			<view class="processctl">
				<view class="c-item">
					<image
						src="/static/images/process/search.png"
						style="width: 56rpx; height: 56rpx"
					></image>
					<text>选择机型</text>
				</view>
				<view class="c-item">
					<image
						src="/static/images/process/price.png"
						style="width: 56rpx; height: 56rpx"
					></image>
					<text>免费估价</text>
				</view>
				<view class="c-item">
					<image
						src="/static/images/process/order.png"
						style="width: 56rpx; height: 56rpx"
					></image>
					<text>下单发货</text>
				</view>
				<view class="c-item">
					<image
						src="/static/images/process/pay.png"
						style="width: 56rpx; height: 56rpx"
					></image>
					<text>验货打款</text>
				</view>
			</view>
		</view>
		<!-- 客服 -->
		<view class="main">
			<!-- <movable-area class="move-box">
    <movable-view class="move-view" direction="all"> -->
			<view>
				<view
					class="kefu"
					@tap="kffunc"
				>
					<image
						src="/static/images/kfimg.png"
						style="width: 100rpx; height: 100rpx"
					/>
				</view>
			</view>
			<!-- </movable-view>
  </movable-area> -->
		</view>
		<!-- 客服弹框 -->
		<!-- 弹框 -->
		<view
			class="mark_model"
			v-if="isShowEditModel"
		>
			<view class="mark_content">
				<form>
					<view
						class="form-pre"
						style="margin-top: 80rpx"
					>
						<label
							style="font-size: 26rpx"
							@tap="copyAddress"
							>客服微信：jianduan123123（点击复制）</label
						>
					</view>
					<view class="form-pre">
						<label
							style="font-size: 26rpx"
							@tap="copyPhone"
							>客服电话：18475563915（点击复制）</label
						>
					</view>
				</form>
			</view>
			<view class="kfbtn">
				<image
					src="/static/images/closekf.png"
					@tap="closekf"
					style="width: 50rpx; height: 50rpx"
				></image>
			</view>
		</view>
	</view>
</template>

<script>
	import rotationCmp from '@/components/rotation/rotation';
	import { tips } from '../../utils/tips';
	import { MainIndexModel } from '../../model/mainindex';
	import { commonDomain as domain } from '../../constant/common';
	var mainIndexModel = new MainIndexModel();
	const Models = require('../../utils/modelList.js');
	//获取应用实例
	const app = getApp();
	export default {
		components: {
			rotationCmp
		},
		data() {
			return {
				phoneName: null,
				//机型识别的名字
				versionId: '',
				//识别出来机型的id，用于跳转页面

				//前5个品牌
				brandList: [],
				domainName: domain.domain_qupingce,
				versionImg: '/images/test-phone.png',
				//识别出来的机型的图片
				much_money: 0,
				isShowEditModel: false
			};
		},
		onLoad: function () {
			this.initFiveBrands();
		},
		onShow: function () {
			this.getSystemInfo();
		},
		onShareAppMessage: function (res) {
			//自定义转发
			return {
				title: '尖端数码回收',
				path: 'pages/index/index',
				imageUrl: '/static/images/share_img.jpg'
			};
		},
		onPullDownRefresh: function () {
			//首页下拉刷新事件
			this.getSystemInfo();
			uni.navigateTo({
				url: '/' + this.route
			});
			uni.stopPullDownRefresh();
		},
		methods: {
			getSystemInfo: function () {
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
						model = model.substring(model.indexOf('<') + 1, model.indexOf('>')).replace(/\s+/g, '');
						let commonName = modelTemp[model];
						//用转换后的名字去对比数据库
						if (commonName) {
							that.searchByName(commonName);
						}
					}
				});
			},

			searchByName: function (key) {
				let that = this;
				uni.request({
					url: `${domain.domain_qupingce}/search/serarchByKey`,
					data: {
						key: key
					},
					method: 'GET',
					header: {
						'content-type': 'application/json' // 默认值
					},

					success(res) {
						console.log(res);
						if (res.statusCode == '200') {
							//请求状态码
							if (res.data.status == '200') {
								//后台返回成功状态码
								let datas = res.data.data;
								let newArray = [];
								for (let t = 0; t < datas.length; t++) {
									let obj = {
										name: '',
										id: ''
									};
									obj.normal_name = datas[t].version_name;
									obj.name = datas[t].version_name.toLowerCase().replace(/\s+/g, '');
									obj.id = datas[t].version_id;
									obj.title_img = datas[t].title_img;
									obj.much_money = datas[t].much_money;
									newArray.push(obj);
								}
								//用新建的数组来循环对比当前机型
								let formatKey = key.toLowerCase().replace(/\s+/g, ''); //当前机型也格式化一下,方便对比
								for (let v = 0; v < newArray.length; v++) {
									if (newArray[v].name == formatKey) {
										that.setData({
											phoneName: newArray[v].normal_name,
											versionId: newArray[v].id,
											versionImg:
												that.domainName + '/GetFile/getUploadImg?fileName=' + newArray[v].title_img,
											much_money: newArray[v].much_money
										});
										//只允许一个结果，找到就停止
										return;
									}
								}
							}
						}
					}
				});
			},

			//获取品牌
			initFiveBrands: function () {
				let that = this;
				uni.request({
					url: `${domain.domain_qupingce}/page/getAllBrandByType`,
					header: {
						'content-type': 'application/json' // 默认值
					},

					data: {
						type: 'phone'
					},
					success: function (res) {
						if (res.statusCode === 200) {
							if (res.data.status == 200) {
								that.setData({
									brandList: res.data.data
								});
							} else {
								tips.ERROR_500();
							}
						}
					},
					fail: function (err) {
						tips.ERROR_500();
					}
				});
			},

			toCommonProblem: function () {
				uni.navigateTo({
					url: '/pages/questionguide/questionguide'
				});
			},

			toKeySearch: function () {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},

			toCategoryFun: function (e) {
				uni.setStorageSync('brandId', e.currentTarget.dataset.brandId);
				uni.setStorageSync('the_type', 'phone');
				uni.reLaunch({
					url: '/pages/category/category'
				});
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
		}
	};
</script>
<style>
	/**index.wxss**/

	page {
		font-family: '微软雅黑';
		background: #f7f6fb;
	}

	.con {
		background: #ffffff;
		width: 90%;
		margin-left: 5%;
		border-radius: 20rpx;
		margin-bottom: 42rpx;
	}

	.con-list {
		padding-top: 36rpx;
		height: 50rpx;
		/* background: red; */
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: nowrap;
	}

	.con-list-left {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: nowrap;
	}

	.con-list-left text {
		font-size: 36rpx;
		font-weight: bold;
		margin-left: 24rpx;
		color: #212123;
	}

	.con-list-right {
		margin-right: 30rpx;
	}

	.brandctl {
		width: 100%;
		height: 150rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex-direction: row;
		flex-wrap: nowrap;
		font-size: 26rpx;
		font-weight: bold;
		padding-bottom: 20px;
	}

	.b-item {
		margin-top: 10rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.searchctl {
		width: 90%;
		background: #f3f3f3;
		height: 64rpx;
		border-radius: 10rpx;
		margin-left: 5%;
		display: flex;
		align-items: center;
		flex-direction: row;
		font-size: 26rpx;
		color: #999999;
	}

	.version-identify {
		position: absolute;
		top: 120rpx;
		left: 30rpx;
		z-index: 2;
		display: flex;
		flex-direction: row;
	}

	.picctl {
		z-index: 333;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: flex-end;
		width: 260rpx;
		height: 240rpx;
		border-radius: 10rpx;
		box-shadow: 0 0 0.15rem #d5d5d5;
		background: #ffffff;
	}

	.picctl view {
		height: 80rpx;
		background: #d6f5f6;
		width: 100%;
		font-size: 24rpx;
		border-radius: 0 0 10rpx 10rpx;
		overflow: hidden;
		display: flex;
		align-items: center;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
	}

	.picctl view text {
		height: 50rpx;
		width: 90%;
		overflow: hidden;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		font-weight: 500;
	}

	.picctl2 {
		margin-left: 30rpx;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 320rpx;
		height: 240rpx;
	}

	.btnctl {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 23rpx;
		color: white;
		width: 98%;
		height: 70rpx;
		border-radius: 40rpx;
		background-image: linear-gradient(90deg, #3fcef2, #4ba7ec) !important;
	}

	.processctl {
		position: absolute;
		top: 125rpx;
		z-index: 333;
		width: 100%;
		display: flex;
		justify-content: space-around;
		flex-direction: row;
		align-items: center;
	}

	.c-item {
		font-size: 26rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 120rpx;
	}

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
