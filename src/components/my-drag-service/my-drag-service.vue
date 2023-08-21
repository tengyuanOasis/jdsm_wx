<!-- @format -->

<template>
	<my-drag-button
		:isDock="true"
		:existTabBar="true"
	>
		<view class="my-drag-service">
			<!-- <image
				class="icon"
				mode="scaleToFill"
				src="/static/images/chat.svg"
			/> -->
			<fui-icon
				name="message-fill"
				color="#4a5bf6"
			/>
			<my-service />
		</view>
	</my-drag-button>
</template>

<script>
	export default {
		name: 'Service'
	};
</script>
<style scoped lang="scss">
	.my-drag-service {
		.icon {
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>
