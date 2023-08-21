<!-- @format -->

<template>
	<view class="container">
		<view class="section">
			<view class="section_img">
				<image src="/static/images/l_search.png" />
			</view>
			<input
				class="search-input"
				placeholder="请输入机型名称"
				:focus="focus"
				onInput="getkey"
				confirm-type="search"
				:prikey="prikey"
				placeholder-class="holder"
				@change="getkey"
			/>
			<view class="search-btn" @click="getkey(prikey)">搜索</view>
		</view>

		<view v-if="prikey != '' && searchArray.length" class="spu-list">
			<view v-for="(item, index) in searchArray" :key="index">
				<view class="spu-item" @click="enterFun(item)">
					<image
						mode="scaleToFill"
						:src="`https://lipeishixz.com/GetFile/getUploadImg?fileName=${item.title_img}`"
						class="spu-avatar"
					/>
					<view class="center">
						<view class="spu-name" slot="title">{{ item.version_name }}</view>
						<view class="spu-price" slot="extra">最高¥{{ item.much_money }}元</view>
					</view>
					<view class="right">></view>
				</view>
			</view>
		</view>

		<view v-if="prikey != '' && !searchArray.length" class="spuList">
			<empty
				title="暂无数据"
				message="联系客服咨询"
				image="https://gw.alipayobjects.com/mdn/rms_7cc883/afts/img/A*PG7NQoXbN38AAAAAAAAAAAAAARQnAQ"
			/>
		</view>

		<view v-if="latestArray.length > 0" class="search-history">
			<view class="first_bank">
				<text style="font-weight: bold">历史搜索</text>
				<view style="color: #696969; font-size: 28rpx; font-weight: bold" @click="clearHisStor">
					清空
				</view>
			</view>
			<view v-if="latestArray.length > 0" class="his">
				<block v-for="(item, index) in latestArray" :key="index">
					<view @click="getSearchKeyByHis" :data-variable="item" class="hisItem">
						{{ item.version_name }}
					</view>
				</block>
			</view>
		</view>

		<my-drag-service />
	</view>
</template>

