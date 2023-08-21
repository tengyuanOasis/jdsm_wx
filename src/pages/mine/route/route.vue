<!-- @format -->

<template>
	<view class="container">
		<view class="title">
			<text>物流信息</text>
		</view>
		<view class="content">
			<view class="express" v-if="routeList.length > 0">
				<view class="express-num">
					<text>快递类型：{{ expressCompany }}</text>
				</view>
				<view class="express-num">
					<text>快递单号：{{ expressNum }}</text>
				</view>
			</view>
			<view v-if="routeList.length > 0" class="main-container">
				<block v-for="(item, index) in routeList" :key="index">
					<view class="item">
						<view v-if="index == 0" style="height: 220%" class="item-one item-one1">
							<view>
								<image src="/static/images/e1.png"></image>
							</view>
						</view>
						<view v-else-if="index != routeList.length - 1" style="height: 150%" class="item-one">
							<view>
								<image src="/static/images/e2.png"></image>
							</view>
						</view>
						<view v-else-if="index == routeList.length - 1" style="height: 100%" class="item-one">
							<view>
								<image src="/static/images/e2.png"></image>
							</view>
						</view>
						<view v-if="index == 0" class="item-two item-two1">
							<view class="route-title">
								<text>{{ item.day }} {{ item.time }} {{ item.week }}</text>
							</view>
							<view class="route-content">
								<text>【{{ item.accept_address }}】 {{ item.remark }}</text>
							</view>
						</view>
						<view v-else class="item-two">
							<view class="route-title">
								<text>{{ item.day }} {{ item.time }} {{ item.week }}</text>
							</view>
							<view class="route-content">
								<text>【{{ item.accept_address }}】 {{ item.remark }}</text>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		<view style="height: 100rpx"></view>
		<view v-if="routeList.length <= 0">
			<text style="color: red; display: inline-block; margin-left: 40rpx">暂无相关物流信息！</text>
		</view>
	</view>
</template>

<script>
	import headerCmp from '@/components/header/header';
	import { tips } from '../../../utils/tips';
	import { commonDomain as domain } from '../../../constant/common';
	import { mine as route } from '../../../model/mine';
	const myRoute = new route();
	export default {
		components: {
			headerCmp
		},
		data() {
			return {
				domain: domain.apiHost,
				expressNum: '',

				//快递单号
				routeList: [],

				//物流数据
				userInfo: null,

				expressCompany: ''
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			if (wx.getStorageSync('phoneNumber') == null || wx.getStorageSync('phoneNumber') == '') {
				tips.ERROR_401('您还没有登录');
			}
			let _this = this;
			let expressNum = options.expressNum; //页面传递过来的快递单号
			let expressCompany = options.exprssCompany; //页面传递过来的快递公司
			let token = wx.getStorageSync('token'); //从缓存中获取token身份凭证
			let routeApi = '/order/logistics/sf'; //查询顺丰物流的api
			if (
				expressNum == null ||
				expressNum == '' ||
				expressCompany == '' ||
				expressCompany == null
			) {
				tips.ERROR_500('暂无网络！');
			} else if (token == null || token == '') {
				tips.ERROR_401('登录过期！');
			} else {
				if (expressCompany != '顺丰快递') {
					routeApi = '/order/logistics/ot'; //查询其它物流的快递api
				}
				myRoute.getRoute(routeApi, token, expressNum, function (res) {
					if (res.status == '200') {
						_this.setData({
							expressNum: expressNum,
							userInfo: wx.getStorageSync('userInfo')
						});
						_this.collectionData(res.data); //归纳这些路由数据
					} else {
						tips.MODAL('物流异常', res.msg);
					}
				});
			}
		},

		onShareAppMessage: function () {
			//自定义转发
			return {
				title: '尖端数码回收',
				path: 'pages/index/index',
				imageUrl: '/static/images/share_img.jpg'
			};
		},
		methods: {
			//归纳服务器返回的路由数据
			collectionData(data) {
				let mapList = new Map();
				let mapListArray = [];

				if (data.Head == 'OK') {
					for (let [index, value] of data.routeList.entries()) {
						let key = value.day + ',' + value.week;

						if (mapList.has(key)) {
							mapList.get(key).push({
								time: value.time,
								remark: value.remark
							});
						} else {
							let valueArray = [];
							valueArray.push({
								time: value.time,
								remark: value.remark
							});
							mapList.set(key, valueArray);
						}
					}

					for (let [K, V] of mapList.entries()) {
						mapListArray.push({
							key: K,
							value: V,
							length: V.length
						});
					}

					this.setData({
						routeList: mapListArray
					});
				} else {
					tips.ERROR_500('网络跑丢啦！#2');
				}
			}
		}
	};
</script>
<style>
	@import './route.css';
</style>
