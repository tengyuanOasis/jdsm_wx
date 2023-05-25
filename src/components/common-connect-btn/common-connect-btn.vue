<!-- @format -->

<template>
	<!-- 导航栏容器 -->
	<view class="common-connect-btn">
		<view class="content">
			<connect-btn />
			<!-- <icon type="KoubeiFill" style="{{color:'red',fontSize: '40px'}}" /> -->
			<image
				mode="scaleToFill"
				src="/static/images/chat.svg"
				style="width: 60rpx"
			/>
		</view>
	</view>
</template>

<script>
	import connectBtn from '@/components/connect-btn/connect-btn';
	/** @format */
	const config = require('../../constant/common');
	export default {
		components: {
			connectBtn
		},
		data() {
			return {
				servicesConfig: config.servicesConfig
			};
		},
		props: {},
		didMount: function () {},
		methods: {},
		created: function () {}
	};
</script>
<style lang="scss">
	@import './common-connect-btn.scss';
</style>
