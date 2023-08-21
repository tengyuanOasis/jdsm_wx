<template>
	<!-- components/header/header.axml -->
	<!-- 置顶搜索框 -->
	<view :class="headerclass">
		<!-- 导航部分前段插槽 -->
		<view class="title-img">
			<slot name="before"></slot>
		</view>
		<!-- 导航部分中段插槽 -->
		<view v-if="isShow == 'true'" class="fake_input" onTap="mainsearch">
			<slot name="middle"></slot>
		</view>
		<view v-else class="common-question">
			<slot name="question"></slot>
		</view>
		<!-- 导航部分后段插槽 -->
		<view class="mine-logo">
			<slot name="after"></slot>
		</view>
	</view>
</template>

<script>
	// components/header/header.js
	export default {
		data() {
			return {};
		},
		options: {
			multipleSlots: true //开启使用插槽
		},
		externalClasses: ['bg'],
		/**
		 * 组件的属性列表
		 */
		props: {
			isShow: 'true',
			headerclass: 'header'
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			mainsearch: function () {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			}
		},
		created: function () {}
	};
</script>
<style>
	@import './header.css';
</style>
