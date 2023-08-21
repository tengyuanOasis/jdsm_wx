<template>
	<button
		v-if="!isLogin"
		class="authBtn"
		open-type="getPhoneNumber"
		button-hover-class="none"
		@getphonenumber="getPhoneNumber"
		@click="handleAuth"
	/>
</template>

<script>
	const app = getApp();
	import config from '@/config';
	import func from '@/common/js/utils';

	/**
	 * 授权按钮
	 * @props:{
	 *  :isLogin: 是否登录
	 * 	:source_page_title: 来源页面标题
	 * 	@authCb : 授权成功回调
	 * }
	 */
	export default {
		name: 'my-auth-button',
		props: {
			loading: {
				type: Boolean,
				required: false,
				default: false
			},
			isLogin: {
				type: Boolean,
				required: true,
				default: false
			},
			source_page_title: {
				type: String,
				required: true,
				default: ''
			}
		},
		data() {
			return {};
		},
		methods: {
			async getPhoneNumber(event) {
				console.log('event', event);
				try {
					this.$emit('update:visible', true);
					const bol = event.detail?.errMsg == 'getPhoneNumber:ok';
					const sensors_info = {
						$app_id: config.AppID,
						$app_name: config.AppName,
						source_page_title: this.source_page_title,
						authorize_type: '获取用户手机号',
						is_success: bol,
						// 格式化时间为 YYYY-MM-DD HH:mm:ss
						reg_time: func.formatTime(new Date().getTime())
					};
					// 「友回收」唤起授权上报
					this.$sensors.track('YYrecAuthorize', sensors_info);

					if (!bol) return console.log('取消授权');

					// #ifdef MP-ALIPAY
					event.detail = await app.getAliPayPhoneNumber();

					// #endif
					// 「友回收」同意授权上报
					this.$sensors.track('YYrecAuthorizeLog', sensors_info);

					const res = await app.register(event.detail);

					this.$emit('authCb', res);

					this.$emit('update:visible', false);
				} catch (error) {
					console.log('error: ', error);
				}
			},
			handleAuth() {
				// #ifdef H5
				if (!app.checkIsLogin()) {
					uni.navigateTo({
						url: '/pages_common/login/index'
					});
				}
				// #endif
			},
		}
	};
</script>

<style scoped lang="scss">
	.authBtn {
		position: absolute;
		z-index: 100;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		opacity: 0;
		width: 100%;
		height: 100%;
	}
</style>
