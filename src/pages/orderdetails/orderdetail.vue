<!-- @format -->

<template>
	<view class="page">
		<container title="机器信息">
			<view class="order-main">
				<!-- 机器图片 -->
				<image :src="domain + order.img" class="spu-avatar"></image>
				<!-- 机器简介 -->
				<view class="version-intro">
					<view class="version-title">{{ order.version_name }}</view>
					<view v-if="order.secondary_recycle != 0" class="order-other">
						<text class="order-other-3">二次报价：</text>
						<text class="order-other-2">￥</text>
						<text class="order-other-1">{{ order.secondary_recycle }}.00</text>
					</view>
					<view v-else class="order-other">
						<text class="order-other-3">回收价：</text>
						<text class="order-other-2">￥</text>
						<text class="order-other-1">{{ order.recycle_money }}.00</text>
					</view>
				</view>
			</view>
		</container>

		<container class="order-detail" title="联系信息">
			<view class="order-detail-item">
				<text class="order-detail-item-title">订单编号：</text>
				<text>{{ order.order_number }}</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">机器型号：</text>
				<text>{{ order.version_name }}</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">订单状态：</text>
				<text v-if="order.order_status == 'waitdelivery'" class="order-status">等待发货</text>
				<text v-else-if="order.order_status == 'cancel'" class="order-status">已取消</text>
				<text v-else-if="order.order_status == 'delivered'" class="order-status">已发货</text>
				<text v-else-if="order.order_status == 'Receiving'" class="order-status">
					已收货，正在验机
				</text>
				<text v-else-if="order.order_status == 'check'" class="order-status">已收货，正在验机</text>
				<text v-else-if="order.order_status == 'remit'" class="order-status">等待打款</text>
				<text v-else-if="order.order_status == 'successfully'" class="order-status">交易成功</text>
				<text v-else-if="order.order_status == 'waitdoor'" class="order-status">待上门</text>
				<text v-else-if="order.order_status == 'dooring'" class="order-status">上门中</text>
				<text v-else class="order-status">交易失败</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">下单时间：</text>
				<text>{{ order.seller_time }}</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">系统估价：</text>
				<text>￥{{ order.recycle_money }}.00</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">活动加价:</text>
				<text>￥{{ order.markup_money }}.00</text>
			</view>
			<view v-if="order.secondary_recycle != 0" class="order-detail-item">
				<text class="order-detail-item-title">二次报价：</text>
				<text>￥{{ order.secondary_recycle }}.00</text>
			</view>
			<view v-if="order.secondary_recycle != 0" class="order-detail-item">
				<text class="order-detail-item-title">报价备注：</text>
				<text>{{ order.price_change_remark }}</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">收款方式：</text>
				<text>{{ order.money_account_type || '支付宝' }}</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">收款账户：</text>
				<text>{{ order.collect_money_account }}</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">收款姓名：</text>
				<text>{{ order.collect_money_account_name }}</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">机器来源：</text>
				<text>{{ source }}</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">机器IMEI：</text>
				<text v-if="order.imei">{{ order.imei }}</text>
				<text v-else>无</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">用户备注：</text>
				<text v-if="order.remark">{{ order.remark }}</text>
				<text v-else>无</text>
			</view>
			<navigator
				:url="
					'/pages/mine/route/route?expressNum=' +
					order.express_number +
					'&exprssCompany=' +
					order.expree_company
				"
				hover-class="none"
				class="order-detail-item"
			>
				<text class="order-detail-item-title">物流信息：</text>
				<text>{{ order.expree_company }}-{{ order.express_number }}</text>
				<text style="color: red">(点击查看物流)</text>
			</navigator>
		</container>
		<!-- 机器详情 -->

		<container class="spu-detail" title="机器信息">
			<view class="order-detail version-detail">
				<view class="order-detail-item" v-for="(it, index) in order.phone_info" :key="index">
					<text class="order-detail-item-title">{{ it.feature_name }}：</text>

					<text>{{ it.option_name }}</text>
				</view>
			</view>
		</container>

		<view class="report-btn">
			<button
				@click="toTestReport"
				:data-imei="order.imei"
				:data-myorderid="order.myorder_id"
				:data-name="order.version_name"
			>
				查看验机报告
			</button>
		</view>
	</view>
</template>

<script>
	import { commonDomain as domain } from '../../constant/common';
	// pages/mine/orderdetails/orderdetail.js
	export default {
		data() {
			return {
				order: [],
				domain: domain.apiHost,

				it: {
					feature_name: '',
					option_name: ''
				}
			};
		},
		computed: {
			source() {
				const orderSource = this.order.source;
				const map = {
					0: '自己购买',
					1: '活动获得',
					2: '他人赠送'
				};
				return /^[\u4e00-\u9fa5]$/.test(orderSource) ? orderSource : map[orderSource];
			}
		},
		onLoad: function () {
			this.order = uni.getStorageSync('orderDetail');
		},
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function () {},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function () {},
		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function () {},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function () {},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function () {
			//完成后关闭刷新
			uni.stopPullDownRefresh();
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {},
		methods: {
			toTestReport() {
				uni.navigateTo({
					url: '/pages/testReport/testReport'
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import './orderdetail.scss';
</style>
