<!-- @format -->

<template>
	<view class="container">
		<view class="navigation">
			<view
				:class="signClass == 'phone' ? 'item-sign-flag tab-item' : 'tab-item'"
				@click="changeType"
				data-type="phone"
			>
				手机
			</view>
			<view
				:class="signClass == 'pad' ? 'item-sign-flag tab-item' : 'tab-item'"
				@click="changeType"
				data-type="pad"
			>
				平板
			</view>
			<view
				:class="signClass == 'computer' ? 'item-sign-flag tab-item' : 'tab-item'"
				@click="changeType"
				data-type="computer"
			>
				笔记本
			</view>
			<!-- <view
				:class="signClass == 'digital' ? 'item-sign-flag tab-item' : 'tab-item'"
				data-type="digital"
				@click="changeType"
			>
				智能数码
			</view> -->
		</view>

		<!-- main产品数据 -->
		<view
			v-if="flag == 'main'"
			class="main-container"
		>
			<view class="left-brand">
				<scroll-view
					scroll-y
					class="left-list"
					:scroll-with-animation="true"
				>
					<block
						v-for="(item, index) in brandList"
						:key="index"
					>
						<view
							:class="'item ' + (item.brandId == brandId ? 'sign' : '')"
							:data-brand-id="item.brandId"
							@click="changeBrandItemByMain"
						>
							<text>{{ item.brandName }}</text>
						</view>
					</block>
					<view style="height: 200px; width: 100%"></view>
				</scroll-view>
			</view>

			<view class="right-product">
				<scroll-view
					scroll-y
					:scroll-top="scrollTop"
					@scrolltolower="loadMore"
					class="right-list"
				>
					<block
						v-for="(item, index) in productList"
						:key="index"
					>
						<view
							:data-version-id="item.versionId"
							@click="gotoCountPrice"
							class="right-pre-item"
						>
							<image
								:src="domainName + item.img"
								lazy-load
							></image>
							<text>{{ item.versionName }}</text>
						</view>
					</block>
					<view style="height: 200px; width: 100%"></view>
				</scroll-view>
			</view>
		</view>

		<!-- 智能数码产品数据 -->
		<view
			v-else
			class="main-container"
		>
			<view class="left-brand">
				<scroll-view
					scroll-y
					class="left-list"
					:scroll-with-animation="true"
				>
					<block
						v-for="(item, index) in typeList"
						:key="index"
					>
						<view
							:class="
								'item ' +
								(item.type_id == typeId ? 'sign' : typeId == '' && index == 0 ? 'sign' : '')
							"
							:data-type-id="item.type_id"
							:data-type-name="item.type_name"
							@click="changeBrandItemByDigital"
						>
							<text style="margin-left: 30rpx">{{ item.remark_name }}</text>
						</view>
					</block>
				</scroll-view>
			</view>
			<view class="right-product">
				<scroll-view
					scroll-y
					:scroll-top="scrollTop"
					@scrolltolower="loadMoreDigital"
				>
					<block
						v-for="(item, index) in digitalBrandList"
						:key="index"
					>
						<view
							@click="gotoDigitalList"
							:data-brand-id="item.brand_id"
							class="right-pre-item"
						>
							<image
								:src="domainName + item.brand_img"
								:lazy-load="true"
								lazy-load
							/>
							<text>{{ item.brand_name }}</text>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import { tips } from '@/utils/tips';
	import { commonDomain as domain } from '@/constant/common';
	export default {
		data() {
			return {
				domainName: '',

				scrollTop: 0,

				signClass: 'phone',

				//选中的标志,默认选中手机
				brandId: '85001ac13f7e4c56ab949328165e0ed6',

				//地址栏的参数brandId，默认为0
				flag: 'main',

				//产品的具体类型,默认为main产品类型
				type: 'phone',

				//type默认为手机
				typeId: '',

				//智能数码用的typeId
				typeName: '',

				//类型名字，智能数码使用
				brandList: [],

				//品牌集合
				productList: [],

				//具体产品集合
				typeList: [],

				//类型数据集合，智能数码使用
				digitalBrandList: [],

				//智能数码的品牌数据集合
				windowHeight: 555,

				//默认为iphone6屏幕尺寸
				page: 1,

				//分页默认加载第一页
				limit: 15,

				//每一页默认加载12条数据
				//总页数，初始化时候为0
				//isShow: false //是否显示加载框
				total: 0,

				isShow: false
			};
		},
		//页面初始化
		created: function () {
			var clientInfo = uni.getSystemInfoSync();
			var windowHeight = clientInfo.windowHeight; //可操作屏幕的高度，需要自适应高度

			if (['PAHM00', 'PAFM00', 'PAFT00'].includes(clientInfo.model)) {
				//OPPO find X特殊处理下
				windowHeight = 680;
			}

			try {
				//由于tab的切换不能携带参数，所以就把首页点击的品牌brandId存入到缓存中，然后在这儿获取缓存中的brandId
				let brandId = uni.getStorageSync('brandId'); //也取一下品牌类型@hbp
				if (brandId == null || brandId == '') {
					brandId = '85001ac13f7e4c56ab949328165e0ed6';
				}

				let the_type = uni.getStorageSync('the_type');
				if (the_type == null || the_type == '') {
					the_type = 'phone';
				}
				if (the_type === 'digital') {
					this.setData(
						{
							signClass: 'digital',
							type: 'digital',
							flag: 'digital',
							brandId: '85001ac13f7e4c56ab949328165e0ed6',
							page: 1,
							total: 0,
							domainName: domain.apiHost
						},
						() => {
							this.initDigitalProduct();
						}
					);
				} else {
					this.setData(
						{
							brandId: brandId,
							signClass: the_type,
							type: the_type,
							domainName: domain.apiHost,
							windowHeight: windowHeight < 555 ? 555 : windowHeight //小于iphone6的尺寸都按照iphone6来设置
						},
						() => {
							this.initMainProduct();
						}
					);
				}
			} catch (e) {
				tips.ERROR_500();
			}
			uni.removeStorageSync({
				key: 'brandId'
			}); //把缓存里面的数据清空

			uni.removeStorageSync({
				key: 'the_type'
			}); //把缓存里面的数据清空@hbp
		},
		methods: {
			//加载更多（main产品）
			loadMore: function () {
				let that = this;

				if (that.page + 1 <= this.total) {
					that.setData({
						page: that.page + 1
					});
					uni.showLoading({
						title: '加载中～'
					});
					//初始化页面右侧数据
					uni.request({
						url: `${domain.apiHost}/page/ChooseTypeByBrandByPage`,
						method: 'GET',
						headers: {
							'content-type': 'application/x-www-form-urlencoded' // post请求需设置
						},
						data: {
							type: that.type,
							brandId: that.brandId,
							page: that.page,
							limit: that.limit,
							company: 'jd'
						},
						dataType: 'JSON',
						success: function (res) {
							// #ifdef MP-ALIPAY
							if (res.statusCode == 200) {
								if (res.data.status == 200) {
									that.setData({
										productList: that.productList.concat(res.data.data),
										total: Math.ceil(res.data.total / that.limit) //小数向前进1
									});
								} else {
									tips.ERROR_500();
								}
							}
							// #endif

							// #ifdef MP-WEIXIN
							if (res.statusCode !== 200) return;
							try {
								const { data, total } = JSON.parse(res.data);
								that.setData({
									productList: that.productList.concat(data),
									total: Math.ceil(total / that.limit) //小数向前进1
								});
							} catch (error) {
								tips.ERROR_500();
							}
							// #endif
						},
						fail: function (err) {
							tips.ERROR_500();
						},
						complete: function () {
							setTimeout(function () {
								uni.hideLoading();
							}, 1000);
						}
					});
				}
			},

			//加载更多，智能数码产品
			loadMoreForDigital: function () {
				let that = this;

				if (that.page + 1 <= this.total) {
					that.setData({
						page: that.page + 1
					});

					uni.showLoading({
						title: '加载中～'
					});
					//右侧栏的数据
					uni.request({
						url: `${domain.apiHost}/page/getIRBrandByPage`,
						method: 'GET',
						headers: {
							'content-type': 'application/x-www-form-urlencoded' // post请求需设置
						},

						data: {
							type_id: that.typeId,
							page: that.page,
							limit: that.limit
						},
						dataType: 'json',
						success: function (res) {
							console.log('res: ', res);

							// #ifdef MP-ALIPAY
							if (res.statusCode == 200) {
								let firstTypeId = '';
								let firstTypeName = '';
								if (res.data.data.data.length > 0) {
									firstTypeId = res.data.data.data[0].type_id;
									firstTypeName = res.data.data.data[0].type_name;
								}
								if (res.data.status == 200) {
									that.setData({
										digitalBrandList: that.digitalBrandList.concat(res.data.data.data),
										typeId: firstTypeId,
										typeName: firstTypeName,
										total: res.data.data.data.total
									});
								} else {
									tips.ERROR_500();
								}
							}
							// #endif

							// #ifdef MP-WEIXIN
							if (res.statusCode !== 200) return;
							try {
								let firstTypeId = '';
								let firstTypeName = '';
								const { data } = JSON.parse(res.data);
								console.log('data: ', data);
							} catch (error) {
								console.log('error: ', error);
							}
							// #endif
						},
						fail: function (err) {
							tips.ERROR_500();
						},
						complete: function () {
							that.setData({
								isShow: false
							});
						}
					});
				}
			},

			//初始化页面数据
			initMainProduct: function () {
				let that = this;
				//main产品

				uni.request({
					url: `${domain.apiHost}/page/getAllBrandByType`,
					method: 'GET',
					data: {
						type: that.type
					},
					dataType: 'JSON',
					success: function (res) {
						console.log('res: ', res);
						// #ifdef MP-WEIXIN
						if (res.statusCode !== 200) return;
						const { data } = JSON.parse(res.data);
						that.setData({
							brandList: data
						});
						// #endif

						// #ifdef MP-ALIPAY
						if (res.statusCode !== 200) return;
						if (res.data.status == 200) {
							that.setData({
								brandList: res.data.data
							});
						} else {
							tips.ERROR_500();
						}
						// #endif
					},
					fail: function (err) {
						tips.ERROR_500();
					}
				}); //初始化页面右侧数据

				uni.request({
					url: `${domain.apiHost}/page/ChooseTypeByBrandByPage`,
					method: 'GET',
					headers: {
						'content-type': 'application/json' // post请求需设置
					},

					data: {
						type: that.type,
						brandId: that.brandId,
						page: that.page,
						limit: that.limit,
						company: 'jd'
					},
					dataType: 'json',
					success: function (res) {
						if (res.statusCode == 200) {
							if (res.data.status == 200) {
								that.setData({
									productList: res.data.data,
									total: Math.ceil(res.data.total / that.limit)
									//小数向前进1
									//isShow: false
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

			getIRTypeList() {
				let _this = this;
				return new Promise((resolve, reject) => {
					uni.request({
						url: `${domain.apiHost}/page/getIRTypeList`,
						method: 'GET',
						data: '',
						dataType: 'json',
						success: function (res) {
							// #ifdef MP-ALIPAY
							if (res.statusCode == 200) {
								if (res.data.status == 200) {
									_this.setData({
										typeList: res.data.data
									});
								} else {
									tips.ERROR_500();
								}
							}
							// #endif

							// #ifdef MP-WEIXIN
							if (res.statusCode !== 200) return;
							try {
								const { data } = res.data;
								_this.setData({
									typeList: data
								});
							} catch (error) {
								console.log('error: ', error);
							}
							// #endif

							resolve();
						},
						fail: function (err) {
							tips.ERROR_500();
							reject();
						}
					});
				});
			},
			getIRBrandByPage() {
				let _this = this;
				return new Promise((resolve, reject) => {
					uni.request({
						url: `${domain.apiHost}/page/getIRBrandByPage`,
						method: 'GET',
						data: {
							type_id: _this.typeId,
							page: _this.page,
							limit: _this.limit
						},
						dataType: 'JSON',
						success: function (res) {
							// #ifdef MP-ALIPAY
							if (res.statusCode == 200) {
								let firstTypeId = '';
								let firstTypeName = '';
								if (res.data.data.data.length > 0) {
									firstTypeId = res.data.data.data[0].type_id;
									firstTypeName = res.data.data.data[0].type_name;
								}
								if (res.data.status == 200) {
									_this.setData({
										digitalBrandList: res.data.data.data,
										typeId: firstTypeId,
										typeName: firstTypeName,
										total: res.data.data.total
									});
								} else {
									tips.ERROR_500();
								}
							}
							// #endif

							// #ifdef MP-WEIXIN
							if (res.statusCode == 200) {
								let firstTypeId = '';
								let firstTypeName = '';
								try {
									const { data } = JSON.parse(res.data);
									const { data: list, total } = data;
									if (list.length > 0) {
										let firstSpu = list[0];
										firstTypeId = firstSpu.type_id;
										firstTypeName = firstSpu.type_name;
									}
									_this.setData({
										digitalBrandList: list,
										typeId: firstTypeId,
										typeName: firstTypeName,
										total: total
									});
								} catch (error) {
									console.log('error: ', error);
								}
							}
							// #endif

							resolve();
						},
						fail: function (err) {
							tips.ERROR_500();
							reject(err);
						}
					});
				});
			},
			//初始化智能数码数据
			async initDigitalProduct() {
				await this.getIRTypeList();
				console.log(123);
				await this.getIRBrandByPage();
			},
			//切换类型条目(手机/平板/笔记本/智能数码)
			changeType: function (event) {
				this.scrollTop--;

				uni.removeStorageSync('brandId'); //切换条目的时候把上一个页面传递过来的删除掉

				if (event.currentTarget.dataset.type != 'digital') {
					this.setData({
						signClass: event.currentTarget.dataset.type,
						type: event.currentTarget.dataset.type,
						flag: 'main',
						brandId: '85001ac13f7e4c56ab949328165e0ed6',
						page: 1,
						total: 0
					});
					this.initMainProduct();
				} else {
					this.setData({
						signClass: event.currentTarget.dataset.type,
						type: event.currentTarget.dataset.type,
						flag: 'digital',
						brandId: '85001ac13f7e4c56ab949328165e0ed6',
						page: 1,
						total: 0
					});
					this.initDigitalProduct();
				}
			},
			//切换主要产品左侧栏的样式
			changeBrandItemByMain(event) {
				this.setData({
					brandId: event.currentTarget.dataset.brandId,
					page: 1,
					total: 0
				});
				this.scrollTop--;
				this.initMainProduct();
			},
			//切换智能数码左侧栏的数据
			changeBrandItemByDigital(event) {
				this.setData({
					typeId: event.currentTarget.dataset.typeId,
					typeName: event.currentTarget.dataset.typeName,
					page: 1,
					total: 0
				});
				this.initDigitalProduct();
			},
			//跳转到去估价页面
			gotoCountPrice(event) {
				let versionId = event.currentTarget.dataset.versionId;
				if (versionId == null || versionId == '') {
					tips.ERROR_500();
				} else {
					uni.navigateTo({
						url: '/pages/placeordersteps/placeordersteps?versionId=' + versionId
					});
				}
			},
			//跳转到具体的电子产品页面去
			gotoDigitalList(event) {
				let brandId = event.currentTarget.dataset.brandId;
				let typeId = this.typeId;
				let typeName = this.typeName;
				uni.navigateTo({
					url: `/pages/digitallist/digitallist?brandId=${brandId}&typeId=${typeId}&typeName=${typeName}`
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	.container {
		width: 100vw;
		height: 100%;
		background: #fff;
		.navigation {
			margin-left: 40rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			border-bottom: 2rpx #f8f8f8 solid;
			flex-wrap: nowrap;
		}
		.navigation view {
			font-weight: bolder;
			font-size: 30rpx;
			display: inline-block !important;
			padding: 24rpx !important;
		}
		.tab-item {
			background: linear-gradient(red, red), linear-gradient(#fff, #fff);
			background-size: 0 4rpx, auto;
			background-repeat: no-repeat;
			background-position: center 70rpx;
			transition: all 0.2s ease-out;
		}
		.item-sign-flag {
			background-size: 40rpx 4rpx, auto !important;
		}
	}

	.main-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 1200rpx;
		overflow: hidden;
		position: relative;
	}

	.left-brand {
		position: absolute;
		left: 0;
		top: 0;
		width: 200rpx;
		height: 100%;
		display: inline-block;
		background-color: #f5f5f5;
		z-index: 99;
		.left-list {
			width: 100%;
			height: 100%;
			background-color: #f5f5f5;
			.item {
				width: 100%;
				display: flex;
				flex-wrap: nowrap;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				font-weight: normal;
				padding: 35rpx;
			}
			.sign {
				font-size: 30rpx;
				font-weight: bold;
				background-color: #fff;
				position: relative;
			}
		}
	}

	.right-product {
		position: absolute;
		right: -100rpx;
		top: 0;
		padding: 20rpx 100rpx 20rpx 20rpx;
		height: 100%;
		width: calc(100% - 100rpx);
		background-color: #fff;
		.right-list {
			height: 100%;
		}
		.right-pre-item {
			width: 160rpx;
			height: 250rpx;
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			/* justify-content: space-around; */
			text-align: center;
			margin-right: 10rpx;
			position: relative;
		}
	}

	.container .right-product .right-pre-item text {
		font-size: 24rpx;
		color: #808080;
		margin-top: 30rpx;
	}

	.container .right-product image {
		width: 120rpx;
		height: 120rpx;
	}

	.digital-container {
		display: flex;
		flex-direction: row;
	}

	.loading {
		position: relative;
		left: 50%;
		margin-left: -100rpx;
		width: 200rpx;
		padding-bottom: 10rpx;
	}

	.loading2 {
		position: relative;
		right: -140rpx;
	}

	.active-mark {
		height: 28rpx;
		width: 100rpx;
		background-color: #f33;
		color: #fff3f3;
		top: 28%;
		right: 10%;
		margin-right: 12rpx;
		margin-top: 10rpx;
		font-size: 21rpx;
		position: absolute;
		transform: rotate(15deg);
		-ms-transform: rotate(15deg);
		/* IE 9 */
		-moz-transform: rotate(15deg);
		/* Firefox */
		-webkit-transform: rotate(15deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(15deg);
		border-top-left-radius: 40rpx;
		border-top-right-radius: 90rpx;
		box-shadow: 0 5rpx 5rpx #c1350b;
	}
</style>
