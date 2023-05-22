<!-- @format -->
<template>
	<view class="page">
		<view class="page-header">
			<view class="statusBar" />
			<view class="header-content">
				<view class="header-content-title">尖端数码回收</view>
				<cover-view
					class="header-content-searchBar"
					@click="() => toSearchPage()"
				>
					<uni-icons
						type="search"
						size="18"
					/>
					搜索回收机型
				</cover-view>
			</view>
		</view>

		<swiper
			v-if="swiperList.length"
			class="header-swiper"
			indicator-dots="true"
			autoplay="true"
		>
			<swiper-item
				v-for="item in swiperList"
				key="swiper-item-{{index}}"
			>
				<image
					class="header-swiper-item"
					mode="widthFix"
					:src="item"
					@click="() => goProductionPage()"
				/>
			</swiper-item>
		</swiper>

		<!-- 回收机型 -->
		<view
			v-if="phoneInfo.phoneName"
			class="card spu-info"
		>
			<view class="spu-header card-header">
				<view class="spu-header-left card-header-title">热门回收</view>
				<view
					class="spu-header-right"
					@click="() => goProductionPage()"
				>
					换一个卖
				</view>
			</view>

			<view class="spu-content">
				<image
					class="spu-avatar"
					:src="phoneInfo.versionImg"
				/>
				<view class="spu-content-center">
					<view class="spu-content-center-item">
						<text class="color-gray font-12">当前机型：</text>
						<text class="spu-name">{{ phoneInfo.phoneName }}</text>
					</view>
					<view class="spu-content-center-item">
						<text class="color-gray font-12">预估价格：</text>
						<text class="spu-price">
							<text class="font-12">¥</text>{{ phoneInfo.much_money }}
						</text>
					</view>
				</view>
				<view
					class="sell-phone"
					@click="() => goPlaceOrderStepsPage()"
				>
					立即估价
				</view>
			</view>
		</view>

		<!-- 回收分类 -->
		<view class="card">
			<view class="category">
				<view
					v-for="(item, index) in bannerList"
					:key="index"
					class="category-item"
					@click="() => toCategory(item)"
				>
					<image
						class="category-item-avatar"
						mode="scaleToFill"
						:src="item.avatar"
					/>
					<view class="category-item-name">{{ item.name }}</view>
				</view>
			</view>
		</view>

		<!--回收流程-->
		<!-- <view class="card">
			<tabs
				items="{{recTypes}}"
				current="{{currentRecType}}"
				onChange="onRecTypeChange"
				tabClassName="rec-type"
				tabActiveClassName="rec-type-active"
			>
				<view class="rec-progress-detail">
					<view class="rec-type-direction">{{ recTypes[currentRecType].direction }}</view>
					<image
						class="rec-type-content"
						mode="widthFix"
						src="/images/rec-progress-{{currentRecType+1}}.png"
					/>
					<view class="rec-type-process">
						<view
							v-for="item in  recTypes[rrentRecType].process }}"
							class="process-item"
						>
							{{ item }}
						</view>
					</view>
				</view>
			</tabs>
		</view> -->

		<!-- 回收指南 & 常见问题 -->
		<view class="card">
			<view class="card-header">
				<text class="card-header-title">回收指南</text>
				<view
					class="goQApage"
					@click="() => toCommonProblem()"
				>
					更多
					<uni-icons
						type="forward"
						color="#bbb"
					/>
				</view>
			</view>
			<view class="brandCtl">
				<uni-collapse-item
					v-for="item in questionList"
					:title="item.title"
				>
					<view class="question-answer">
						{{ item.content }}
					</view>
				</uni-collapse-item>
			</view>
		</view>

		<!-- 评价 -->
		<!-- <evaluation /> -->

		<!-- 回收指南 & 常见问题 -->
		<!-- <view class="card">
			<view class="card-header">
				<text class="card-header-title">官方客服</text>
			</view>
			<view class="service-card">
				<tabs
					items="{{serviceType}}"
					current="{{currentServiceType}}"
					onChange="serviceTypeChange"
				>
					<view
						v-if="currentServiceType===0 "
						class="alipay service-card-item"
					>
						<view class="left">
							<view class="service-title">在线客服</view>
							<view class="service-desc">每天9：00 - 18:00在线</view>
						</view>
						<view class="right"> 问客服 </view>
						<connect-btn />
					</view>
					<view
						a:elif="{{currentServiceType===1  }}"
						class="wx service-card-item"
						@click="copyWx"
					>
						客服微信：
						{{ serviceType[currentServiceType]['content'] }}（点击复制）
					</view>
					<view
						a:else
						class="phone service-card-item"
						@click="makePhoneCall"
					>
						客服电话：{{ serviceType[currentServiceType]['content'] }}(点击拨打电话)
					</view>
				</tabs>
			</view>
		</view> -->
		<view class="Blank" />
	</view>

	<!-- <common-connect-btn /> -->
