<!-- @format -->

<template>
	<view :class="['service', className]">
		<!-- #ifdef MP-ALIPAY -->
		<view class="contactBtn">
			<contact-button
				:tnt-inst-id="servicesConfig.tntInstId"
				:scene="servicesConfig.scene"
				size="55"
			/>
		</view>
		<!-- #endif -->

		<!-- #ifdef MP-WEIXIN -->
		<button
			class="contactBtn"
			open-type="contact"
		/>
		<!-- #endif -->
	</view>
</template>

<script>
	import { servicesConfig } from '@/constant/common';

	const app = getApp();

	export default {
		name: 'Service',
		props: {
			className: {
				required: false,
				type: String,
				default: ''
			}
		},
		data() {
			return { servicesConfig };
		},
		computed: {},
		methods: {}
	};
</script>

<style scoped lang="scss">
	.service {
		height: 100%;
		width: 100%;
		z-index: 100;
		position: absolute;
		left: 0;
		top: 0;
	}
	.contactBtn {
		height: 100%;
		width: 100%;
	}
</style>

<style>
	contact-button {
		position: absolute;
		z-index: 100;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		opacity: 0;
	}
</style>
