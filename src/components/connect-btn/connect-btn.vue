<template>
    <!-- 导航栏容器 -->
    <view :class="'data-v-2e82ef44' + ' ' + 'service' + ' ' + className">
        <view class="contactBtn data-v-2e82ef44">
            <contact-button :tnt-inst-id="servicesConfig.tntInstId" :scene="servicesConfig.scene" class="data-v-2e82ef44"></contact-button>
        </view>
    </view>
</template>

<script>
/** @format */
const config = require('../../constant/common');
export default {
    data() {
        return {
            servicesConfig: config.servicesConfig,
            className: ''
        };
    },
    props: {},
    didMount: function () {},
    methods: {},
    created: function () {}
};
</script>
<style lang="scss">
@import './connect-btn.scss';
</style>
