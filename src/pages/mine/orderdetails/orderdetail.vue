<!-- @format -->

<template>
	<!-- pages/mine/orderdetails/orderdetail.axml -->
	<view
		class="container"
		style="background-color: #f7f6fb"
	>
		<!-- title -->
		<!-- <view class="header">
		{{order.version_name}}
  </view> -->
		<view class="title">
			<text>订单信息</text>
		</view>
		<!-- 订单详情 -->
		<view class="order-detail">
			<!-- 图 -->
			<!-- <view class="order-image">
      <image src="https://www.qupingce.com{{order.img}}" mode="widthFix"></image>
    </view> -->
			<!-- 标题 -->

			<view class="order-main">
				<!-- 机器图片 -->
				<image :src="domain + order.img"></image>
				<!-- 机器简介 -->
				<view class="version-intro">
					<view class="version-title">
						<text>{{ order.version_name }}</text>
					</view>
					<view class="version-deatil"></view>
					<view
						class="order-other"
						v-if="order.secondary_recycle != 0"
					>
						<text class="order-other-3">二次报价：</text>
						<text class="order-other-2">￥</text>
						<text class="order-other-1">{{ order.secondary_recycle }}.'00'</text>
					</view>
					<view
						class="order-other"
						v-else
					>
						<text class="order-other-3">回收价：</text>
						<text class="order-other-2">￥</text>
						<text class="order-other-1">{{ order.recycle_money }}.'00'</text>
					</view>
				</view>
			</view>

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
				<text
					class="order-status"
					v-if="order.order_status == 'waitdelivery'"
					>等待发货</text
				>
				<text
					class="order-status"
					v-else-if="order.order_status == 'cancel'"
					>已取消</text
				>
				<text
					class="order-status"
					v-else-if="order.order_status == 'delivered'"
					>已发货</text
				>
				<text
					class="order-status"
					v-else-if="order.order_status == 'Receiving'"
					>已收货，正在验机</text
				>
				<text
					class="order-status"
					v-else-if="order.order_status == 'check'"
					>已收货，正在验机</text
				>
				<text
					class="order-status"
					v-else-if="order.order_status == 'remit'"
					>等待打款</text
				>
				<text
					class="order-status"
					v-else-if="order.order_status == 'successfully'"
					>交易成功</text
				>
				<text
					class="order-status"
					v-else
					>交易失败</text
				>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">下单时间：</text>
				<text>{{ order.seller_time }}</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">系统估价：</text>
				<text>￥{{ order.recycle_money }}.'00'</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">活动加价:</text>
				<text>￥{{ order.markup_money }}.'00'</text>
			</view>
			<view
				class="order-detail-item"
				v-if="order.secondary_recycle != 0"
			>
				<text class="order-detail-item-title">二次报价：</text>
				<text>￥{{ order.secondary_recycle }}.'00'</text>
			</view>
			<view
				class="order-detail-item"
				v-if="order.secondary_recycle != 0"
			>
				<text class="order-detail-item-title">报价备注：</text>
				<text>{{ order.price_change_remark }}</text>
			</view>
			<view class="order-detail-item">
				<text class="order-detail-item-title">收款方式：</text>
				<text>{{ order.money_account_type }}</text>
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
				<text>{{ order.source }}</text>
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
				<text style="color: #4ba7ec">(点击查看物流)</text>
			</navigator>
		</view>
		<!-- 机器详情 -->

		<view
			class="title"
			style="margin-top: 50rpx"
		>
			<text>机器信息</text>
		</view>
		<view class="order-detail version-detail">
			<view
				class="order-detail-item"
				v-for="(it, index) in order.phone_info"
				:key="index"
			>
				<text class="order-detail-item-title">{{ it.feature_name }}：</text>

				<text>{{ it.option_name }}</text>
			</view>
		</view>
		<view class="report-btn">
			<button
				onTap="toTestReport"
				:data-imei="order.imei"
				:data-myorderid="order.myorder_id"
				:data-name="order.version_name"
			>
				查看验机报告
			</button>
		</view>
		<view style="height: 100rpx; background-color: #f7f6fb"></view>
	</view>
</template>

<script>
	import { commonDomain as domain } from '../../../constant/common';
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
		/**
		 * 生命周期函数--监听页面加载
		 */ onLoad: function (options) {
			//初始化订单数据
			var data = options.order;
			data = decodeURIComponent(data);
			var order = JSON.parse(data);
			console.log(order);
			this.setData({
				order: order
			});
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
			toTestReport: function (e) {
				uni.navigateTo({
					url:
						'/pages/testReport/testReport?myorder_id=' +
						e.target.dataset.myorderid +
						'&imei=' +
						e.target.dataset.imei +
						'&name=' +
						e.target.dataset.name
				});
			}
		}
	};
</script>
<style>
	@import './orderdetail.css';
</style>
