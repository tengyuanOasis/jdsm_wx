<!-- @format -->

<template>
	<view style="height: 100%">
		<!-- components/hotversion/hotversion.axml -->
		<!-- 热门回收机型 -->
		<listmessage-cmp tipclass="bgs">
			<text
				slot="before"
				style="font-size: 35rpx; position: absolute; left: 5%; font-weight: bold"
				>热门机型</text
			>
			<navigator
				slot="after"
				open-type="reLaunch"
				url="/pages/category/category"
				style="color: #ffbe98; font-size: 24rpx; font-weight: bold"
				onTap="clearBrand"
			>
				更多机型
			</navigator>
		</listmessage-cmp>
		<scroll-view
			:scroll-x="true"
			class="container-hotversion"
		>
			<block
				v-for="(item, index) in versionsArray"
				:key="index"
			>
				<view
					class="onetap3"
					:data-vid="item"
					onTap="enFun"
				>
					<view class="pcl">
						<image
							:src="domain + item.mobileImg"
							style="width: 160rpx; height: 160rpx"
						></image>
					</view>
					<view class="sec_tap4">
						<text class="re_text1">{{ item.versionName }}</text>
						<text
							class="re_text2"
							style="height: 1em"
						></text>
					</view>
					<text class="re_text6">立即回收</text>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	import listmessageCmp from '@/components/listmessage/listmessage';
	import { commonDomain as domain } from '../../constant/common';
	import { MainIndexModel } from '../../model/mainindex';
	var mainIndexModel = new MainIndexModel();
	export default {
		components: {
			listmessageCmp
		},
		data() {
			return {
				versionsArray: [],
				//热门机型数组
				domain: domain.apiHost
			};
		},
		/**
		 * 组件的属性列表
		 */
		props: {},
		didMount: function () {
			let that = this;
			mainIndexModel.getHotVersion().then(function (res) {
				if (res.status == 200) {
					that.setData({
						versionsArray: res.data
					});
				}
			});
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			clearBrand() {
				uni.setStorageSync('brandId', '');
			},
			enFun(event) {
				var vid = event.currentTarget.dataset.vid;
				if (vid.flag == 'main' || (vid.flag == 'digital') & (vid.type_name == 'watch')) {
					uni.navigateTo({
						url: '/pages/placeordersteps/placeordersteps?versionId=' + vid.versionId
					});
				} else {
					uni.navigateTo({
						url: '/pages/digitalordersteps/digitalordersteps?versionId=' + vid.versionId
					});
				}
			}
		},
		created: function () {}
	};
</script>
<style>
	@import './hotversion.css';
</style>