</template>

<script>
	import { tips } from '../../utils/tips';
	import { MainIndexModel } from '../../model/mainindex';
	import { commonDomain as domain } from '../../constant/common';
	var mainIndexModel = new MainIndexModel();
	const Models = require('../../utils/modelList.js');

	import QAList from '../../constant/QA.json';
	import { recTypes, bannerList, serviceType } from './constant';

	//获取应用实例
	const app = getApp();
	export default {
		components: {},
		data() {
			return {
				phoneInfo: {},
				swiperList: [
					// "https://www.qupingce.com/GetFile/getUploadImg?fileName=9bcc72da9895463a92d8d4afeee7c497.jpg",
					// "https://www.qupingce.com/GetFile/getUploadImg?fileName=4ec2d8cf6ef24d5fbc75ab910c1f6cae.jpg",
					// "https://www.qupingce.com/GetFile/getUploadImg?fileName=4ec2d8cf6ef24d5fbc75ab910c1f6cae.jpg",
					'/static/images/b1.jpg',
					'/static/images/b2.jpg'
				],
				brandList: [], //前5个品牌
				currentRecType: 0,
				currentServiceType: 0,
				currentQuestion: 0,
				bannerList, //回收类目
				serviceType, //客服
				recTypes, //回收方式
				questionList: QAList.slice(0, 3), //常见问题
				domainName: domain.domain_qupingce
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
			goPlaceOrderStepsPage: function () {
				const { versionId } = this.phoneInfo;
				uni.navigateTo({
					url: `/pages/placeordersteps/placeordersteps?versionId=${versionId}`
				});
			},
			toSearchPage() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},
			goProductionPage() {
				console.log(123123);
				// 跳转tab页
				uni.switchTab({
					url: '/pages/category/category'
				});
			},
			getSystemInfo: function () {
				let it = this;
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
							it.searchByName(commonName);
						} else {
							it.searchByName('iPhone 14 Pro Max');
						}
					}
				});
			},

			searchByName: function (key) {
				let it = this;
				uni.request({
					url: `${domain.domain_qupingce}/search/serarchByKey`,
					data: { key },
					header: { 'content-type': 'application/json' },
					method: 'GET',
					success(res) {
						console.log(res);
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
						let formatKey = key.toLowerCase().replace(/\s+/g, ''); //当前机型也格式化一下,方便对比
						for (let v = 0; v < newArray.length; v++) {
							if (newArray[v].name == formatKey) {
								it.phoneInfo = {
									phoneName: newArray[v].normal_name,
									versionId: newArray[v].id,
									versionImg:
										it.domainName + '/GetFile/getUploadImg?fileName=' + newArray[v].title_img,
									much_money: newArray[v].much_money
								};
								console.log('it.phoneInfo: ', it.phoneInfo);

								return;
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

			toCommonProblem() {
				uni.navigateTo({
					url: '/pages/questionguide/questionguide'
				});
			},

			toKeySearch: function () {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},

			toCategoryFun(item) {
				const { brandId } = item;
				uni.setStorageSync('brandId', brandId);
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
<style scoped lang="scss">
	.page {
		width: 100%;
		padding: 120px 30rpx 0;
		background-color: #f7f6fb;
		overflow-x: hidden;
	}

	.page-header {
		height: 184rpx;
		width: 100%;
		z-index: 999;
		background-color: red;
		position: fixed;
		top: 0;
		left: 0;
		.statusBar {
			height: 108rpx;
		}
		.header-content {
			width: 100%;
			display: flex;
			height: 50rpx;
			padding: 0 180rpx 0 30rpx;
		}
		.header-content-title {
			font-size: 36rpx;
			color: #fff;
			font-weight: bold;
			margin-right: 20rpx;
		}
		.header-content-searchBar {
			background: #f3f3f3;
			border-radius: 20rpx;
			padding: 20rpx;
			display: flex;
			padding-left: 10rpx;
			align-items: center;
			font-size: 24rpx;
			padding: 10rpx 30rpx;
			z-index: 999;
		}
	}

	.header-swiper {
		width: 100%;
		height: 300rpx;
		border-radius: 20rpx;
		background-color: #fff;
		margin: 20rpx auto;
		.header-swiper-item {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;
		}
	}
	.card {
		width: 100%;
		border-radius: 20rpx;
		background-color: #fff;
		margin: 0 0 30rpx;
		padding: 20rpx;

		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: bold;
		}

		.card-header-title {
			font-size: 36rpx;
			margin: 20rpx;
			font-weight: bold;
		}
	}

	.goQApage {
		float: right;
		color: #999999;
		font-size: 24rpx;
		display: flex;
		align-items: center;
	}
	ww w.more-icon-spu {
		font-size: 84rpx;
		margin-bottom: 20rpx;
	}

	.spu-info {
		.spu-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-direction: row;
			flex-wrap: nowrap;
			.spu-header-left {
				font-weight: bold;
				font-size: 36rpx;
			}
			.spu-header-right {
				font-size: 26rpx;
				color: #999999;
			}

			.spu-header-right::after {
				content: '>';
				color: #999999;
				font-size: 26rpx;
				margin-left: 10rpx;
				font-weight: bold;
			}
		}

		.spu-content {
			width: 100%;
			height: 150rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-direction: row;
			flex-wrap: nowrap;

			.spu-avatar {
				width: 120rpx;
				height: 120rpx;
			}

			.spu-content-center {
				width: 360rpx;
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				.spu-content-center-item {
					margin: 20rpx 0;
					display: flex;
					align-items: center;
					.spu-name {
						display: inline-block;
						width: 200rpx;
						font-size: 30rpx;
						font-weight: bold;
						color: #000;
						// 单行超出显示省略
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.spu-price {
						font-size: 30rpx;
						font-weight: bold;
						color: red;
					}
				}
			}

			.sell-phone {
				width: 180rpx;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 40rpx;
				background-color: red;
				font-size: 30rpx;
				color: #fff;
				text-align: center;
				margin-left: 20rpx;
			}
		}
	}

	.category {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.category-item {
			width: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			.category-item-avatar {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-bottom: 20rpx;
			}
			.category-item-name {
				width: 100%;
				font-size: 30rpx;
				font-weight: bold;
				text-align: center;
			}
		}
	}

	.rec-progress-detail {
		width: 100%;
		padding: 0 30rpx;
	}
	.rec-type-direction {
		font-size: 30rpx;
		font-weight: bold;
		margin: 30rpx 0 20rpx;
	}
	.rec-type-active > .ant-tabs-bar-basic-title {
		font-weight: bold;
		color: #000;
		font-size: 36rpx;
	}
	.rec-type-content {
		width: 100%;
		box-sizing: border-box;
		margin: 20rpx 0 0;
	}
	.rec-type-process {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		color: #999;
	}

	.question-title {
		font-size: 26rpx;
		color: #000;
	}
	.questionContent {
		border-radius: 20rpx;
		overflow: hidden;
	}

	.question-answer {
		color: #999;
		font-size: 24rpx;
		line-height: 36rpx;
		box-sizing: border-box;
		padding: 30rpx 0;
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

	.service-card {
		margin-bottom: 20rpx;
		.service-card-item {
			width: 100%;
			background-color: #fff;
			padding: 40rpx 20rpx;
			font-size: 26rpx;
			color: #ddd;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.alipay {
			height: 180rpx;
			position: relative;
			&::before {
				position: absolute;
				content: '';
				width: 60rpx;
				height: 120rpx;
				background: url('@/static/images/service-avatar.png') no-repeat;
				background-size: 60rpx 120rpx;
				left: 40rpx;
				top: 50%;
				transform: translateY(-50%);
				display: block;
			}
			.left {
				width: calc(100% - 200rpx);
				height: 100%;
				padding: 20rpx 80rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				gap: 20rpx;
				.service-title {
					width: 100%;
					font-size: 30rpx;
					color: #000;
					font-weight: bold;
					text-align: left;
				}
				.service-desc {
					width: 100%;
					font-size: 24rpx;
					color: #999;
					text-align: left;
				}
			}
			.right {
				display: flex;
				height: 50rpx;
				justify-content: center;
				align-items: center;
				width: 160rpx;
				padding: 10rpx;
				border-radius: 20rpx;
				background-color: orange;
				color: #fff;
				font-size: 24rpx;
			}
		}
	}

	.Blank {
		height: 40px;
		width: 1005px;
	}
</style>
