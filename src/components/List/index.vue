<template>
    <view :class="'ant-list ' + (className ? className : '') + ' ' + (radius ? 'ant-list-radius' : '')">
        <block v-if="header">
            <view class="ant-list-header">
                {{ header }}
            </view>
        </block>
        <block v-else>
            <view class="ant-list-header">
                <slot name="header" />
            </view>
        </block>
        <view class="ant-list-body">
            <slot />
        </view>
        <block v-if="footer">
            <view class="ant-list-footer">
                {{ footer }}
            </view>
        </block>
        <block v-else>
            <view class="ant-list-footer">
                <slot name="footer" />
            </view>
        </block>
    </view>
</template>

<script>
import { ListDefaultProps } from './props';
export default {
    data() {
        return {
            className: false,
            radius: false,
            header: '',
            footer: ''
        };
    },
    props: ListDefaultProps,
    methods: {},
    created: function () {}
};
</script>
<style>
@import './index.css';
</style>
