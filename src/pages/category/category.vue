<!-- @format -->

<template>
	<view class="page">
		<Search />

		<main-product />

		<my-drag-service />
	</view>
</template>

<script>
	import Search from './components/Search';
	import mainProduct from './components/mainProduct';
	export default {
		components: {
			Search,
			mainProduct
		}
	};
</script>
<style lang="scss" scoped>
	.page {
		background: white;
		padding-top: 30rpx;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
