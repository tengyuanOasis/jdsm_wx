<!-- @format -->

<template>
	<view
		class="searchctl"
		@click="toKeySearch"
	>
		<image
			src="/static/images/l_search.png"
			style="width: 30rpx; height: 30rpx; margin-right: 20rpx"
		/>
		<text>搜索你想要回收的产品型号</text>
	</view>
</template>

<script>
	export default {
		name: 'Search',
		components: {},
		mixins: [],
		props: {},
		data() {
			return {};
		},
		computed: {},
		watch: {},
		created() {},
		mounted() {},
		methods: {
			toKeySearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			}
		}
	};
</script>

<style scoped lang="scss">
.searchctl {
		width: 90%;
		margin-left: 5%;
		background: #f3f3f3;
		height: 64rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		flex-direction: row;
		font-size: 26rpx;
		color: #999999;
		justify-content: center;
	}
</style>
