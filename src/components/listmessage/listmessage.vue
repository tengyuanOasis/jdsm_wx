<template>
    <!-- components/listmessage/listmessage.axml -->
    <!-- 列表数据组件 -->
    <view :class="containers">
        <view :class="tipclass"></view>
        <slot name="before"></slot>
        <view class="tg">
            <slot name="after"></slot>
        </view>
    </view>
</template>

<script>

// components/listmessage/listmessage.js
export default {
    data() {
        return {};
    },
    options: {
        multipleSlots: true
    },
    /**
     * 组件的属性列表
     */
    props: {
        tipclass: 'commontip',
        containers: 'container'
    },
    /**
     * 组件的方法列表
     */
    methods: {},
    created: function () {}
};
</script>
<style>
@import './listmessage.css';
</style>