<script>
	import headerCmp from '@/components/header/header';

	import { commonDomain as domain } from '../../constant/common';
	export default {
		components: {
			headerCmp
		},
		data() {
			return {
				focus: true,
				prikey: '',
				searchArray: [],
				//根据关键字查的机型数组
				latestArray: [] //历史搜索缓存数据
			};
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function () {
			this.latestArray = [];
			let _latestArray = uni.getStorageSync('latestArray');
			if (_latestArray.length > 0) {
				//取缓存
				this.latestArray = _latestArray;
			}
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function () {
			uni.stopPullDownRefresh();
		},
		methods: {
			getkey: function (e) {
				let _this = this;
				let oldKey = this.prikey;
				this.prikey = typeof e === 'object' ? e.detail.value : e;
				if (this.prikey != oldKey) {
					uni.request({
						url: `${domain.apiHost}/search/serarchByKey`,
						headers: {
							'content-type': 'application/json' // 默认值
						},
						data: {
							key: _this.prikey,
							company: 'jd'
						},
						method: 'GET',
						dataType: 'JSON',
						success(res) {
							if (res.statusCode == 200) {
								const jsonData = JSON.parse(res.data);
								_this.searchArray = jsonData.data;
							}
						}
					});
				}
			},

			getSearchKeyByHis: function (e) {
				const _this = this;
				var item = e.currentTarget.dataset.variable;
				this.setData({
					prikey: item.version_name
				});
				this.focus = true;
				let that = this;
				uni.request({
					url: `${domain.apiHost}/search/serarchByKey`,
					data: {
						key: that.prikey,
						company: 'jd'
					},
					header: {
						'content-type': 'application/json' // 默认值
					},

					success(res) {
						console.log('res: ', res);
						if (res.statusCode == 200) {
							const jsonData = res.data;
							_this.searchArray = jsonData.data;
						}
					}
				});
			},

			enterFun: function (item) {
				const latestArray = uni.getStorageSync('latestArray') || [];
				const filterList = latestArray.filter(Boolean) || [];
				if (filterList && filterList.length > 0) {
					this.latestArray = filterList;
					var ret = filterList.findIndex((value, index, arr) => {
						//缓存数组排重
						return value.version_id == item.version_id;
					});
					if (ret == -1) {
						//缓存数组不存在当前搜索
						this.latestArray.unshift(item);
					}
				} else {
					this.latestArray.unshift(item);
				}
				uni.setStorageSync('latestArray', this.latestArray); //存缓存
				if (['digital', 'main'].includes(item.flag) & (item.type_name === 'watch')) {
					uni.navigateTo({
						url: `/pages/placeordersteps/placeordersteps?versionId=${item.version_id}`
					});
				} else {
					uni.navigateTo({
						// url: '/pages/digitalordersteps/digitalordersteps?versionId=' + item.version_id
						url: `/pages/placeordersteps/placeordersteps?versionId=${item.version_id}`
					});
				}
			},

			clearHisStor: function () {
				//清空历史纪录
				let that = this;
				let latestArray = uni.getStorageSync('latestArray');
				if (latestArray != null) {
					uni.showModal({
						title: '',
						content: '确定要清空所有历史记录吗',
						cancelButtonText: '取消',
						confirmButtonText: '清空',
						success(res) {
							if (res.confirm) {
								that.latestArray = [];
								uni.removeStorageSync({ key: 'latestArray' });
							}
						}
					});
				}
			}
		}
	};
</script>
<style lang="scss" scoped>
	/* pages/search/search.wxss */

	$common-radius: 20rpx;

	page {
		width: 100%;
		background: #f7f6fb;
		padding: 40rpx 30rpx;
	}

	.container {
		width: 100%;
	}

	.section {
		display: flex;
		width: 100%;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		height: 70rpx;
		border-radius: $common-radius;
		color: #aeaeae;
		background: white;
		margin: 0 auto 40rpx;
		/* 边框阴影*/
		box-shadow: 0rpx 0rpx 10rpx rgba(0, 0, 0, 0.05);
		.holder {
			color: #aeaeae;
		}
		.search-input {
			width: 80%;
			height: 60rpx;
			font-size: 28rpx;
			font-weight: bold;
			color: #aeaeae;
			background-color: white;
			border-radius: 0 50rpx 50rpx 0;
		}
		.search-btn {
			width: 120rpx;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.section_img {
			width: 8%;
			text-align: center;
			height: 60rpx;
			background: white;
			border-radius: 50rpx 0 0 50rpx;
		}
		.section_img image {
			width: 35rpx;
			height: 35rpx;
			margin-top: 13rpx;
		}
	}

	.search-history {
		margin-top: 40rpx;
		width: 100%;
		background: white;
		min-height: 210rpx;
		border-radius: $common-radius;
	}

	.first_bank {
		margin-left: 5%;
		font-size: 30rpx;
		color: black;
		display: flex;
		align-items: center;
		width: 90%;
		height: 80rpx;
		justify-content: space-between;
		border-bottom: 1px solid #f4f4f4;
	}

	.sec_bank {
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.sec_button {
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666;
		background: #f8f8f8;
		width: 94%;
		height: 75rpx;
		border-radius: 5rpx;
	}

	.section3 {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 28rpx;
		color: #999;
		float: right;
		margin-right: 30rpx;
	}

	.digital {
		display: inline;
		color: #10d057;
		font-size: 30rpx;
		font-weight: bold;
	}

	.spuList {
		border-radius: $common-radius;
		margin-top: 40rpx;
		width: 100%;
		background: #fff;
		font-size: 28rpx;
	}

	.selectItem {
		text-indent: 20rpx;
		margin-left: 2%;
		width: 96%;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: solid 1px #f4f4f4;
	}

	.his {
		margin-top: 30rpx;
		width: 90%;
		margin-left: 5%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.hisItem {
		font-size: 25rpx;
		color: #808080;
		padding: 15rpx 20rpx;
		background: #f5f4f9;
		border-radius: 30rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
	}

	.spu-list {
		border-radius: $common-radius;
		overflow: hidden;
		.spu-item {
			display: flex;
			align-items: center;
			padding: 30rpx;
			background-color: #fff;
			margin: 20rpx;
			border-radius: $common-radius;
			position: relative;
			.spu-avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius: 10rpx;
				display: inline-block;
				margin-right: 20rpx;
			}
			.center {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.spu-name {
					font-size: 30rpx;
					font-weight: bold;
					color: #000;
					margin-bottom: 20rpx;
				}
				.spu-price {
					font-size: 20rpx;
					color: red;
				}
			}
			.right {
				width: 100rpx;
				height: 100rpx;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 0;
				font-weight: bold;

				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
