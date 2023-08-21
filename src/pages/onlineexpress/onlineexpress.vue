<!-- @format -->

<template>
	<view style="height: 100%">
		<view class="content container-online-send">
			<container title="订单信息">
				<view
					slot="headerRight"
					:data-order="orderInfo"
					class="order-button-detail button-view"
					@click="toOrderDetail"
				>
					查看详情
				</view>
				<view class="order-has">
					<view class="order-title">
						<view class="order-number">
							<text>订单号：</text>
							<text class="text-number">{{ orderInfo.order_number }}</text>
						</view>
					</view>
					<view class="order-main">
						<!-- 机器图片 -->
						<image :src="domain + orderInfo.img" class="spu-avatar" />
						<!-- 机器简介 -->
						<view class="version-intro">
							<view class="version-title">{{ orderInfo.version_name }}</view>
							<view v-if="orderInfo.secondary_recycle != 0" class="order-other">
								<text class="order-other-3">二次报价：</text>
								<text class="order-other-2">￥</text>
								<text class="order-other-1">{{ orderInfo.secondary_recycle }}.00</text>
							</view>
							<view v-else class="order-other">
								<text class="order-other-3">回收价：</text>
								<text class="order-other-2">￥</text>
								<text class="order-other-1">{{ orderInfo.recycle_money }}.00</text>
							</view>
						</view>
					</view>
				</view>
			</container>

			<container title="回收方式">
				<view class="rec-progress-tabs">
					<fui-tabs
						center
						selectedColor="#000"
						sliderBackground="#ea3323"
						:tabs="recTabs"
						:current="recTabIdx"
						@change="onTabChange"
					/>

					<view class="rec-progress-detail">
						<view class="rec-type-direction">
							{{ recTabs[recTabIdx].direction }}
						</view>
						<image
							class="rec-type-content"
							mode="widthFix"
							:src="`/static/images/rec-progress-${recTabIdx + 1}.png`"
						/>
						<view class="rec-type-process">
							<view
								class="process-item"
								v-for="(item, index) in recTabs[recTabIdx].process"
								:key="index"
							>
								{{ item }}
							</view>
						</view>
					</view>
				</view>

				<view class="form-info">
					<view class="form-item j-contact">
						<text space="ensp" class="form-item-title">联系人：</text>
						<input
							type="text"
							class="form-item-value"
							placeholder="输入联系人"
							v-model="j_contact"
						/>
					</view>
					<view class="form-item j-phone">
						<text space="ensp" class="form-item-title">手机号码：</text>
						<input type="text" name="j_phone" class="form-item-value" v-model="phoneNumber" />
					</view>
					<view class="form-item j-province-city-county">
						<text space="ensp" class="form-item-title">
							{{ recTabIdx === 0 ? '所在地区：' : '上门地址：' }}
						</text>
						<button class="form-item-value" @click="regionPicker">
							{{ choseProvince + '-' + choseCity + '-' + choseCounty }}
							<uni-icons type="compose" size="16" />
						</button>
					</view>
					<view class="form-item j-address">
						<text space="ensp" class="form-item-title">详细地址：</text>
						<input
							type="text"
							v-model="j_address"
							class="form-item-value"
							placeholder="输入你所在的详细地址"
						/>
					</view>
					<view class="form-item sendstarttime">
						<text space="ensp" class="form-item-title">取件时间：</text>
						<picker
							mode="multiSelector"
							v-model="dateTime"
							@change="changeDateTime"
							@columnChange="changeDateTimeColumn"
							:range="dateTimeArray"
						>
							<view class="form-item-value date-picker">
								{{ dateTimeArray[0][dateTime[0]] }}-{{ dateTimeArray[1][dateTime[1]] }}-{{
									dateTimeArray[2][dateTime[2]]
								}}
								{{ dateTimeArray[3][dateTime[3]] }}:{{ dateTimeArray[4][dateTime[4]] }}:00
							</view>
						</picker>
					</view>
					<view class="remark">
						<text space="ensp" class="remark-title">备注信息（非必填）：</text>
						<textarea v-model="remark" class="remark-value" maxlength="50" />
					</view>
				</view>

				<!-- 提示部分 -->
				<view class="note">
					<text>
						注意：此处填写的地址为您自己的取件地址，快递员会前往该地址收取机器，而并非您需要寄送目的地；
					</text>
				</view>
				<button :plain="true" class="yuyue-btn" @click="formSubmit">立即预约</button>
				<view
					data-url="pages/sellerexpress/sellerexpress"
					:data-order="orderInfo"
					class="sellerexpress"
					@click="toSellerexpress"
				>
					我要自行邮寄
				</view>
			</container>
			<view style="height: 200rpx; opacity: 0.001">占位</view>
		</view>

		<my-time-picker
			:visible.sync="timePickerVisible"
			:selectedDateProp.sync="selectedDate"
			:selectedTimeProp.sync="selectedTime"
		/>
		<my-drag-service />
	</view>
