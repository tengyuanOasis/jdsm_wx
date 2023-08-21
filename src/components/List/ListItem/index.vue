<!-- @format -->

<template>
	<view
		:class="'ant-list-item  ' + (className ? className : '')"
		:style="style || ''"
		:onTap="onTap ? 'onTap' : ''"
		@Tap.stop.prevent="parseEventDynamicCode($event, catchTap ? 'catchTap' : '')"
		:hover-class="onTap || catchTap ? 'ant-list-item-hover' : ''"
		:hover-start-time="20"
		:hover-stay-time="40"
	>
		<view
			:class="
				'ant-list-item-line ' +
				(showDivider ? 'ant-list-item-line-divider' : '') +
				' ' +
				(disabled ? 'ant-list-item-line-disabled' : '')
			"
		>
			<view class="ant-list-item-image-container">
				<slot name="image">
					<image-icon
						v-if="image"
						:image="image"
						className="ant-list-item-image"
					/>
				</slot>
			</view>
			<view class="ant-list-item-content-container">
				<view class="ant-list-item-content-title-container">
					<slot name="title">
						<view
							v-if="title"
							class="ant-list-item-content-title"
						>
							{{ title }}
						</view>
					</slot>
				</view>
				<view class="ant-list-item-content-main">
					<slot />
				</view>
				<view class="ant-list-item-content-brief-container">
					<slot name="brief">
						<view
							v-if="brief"
							class="ant-list-item-content-brief"
						>
							{{ brief }}
						</view>
					</slot>
				</view>
			</view>
			<view class="ant-list-item-extra-container">
				<view class="ant-list-item-extra">
					<slot name="extra">
						{{ extra }}
					</slot>
				</view>
				<view class="ant-list-item-extra-brief">
					<slot name="extraBrief">
						{{ extraBrief }}
					</slot>
				</view>
			</view>
			<view class="ant-list-item-arrow">
				<i
					v-if="arrowUtil.getArrow(arrow)"
					:type="arrowUtil.getArrow(arrow)"
					size="x-small"
				/>
			</view>
		</view>
	</view>
</template>
<script module="arrowUtil" src="@/components/_util/arrow.sjs" lang="sjs"></script>
<script>
	// import icon from "../../Icon/index"; // PS: 此组件与全局组件重名，已注释（可能误判，请开发者根据实际情况处理）。
	import { ListItemDefaultProps } from './props';
	import fmtEvent from '../../_util/fmtEvent';
	export default {
		components: {},
		data() {
			return {
				className: false,
				style: '',
				onTap: false,
				catchTap: '',
				showDivider: false,
				disabled: false,
				image: '',
				title: '',
				brief: '',
				extra: '',
				extraBrief: ''
			};
		},
		props: ListItemDefaultProps,
		methods: {
			onTapFun: function (e) {
				if (this.props.disabled) {
					return;
				}
				var onTap = this.props.onTap;
				if (onTap) {
					var event_1 = fmtEvent(this.props, e);
					onTap(event_1);
				}
			},
			catchTapFun: function (e) {
				if (this.props.disabled) {
					return;
				}
				var catchTap = this.props.catchTap;
				if (catchTap) {
					var event_2 = fmtEvent(this.props, e);
					catchTap(event_2);
				}
			}
		},
		created: function () {}
	};
</script>
<style>
	@import './index.css';
</style>
