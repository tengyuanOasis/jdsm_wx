<template>
    <view style="text-align: center; background-color: white">
        <image style="margin-top: 100rpx; margin: 100rpx auto" mode="aspectFit" :src="url" />
    </view>
</template>

<script>
export default {
    data() {
        return {
            url: ''
        };
    },
    onLoad(options) {
        console.log(decodeURIComponent(options.url));
        this.setData({
            url: decodeURIComponent(options.url)
        });
    },
    methods: {}
};
</script>
<style></style>
