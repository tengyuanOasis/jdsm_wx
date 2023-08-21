<!-- @format -->

<template>
	<view class="page-header">
		<!-- #ifdef MP-ALIPAY -->
		<uni-nav-bar
			statusBar
			backgroundColor="red"
			:leftWidth="130"
			:rightWidth="80"
			:border="false"
		>
			<template v-slot:left> <view class="header-content-title"> 尖端数码回收 </view></template>
			<view
				class="header-content"
				@click="toSearchPage"
			>
				<view class="header-content-searchBar">
					<uni-icons
						type="search"
						style="font-weight: bold"
					/>
					搜索回收机型
				</view>
			</view>
		</uni-nav-bar>
		<!-- #endif -->

		<!-- #ifdef MP-WEIXIN -->
		<uni-nav-bar
			statusBar
			backgroundColor="red"
			:leftWidth="120"
			:rightWidth="80"
			:border="false"
		>
			<template v-slot:left> <view class="header-content-title wx"> 尖端数码回收 </view></template>
			<view
				class="header-content"
				@click="toSearchPage"
			>
				<view class="header-content-searchBar">
					<uni-icons
						type="search"
						style="font-weight: bold"
					/>
					搜索回收机型
				</view>
			</view>
		</uni-nav-bar>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		name: 'Header',
		data() {
			return {};
		},
		methods: {
			toSearchPage() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.page-header {
		width: 100%;
		z-index: 999;
		background-color: red;
		position: fixed;
		top: 0;
		left: 0;

		.header-content-title {
			font-size: 28rpx;
			color: #fff;
			font-weight: bold;
			width: 100%;
			padding-left: 70rpx;
			&.wx {
				padding-left: 20rpx;
			}
		}
		.header-content {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

			.header-content-searchBar {
				background: #f3f3f3;
				border-radius: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24rpx;
				padding: 10rpx 30rpx;
				z-index: 999;
			}
		}
	}
</style>