</template>
<script module="tool" src="./tool.sjs" lang="sjs"></script>
<script>
	import { tips } from '../../utils/tips';
	import { commonDomain as domain } from '../../constant/common';
	import { dateTimePicker, getMonthDay, getMaxMonthDay, getNewDateArry } from '../../utils/util';
	export default {
		components: {},
		data() {
			return {
				domain: domain.apiHost,
				timePickerVisible: false,
				selectedDate: {},
				selectedTime: null,
				recTabIdx: 0,
				recTabs: [
					{
						name: `邮寄回收`,
						direction: `上门取件，顺丰包邮`,
						process: ['在线估价', '上门取件', '专业质检', '极速打款']
					},
					{
						name: `上门回收`,
						direction: `上门回收，当面打款`,
						process: ['线上下单', '工程师上门', '当面验机', '立即收钱']
					}
				],

				paramData: null,
				userInfo: {},

				//用户信息
				orderInfo: null,

				//上一个页面传递过来的订单信息
				region: [],

				dateTimeArray: null,
				dateTime: null,
				orderDate: null,

				//下单时间
				failDate: null,

				failDate1: null,

				//订单失效时间
				startYear: null,

				//开始的年份
				endYear: null,

				//结束的年份
				startMonth: null,

				endMonth: null,
				startDay: null,

				//开始的时间
				endDay: null,

				//结束的时间
				flagYear: null,

				//设置一个变量标记上一次选择的年份，以此来判断是否需要重新初始化月份信息
				userChoseTime: null,
				addressDetail: {},
				//用户选择的时间
				choseProvince: '省',
				//用户选的省
				choseCity: '市',
				//用户选的市
				choseCounty: '区',
				//用户选的区
				phoneNumber: '',
				direction: '',
				process: [],
				j_contact: '',
				phoneNumber: '',
				j_address: '',
				remark: ''
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function (options) {
			this.initData(options);
			this.createDateTimeArray();
			this.setUserChoseTime();
			this.setData({
				phoneNumber: uni.getStorageSync('phoneNumber')
			});
		},

		methods: {
			setUserChoseTime() {
				const dateTimeArray = this.dateTimeArray;
				const dateTime = this.dateTime;
				this.userChoseTime = `${dateTimeArray[0][dateTime[0]]}-${dateTimeArray[1][dateTime[1]]}-${
					dateTimeArray[2][dateTime[2]]
				} ${dateTimeArray[3][dateTime[3]]}:${dateTimeArray[4][dateTime[4]]}:00`;
			},
			getNextDateEx: function (date, day) {
				var dd = new Date(date);
				dd.setDate(dd.getDate() + day);
				var y = dd.getFullYear();
				if (dd.getMonth() + 1 < 10) {
					var m = '0' + (dd.getMonth() + 1);
				} else {
					var m = dd.getMonth() + 1;
				}
				if (dd.getDate() < 10) {
					var d = '0' + dd.getDate();
				} else {
					var d = dd.getDate();
				}
				return y + '-' + m + '-' + d;
			},

			toOrderDetail: function (e) {
				let data = JSON.stringify(e.target.dataset.order);
				data = encodeURIComponent(data);
				uni.navigateTo({
					url: '/pages/orderdetails/orderdetail?order=' + data
				});
			},

			changeDateTime(e) {
				this.dateTime = e.detail.value;
				this.setUserChoseTime();
			},
			changeDateTimeColumn(e) {
				var _this = this;
				var arr = this.data.dateTime,
					dateArr = this.data.dateTimeArray;

				arr[e.detail.column] = e.detail.value;

				var startMonth = _this.startMonth;
				var endMonth = _this.endMonth;
				var currYear = dateArr[0][arr[0]]; //获取到当前选中的年份
				var obj = null;
				//如果选择的年份不一样，那么就重新初始化月份信息
				if (currYear != _this.flagYear) {
					if (currYear != _this.startYear) {
						var endTime =
							_this.failDate.getFullYear() +
							'-' +
							_this.withData(_this.failDate.getMonth() + 1) +
							'-' +
							_this.withData(_this.failDate.getDate()) +
							' ' +
							_this.withData(_this.failDate.getHours()) +
							':' +
							_this.withData(_this.failDate.getMinutes()) +
							':00';
						obj = dateTimePicker(_this.startYear, _this.endYear, 1, 1, 1, _this.endDay, endTime); //如果是跨年份的话就设置为下一年的1月份,并且需要传递当前的默认显示时间
					} else {
						var beginTime =
							_this.orderDate.getFullYear() +
							'-' +
							_this.withData(_this.orderDate.getMonth() + 1) +
							'-' +
							_this.withData(_this.orderDate.getDate()) +
							' ' +
							_this.withData(_this.orderDate.getHours()) +
							':' +
							_this.withData(_this.orderDate.getMinutes()) +
							':00';

						obj = dateTimePicker(
							_this.startYear,
							_this.endYear,
							12,
							12,
							_this.startDay,
							31,
							beginTime
						); //如果是跨年份的话就设置为下一年的1月份,并且需要传递当前的显示时间信息
					}
					// 精确到分的处理，将数组的秒去掉
					var lastArray = obj.dateTimeArray.pop();
					var lastTime = obj.dateTime.pop();
					_this.setData({
						dateTimeArray: obj.dateTimeArray,
						dateTime: obj.dateTime,
						flagYear: currYear
					});
					return;
				}
				if (startMonth != endMonth) {
					var maxDay = getMaxMonthDay(dateArr[0][arr[0]], startMonth);
					if (maxDay == 0) {
						tips.ERROR_500();
						return;
					}
					if (dateArr[1][arr[1]] == (startMonth < 10 ? '0' + startMonth : '' + startMonth)) {
						dateArr[2] = getMonthDay(
							dateArr[0][arr[0]],
							dateArr[1][arr[1]],
							_this.startDay,
							maxDay
						);
					} else {
						dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]], 1, _this.endDay);
					}
				} else {
					dateArr[2] = getMonthDay(
						dateArr[0][arr[0]],
						dateArr[1][arr[1]],
						_this.startDay,
						_this.endDay
					);
				}
				this.setData({
					dateTimeArray: dateArr,
					dateTime: arr
				});
			},
			initData() {
				const paramData = uni.getStorageSync('orderDetail') || '{}';
				let orderStr = paramData.orders; //获得单条订单信息
				let order_time = paramData.seller_time.replace(/-/g, '/');
				if (order_time == null || order_time == undefined) {
					tips.ERROR_500();
					return;
				}
				let orderDate = new Date(order_time); //3天后的时间为
				let failDate = new Date(order_time);
				failDate.setDate(orderDate.getDate() + 2);
				let failDate1 = new Date(order_time);
				failDate1.setDate(orderDate.getDate() + 2);
				let phoneNumber = uni.getStorageSync('phoneNumber'); //从缓存中获取用户的信息
				if (phoneNumber == null) {
					tips.ERROR_401();
					return;
				}
				this.setData({
					orderInfo: paramData,
					orderDate: orderDate,
					failDate: failDate,
					failDate1: failDate1,
					startYear: orderDate.getFullYear(),
					//开始的年份
					endYear: failDate.getFullYear(),
					//结束的年份
					startMonth: orderDate.getMonth() + 1,
					//开始月份
					endMonth: failDate.getMonth() + 1,
					//结束月份
					startDay: orderDate.getDate(),
					//开始的时间
					endDay: failDate.getDate(),
					//结束的时间
					flagYear: new Date().getFullYear() //默认为当前所在年份
				});
			},
			createDateTimeArray() {
				//初始化时间的时候需要考虑到天数跨月不一样的情况
				var startMonth = this.startMonth;
				var endMonth = this.endMonth;
				var obj = null;
				if (startMonth != endMonth) {
					//获取下单时间的月份最大天数
					var maxDay = getMaxMonthDay(this.startYear, startMonth);
					if (maxDay == 0) {
						tips.ERROR_500();
						return;
					}
					//需要判断是否年份相同
					if (this.startYear != this.endYear) {
						//获取当前所在时间的年份信息
						let nowYear = new Date().getFullYear();
						//如果当前时间和开始年份不相等，那么默认就初始化下一年的数据
						if (nowYear != this.startYear) {
							// 获取完整的年月日 时分秒，以及默认显示的数组
							obj = dateTimePicker(this.startYear, this.endYear, 1, 1, 1, this.endDay);
						} else {
							// 获取完整的年月日 时分秒，以及默认显示的数组
							obj = dateTimePicker(this.startYear, this.endYear, 12, 12, this.startDay, maxDay);
						}
					} else {
						//如果年份相同月份不同默认先初始化开始月的数据
						//判断当前月份是否可开始月份相同
						let nowMonth = new Date().getMonth() + 1;
						if (nowMonth == this.startMonth) {
							obj = dateTimePicker(
								this.startYear,
								this.endYear,
								startMonth,
								endMonth,
								this.startDay,
								maxDay
							);
						} else {
							obj = dateTimePicker(
								this.startYear,
								this.endYear,
								startMonth,
								endMonth,
								1,
								this.endDay
							);
						}
					}
				} else {
					obj = dateTimePicker(
						this.startYear,
						this.endYear,
						startMonth,
						endMonth,
						this.startDay,
						this.endDay
					);
				}
				// 精确到分的处理，将数组的秒去掉
				var lastArray = obj.dateTimeArray.pop();
				var lastTime = obj.dateTime.pop();

				console.log('obj.dateTime: ', obj.dateTime);
				this.setData({
					dateTimeArray: obj.dateTimeArray,
					dateTime: [0, 0, 1, 0, 0]
				});
			},
			regionPicker() {
				uni.chooseAddress({
					success: (res) => {
						this.addressDetail = res;
						this.choseProvince = res.provinceName;
						this.choseCity = res.cityName;
						this.choseCounty = res.countyName;
						this.j_address = res.detailInfo;
					},
					fail: (err) => {
						console.log('err: ', err);
						this.addressDetail = {};
					}
				});
			},

			onTabChange: function (current) {
				this.setData({
					recTabIdx: current.index
				});
			},

			//表单提交事件
			formSubmit(e) {
				let _this = this;
				/**对数据进行校验 */

				if (this.j_contact == null || this.j_contact == '') {
					uni.showToast({
						title: '请填写联系人'
					});
					return;
				}
				if (!/^[\u4e00-\u9fa5]+$/.test(this.j_contact)) {
					uni.showToast({
						title: '联系人为中文'
					});
					return;
				}
				if (this.j_contact.length > 10) {
					uni.showToast({
						title: '名字长度小于10'
					});
					return;
				}
				if (this.choseProvince == '省') {
					uni.showToast({
						title: '请选择省市区'
					});
					return;
				}
				if (this.j_address == null || this.j_address == '') {
					uni.showToast({
						title: '请填写详细地址'
					});
					return;
				}
				if (this.userChoseTime == null || this.userChoseTime == '') {
					uni.showToast({
						title: '请选择预约时间'
					});
					return;
				}
				if (this.remark != null && this.remark.length > 50) {
					uni.showToast({
						title: '备注小于50个字'
					});
					return;
				} //获取当前时间到分

				let nowDate = new Date();

				let minuteTimeNow =
					nowDate.getFullYear() +
					'/' +
					(nowDate.getMonth() + 1) +
					'/' +
					nowDate.getDate() +
					' ' +
					nowDate.getHours() +
					':' +
					nowDate.getMinutes() +
					':00';

				let dayTimenow =
					nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate(); //取出时间到天

				if (new Date(this.userChoseTime.replace(/-/g, '/')) < new Date(minuteTimeNow)) {
					tips.MODAL('错误提示', '预约的时间必须大于当前时间');
					return;
				}
				if (new Date(this.userChoseTime.replace(/-/g, '/')) > this.failDate1) {
					tips.MODAL('错误提示', '订单有效期至：' + this.failDate1.toLocaleString());
					return;
				}
				//按格式组合多个订单号
				let orderNumbers = this.orderInfo.order_number;
				let data = {
					order_numbers: orderNumbers,
					j_contact: this.j_contact,
					//必填
					//j_contact: '15084422026', //必填
					//必填
					j_province: this.choseProvince,
					//必填
					j_city: this.choseCity,
					//必填
					j_county: this.choseCounty,
					//必填
					j_address: this.j_address,
					//必填
					sendstarttime: this.userChoseTime,
					//必填【yyyy-MM-dd HH:mm:ss】格式，预约时间段为预约时间段为9：00-18：00！
					remark: this.remark,
					//非必填（长度小于50）
					token: uni.getStorageSync('token'),
					//必填
					company: 'jd',
					rec_type: this.recTabIdx + 1
				};

				tips.LOADING('订单处理中...');
				wx.request({
					url: `${this.domain}/place/order/onlineOrder`,
					method: 'POST',
					data: data,
					dataType: 'json',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: function (res) {
						console.log('res: ', res);
						wx.hideLoading();
						if (res.statusCode == 200) {
							if (res.data.status == 200) {
								//总数量减去失败数量
								let sucessCount = _this.orderInfo.length - res.data.data.length;
								uni.showModal({
									title: '预约结果',
									showCancel: false,
									content: `预约成功`,
									success(res) {
										if (res.confirm) {
											wx.switchTab({
												url: '/pages/mine/user'
											});
										} else if (res.cancel) {
											wx.switchTab({
												url: '/pages/mine/user'
											});
										}
									}
								});
							} else {
								tips.MODAL('预约失败', res.data.msg);
							}
						} else {
							tips.ERROR_500();
						}
					},
					fail: function (err) {
						console.log('err: ', err);
						tips.ERROR_500();
					},
					complete: function () {
						uni.hideLoading();
					}
				});
			},

			toSellerexpress: function (e) {
				uni.navigateTo({
					url: '/pages/sellerexpress/sellerexpress'
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import './onlineexpress.scss';
</style>
