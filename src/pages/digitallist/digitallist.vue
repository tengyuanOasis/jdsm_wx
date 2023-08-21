<!-- @format -->

<template>
	<view style="height: 100%">
		<view style="height: 30rpx"></view>

		<!-- 搜索框 -->
		<view
			class="searchctl"
			onTap="toKeySearch"
		>
			<image
				src="/static/images/l_search.png"
				style="width: 30rpx; height: 30rpx; margin-right: 20rpx"
			></image>
			<text>搜索你想要回收的产品型号</text>
		</view>

		<view class="container-ex">
			<view class="main-content">
				<block
					v-for="(item, index) in digitalList"
					:key="index"
				>
					<view
						style="position: relative"
						:data-version-id="item.versionId"
						onTap="gotoCountPrice"
					>
						<image :src="domain + item.img"></image>
						<text>{{ item.versionName }}</text>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import { tips } from '../../utils/tips';
	import { commonDomain as domain } from '../../constant/common';
	export default {
		data() {
			return {
				domain: '',
				brandId: '',
				//品牌Id
				typeId: '',
				//类型ID
				typeName: '',
				//类型名字
				digitalList: []
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */ onLoad: function (options) {
			//获取上一个页面传递过来的数据
			this.setData({
				brandId: options.brandId,
				typeId: options.typeId,
				typeName: options.typeName,
				domain: domain.apiHost
			});
			let that = this; //初始化页面的数据

			uni.request({
				url: `${domain.apiHost}/page/getIRVersion`,
				method: 'GET',
				headers: {
					'content-type': 'application/json' // post请求需设置
				},

				data: {
					brandId: this.brandId,
					typeId: this.typeId,
					typeName: this.typeName,
					company: 'jd'
				},
				dataType: 'JSON',
				success(res) {
					if (res.status == 200) {
						if (res.data.status == 200) {
							that.setData({
								digitalList: res.data.data
							});
						} else {
							tips.ERROR_500000(res.data.msg);
						}
					} else {
						tips.ERROR_500();
					}
				},
				fail: function (err) {
					tips.ERROR_500();
				}
			});
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function () {},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function () {
			uni.stopPullDownRefresh();
		},
		methods: {
			//跳转到去估价页面
			gotoCountPrice(event) {
				let versionId = event.currentTarget.dataset.versionId;
				let typeName = this.typeName;
				if (versionId == null || versionId == '') {
					tips.ERROR_500();
				} else {
					//如果类型名字不为手表就跳到通用的估价页面去
					if (typeName != 'watch') {
						/**
						 * TODO:非手表的估价页面
						 */
						uni.navigateTo({
							url: `/pages/digitalordersteps/digitalordersteps?versionId=${versionId}&typeName=${typeName}`
						});
					} else {
						//如果为手表的话就跳转到通用的页面进行处理
						uni.navigateTo({
							url: `/pages/placeordersteps/placeordersteps?versionId=${versionId}&typeName=${typeName}`
						});
					}
				}
			},

			toKeySearch: function () {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			}
		}
	};
</script>
<style>
	@import './digitallist.css';
</style>
