<!-- @format -->

<template>
	<view
		:class="
			'ant-container ' +
			(headerInBox ? 'ant-container-headerInBox' : 'ant-container-headerNotInBox') +
			' ' +
			(className ? className : '')
		"
		:style="style"
	>
		<view class="ant-container-header">
			<view class="ant-container-header-title">
				{{ title }}
			</view>
			<view class="ant-container-header-right">
				<slot name="headerRight" />
			</view>
		</view>
		<view class="ant-container-content">
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				className: false,
				style: ''
			};
		},
		props: {
			headerInBox: {
				type: Boolean,
				default: true
			},
			title: {
				type: String,
				default: ''
			}
		},
		didMount: function () {},
		methods: {},
		created: function () {}
	};
</script>
<style scoped lang="scss">
	/** @format */

	.ant-container {
		border-radius: 8px;
		margin-bottom: 12px;
	}
	.ant-container-headerInBox {
		background-color: #fff;
	}
	.ant-container-headerInBox .ant-container-header {
		padding: 0 12px;
	}
	.ant-container-headerInBox .ant-container-header .ant-container-header-right,
	.ant-container-headerInBox .ant-container-header .ant-container-header-title {
		position: relative;
	}
	.ant-container-headerInBox .ant-container-header .ant-container-header-right::after,
	.ant-container-headerInBox .ant-container-header .ant-container-header-title::after {
		content: '';
		position: absolute;
		background-color: #eee;
		display: block;
		top: auto;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		transform: scaleY(0.5);
	}
	.ant-container-content {
		padding: 12px;
		background-color: #fff;
		border-radius: 8px;
	}
	.ant-container-header {
		display: flex;
	}
	.ant-container-header-title {
		font-size: 16px;
		font-weight: 700;
		color: #333;
		display: flex;
		align-items: center;
		height: 48px;
		flex: 1;
	}
	.ant-container-header-title:empty {
		display: none;
	}
	.ant-container-header-right {
		color: #999;
		display: flex;
		align-items: center;
		height: 48px;
		justify-content: flex-end;
	}
	.ant-container-header-right:empty {
		display: none;
	}
	.ant-container-header
		.ant-container-header-title:empty
		+ .ant-container-header-right:not(:empty) {
		flex: 1;
	}
</style>
