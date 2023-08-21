<!-- @format -->

<template>
	<view style="text-align: center; background-color: white">
		<image
			v-if="tools.matchUndefined(url)"
			style="margin-top: 100rpx; margin: 100rpx auto"
			mode="aspectFit"
			:src="url"
		/>
		<container>
			<empty
				title="暂无数据"
				message="看看其它吧"
			/>
		</container>
	</view>
</template>
<script module="tool" src="./tools.sjs" lang="sjs"></script>
<script>
	export default {
		data() {
			return {
				url: ''
			};
		},
		onLoad(options) {
			this.setData({
				url: decodeURIComponent(options.url)
			});
		},
		methods: {}
	};
</script>
<style>
	@import './checktestimg.css';
</style>
