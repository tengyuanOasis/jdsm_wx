<template>
    <view :class="'ant-popup ' + (className || '')" :style="(zIndex ? `z-index:${zIndex}` : '') + ';' + (style || '')" v-if="!(!destroyOnClose && !visible && !closing)">
        <view
            v-if="showMask"
            :class="'ant-popup-mask ' + (maskClassName || '') + ' ' + (closing && !visible ? 'ant-popup-mask-closing' : '')"
            onTap="onTapMask"
            :style="(animation ? `-webkit-animation-duration:${duration}ms; animation-duration:${duration}ms;` : '') + ' ' + (maskStyle || '')"
        />
        <view
            :class="'ant-popup-content ant-popup-' + animationType + '-' + position + ' ' + (closing ? 'ant-popup-' + animationType + '-' + position + '-close' : '')"
            :style="getContentStyle(position, animation, duration, width, height)"
            onAnimationEnd="onAnimationEnd"
        >
            <slot />
            <slot v-if="isOldVersion" name="content" />
        </view>
    </view>
</template>
<script module="{getContentStyle}" src="@/components/Popup/index.sjs" lang="sjs"></script>
<script>
import { PopupDefaultProps } from './props';
import { compareVersion } from '../_util/compareVersion';
var SDKVersion = uni.SDKVersion;
var isOldVersion = compareVersion(SDKVersion, '2.0.0') < 0;
var component2 = uni.canIUse('component2');
export default {
    data() {
        return {
            closing: false,
            isOldVersion: isOldVersion,
            className: '',
            zIndex: false,
            style: '',
            destroyOnClose: '',
            visible: '',
            showMask: '',
            maskClassName: '',
            animation: false,
            maskStyle: '',
            animationType: '',
            position: ''
        };
    },
    props: PopupDefaultProps,
    didUpdate: function (prevProps) {
        if (component2) {
            return;
        }
        var _a = this.props;
        var visible = _a.visible;
        var duration = _a.duration;
        var animation = _a.animation;
        if (prevProps.visible && !visible) {
            if (animation && duration > 0) {
                this.setData({
                    closing: true
                });
            }
        }
    },
    deriveDataFromProps: function (nextProps) {
        var visible = nextProps.visible;
        var duration = nextProps.duration;
        var animation = nextProps.animation;
        if (this.props.visible && !visible) {
            if (animation && duration > 0) {
                this.setData({
                    closing: true
                });
            }
        }
    },
    methods: {
        onTapMask: function () {
            var closing = this.closing;
            if (closing) {
                return;
            }
            var onClose = this.props.onClose;
            if (onClose) {
                onClose();
            }
        },
        onAnimationEnd: function () {
            var closing = this.closing;
            if (closing) {
                this.setData({
                    closing: false
                });
            }
        }
    },
    created: function () {}
};
</script>
<style>
@import './index.css';
</style>
