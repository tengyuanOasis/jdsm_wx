<!-- @format -->

<template>
	<uni-popup
		mask-background-color="rgba(0, 0, 0, .8)"
		ref="datePickerPop"
		type="bottom"
		background-color="#fff"
		:is-mask-click="false"
		:safe-area="true"
	>
		<view class="date_pop">
			<view class="popup-header">
				<view class="pop-title">请选择取件时间</view>
				<view
					class="pop-close"
					@click="handleClose('datePop')"
				>
					<uni-icons
						type="closeempty"
						size="20"
					/>
				</view>
			</view>

			<view class="popup-content">
				<!-- 日期 -->
				<view class="date_box">
					<view
						v-for="(date, index) in effectRecentDate"
						:key="date.date_zh"
						:class="[`date_item`, selectedDate.date_zh == date.date_zh ? `date_active` : ``]"
						@click="timeSelect('date', index, date)"
					>
						{{ date.date_zh }}
					</view>
				</view>

				<!-- 时间 -->
				<scroll-view
					class="time_box"
					scroll-y
					scroll-with-animation
					:scroll-into-view="scrollIntoViewId"
				>
					<view
						v-for="(time, index) in effectAppointmentTime"
						:id="`time_${index}`"
						:key="index"
						:class="{
							time_item: true,
							time_active: selectedTime === time
						}"
						@click="timeSelect('time', index)"
					>
						{{ time }}
						<view
							class="time_active_icon"
							v-if="selectedTime === time"
						>
							<uni-icons
								type="checkmarkempty"
								size="14"
								color="red"
							/>
						</view>
					</view>
				</scroll-view>
			</view>

			<view
				class="popup-footer"
				v-if="showFooter"
			>
				<view
					class="footer-btn close"
					@click="handleClose"
					>取消</view
				>
				<view
					class="footer-btn submit btn-red"
					@click="submit"
					>提交</view
				>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	/**
	 * @props
	 * 		visible : 用于控制弹窗显隐
	 * 		showFooter : 是否显示底部按钮
	 * 		selectedDateProp : 默认选中日期
	 * 		selectedTimeProp : 默认选中时间
	 * 		timeConfig : 选择器基本配置
	 * 		autoClose : 选择时间后是否自动关闭
	 * @methods
	 * 		selectTime: return function(){return {date , time}}
	 * 		handleSubmit: 点击footer 提交的回调
	 * 	  handleCancel: 点击footer 取消的回调
	 */
	import dayjs from '@/utils/dayjs.min.js';
	// import cloneDeep from 'lodash/cloneDeep';
	export default {
		name: 'TimePicker',
		props: {
			visible: {
				required: true,
				default: false
			},
			showFooter: {
				required: false,
				default: false
			},
			autoClose: {
				required: false,
				default: true
			},
			selectedDateProp: {
				required: true,
				type: Object,
				default: {}
			},
			selectedTimeProp: {
				required: true,
				type: String,
				default: ''
			},
			timeConfig: {
				required: true,
				type: Object,
				default: () => {
					return {
						startTime: '9:00',
						endTime: '20:00',
						timeAdvance: 60
					};
				}
			}
		},
		computed: {
			scrollIntoViewId() {
				return `time_${this.selectedTimeIdx}`;
			}
		},
		watch: {
			async timeConfig(newVal, oldVal) {
				const { startTime, endTime, timeAdvance, showRightNow } = newVal;

				const {
					startTime: oldStartTime,
					endTime: oldEndTime,
					timeAdvance: oldTimeAdvance,
					showRightNow: oldShowRightNow
				} = oldVal;

				if (
					startTime !== oldStartTime ||
					endTime !== oldEndTime ||
					timeAdvance !== oldTimeAdvance ||
					showRightNow !== oldShowRightNow
				) {
					this.setRecentData();
					await this.loadReservationTime();
					await this.setSelectDate();
				}
			},
			visible: {
				handler: function (newVal) {
					if (newVal) {
						this.setEffectAppointmentTime();
						this.setEffectRecentDate();
						this.$refs.datePickerPop.open();
					} else {
						this.$refs.datePickerPop.close();
					}
				}
			}
		},

		data() {
			// 生成取件日期
			const defaultTimeList = [
				'08:00',
				'09:00',
				'10:00',
				'11:00',
				'12:00',
				'13:00',
				'14:00',
				'15:00',
				'16:00',
				'17:00',
				'18:00',
				'19:00'
			];

			return {
				timePickerConfig: {
					dayCount: 3,
					/** 默认时间列表起始结束时间 */
					timeListStartHour: 9,
					timeListEndHour: 20,
					delayMinutes: 60,
					showRightNow: false
				},
				currentDate: dayjs().format('YYYY/MM/DD'),
				selectedTime: '',
				selectedTimeIdx: 0,
				defaultTimeList,
				selectedDate: {},
				recentDateList: [],
				effectRecentDate: [],
				effectAppointmentTime: [],
				appointment: []
			};
		},
		created() {
			this.setRecentData();
			this.loadReservationTime();
			this.setSelectDate();
		},
		methods: {
			// 自动选中时间
			async setSelectDate() {
				await this.setEffectAppointmentTime();
				await this.setEffectRecentDate();
				setTimeout(() => {
					if (!this.selectedDate.date_zh) {
						this.selectedDate = this.effectRecentDate[0];
					}
					this.selectedTime = this.effectAppointmentTime[0];
					this.selectedDate = this.effectRecentDate[0];
					this.$emit('update:selectedDateProp', this.effectRecentDate[0]);
					this.$emit('update:selectedTimeProp', this.effectAppointmentTime[0]);
				}, 1000);
			},
			submit() {
				this.$emit('update:visible', false);
				this.$emit('handleSubmit', this.selectedDate, this.selectedTime);
			},
			handleClose() {
				this.$emit('update:visible', false);
				this.$emit('handleCancel', this.selectedDate, this.selectedTime);
			},
			loadReservationTime() {
				const conf = this.timeConfig;
				if (!Object.keys(conf).length) return this.timePickerConfig;
				const newConfig = Object.assign(this.timePickerConfig, {
					timeListStartHour: Number(conf?.startTime?.replace(':00', '')),
					timeListEndHour: Number(conf?.endTime?.replace(':00', '')),
					delayMinutes: conf?.timeAdvance,
					showRightNow: conf.showRightNow
				});
				this.timePickerConfig = newConfig;
				this.createTimeList();
			},
			createTimeList() {
				const { timeListStartHour, timeListEndHour } = this.timePickerConfig;
				const createList = (item) => {
					let hour = Number(item.slice(0, 2));
					if (hour >= timeListStartHour && hour < timeListEndHour) {
						return item;
					}
				};
				const setEffectList = (val) => val;
				const timeList = this.defaultTimeList.map(createList).filter(setEffectList);
				this.effectAppointmentTime = timeList;
				this.appointment = timeList;
			},
			timeSelect(type, index, date) {
				if (type === 'time') {
					this.selectedTimeIdx = index;
					this.timeChange(this.effectAppointmentTime[index], `time`);
				} else {
					this.timeChange(date, 'date');
					this.selectedTimeIdx = 0;
				}
			},
			/**
			 * @description: 时间选择器修改函数
			 * @param {date} : 选择的日期或时间
			 * @return {type} : 选择的类型, date or time
			 */

			timeChange(date, type) {
				const dateList = this.recentDateList;
				if (type === 'date') {
					// 选择日期
					this.selectedDate = date;
					this.selectedTime = '';
					this.setEffectAppointmentTime();
				} else {
					// 选择时间
					if (this.selectedDate.date_zh == '') {
						this.selectedDate = dateList[0];
					}
					this.selectedTime = date;
					// 自动关闭弹窗
					if (this.autoClose) {
						this.handleClose();
					}
				}
				this.$emit('update:selectedDateProp', this.selectedDate);
				this.$emit('update:selectedTimeProp', this.selectedTime);
				this.$emit('selectTime', this.selectedDate, this.selectedTime);
			},
			// 有效日期
			setEffectRecentDate() {
				if (this.effectAppointmentTime.length > 0) {
					this.effectRecentDate = JSON.parse(JSON.stringify(this.recentDateList));
					return;
				}

				let list = this.recentDateList;

				list.splice(0, 1);
				// 当日取件时间全部失效
				this.effectRecentDate = list;

				this.selectedDate = this.recentDateList[0];

				this.setEffectAppointmentTime();
			},
			// 有效取件时间
			setEffectAppointmentTime() {
				const appointment = this.appointment;

				// 未来日期返回全部
				if (this.selectedDate.date_en != this.currentDate) {
					this.effectAppointmentTime = appointment;
					return;
				}

				// 当日
				let list = appointment.filter((item) => this.checkRemainingMinute(item) === 3);

				const { timeListStartHour, timeListEndHour, showRightNow = true } = this.timePickerConfig;

				// 当日只返回有效时间
				if (
					new Date().getHours() >= timeListStartHour &&
					new Date().getHours() < timeListEndHour - 1 &&
					showRightNow
				) {
					list.unshift('立即上门');
				}

				this.effectAppointmentTime = list;
			},
			// 生成时间选择器 最近n天的时间
			setRecentData(n = this.timePickerConfig.dayCount) {
				const oneDayTime = 60 * 1000 * 60 * 24;
				const today = +new Date();
				let list = [];
				for (let i = 0; i < n; i++) {
					let formatTime = this.formatTime_zh(today + oneDayTime * i);
					list.push({
						...formatTime,
						week: i == 0 ? '今天' : i == 1 ? '明天' : i == 2 ? '后天' : formatTime.week
					});
				}
				this.selectedDate = list[0];
				this.recentDateList = list;
			},
			// 时间处理函数
			formatTime_zh: (date) => {
				date = new Date(date);
				const year = date.getFullYear();
				const month = date.getMonth() + 1;
				const day = date.getDate();
				const weekDay = date.getDay();
				const formatNumber = (n) => {
					n = n.toString();
					return n[1] ? n : '0' + n;
				};
				const numToTxt = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
				return {
					date_zh: `${formatNumber(month)}月${formatNumber(day)}日`,
					date_en: `${year}/${formatNumber(month)}/${formatNumber(day)}`,
					week: numToTxt[weekDay]
				};
			},

			/**
			 * @return {Number} 1:已过期 , 2:即将过期 , 3:未过期
			 */
			checkRemainingMinute(time) {
				const delayMinutes = this.timePickerConfig?.delayMinutes ?? 60;
				if (!time) return;
				const outTime = time.toString().split('-')[0];
				const now = dayjs().valueOf();
				const dateTime = this.currentDate + ' ' + outTime;
				const check = dayjs(dateTime).valueOf();
				const difference = check - now;
				const minutes = difference / (1000 * 60);
				// minutes <= 0  : 已过期    --> 1
				// minutes <= 90 : 即将过期  --> 2
				// minutes >  0  : 未过期     --> 3
				return minutes <= 0 ? 1 : minutes <= delayMinutes ? 2 : 3;
			}
		}
	};
</script>

<style scoped lang="scss">
	.date_pop {
		padding: 0;
		width: 100%;
		min-height: 750rpx;

		.popup-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 60rpx 40rpx;
			position: relative;

			.pop-title {
				font-weight: bold;
				font-size: 32rpx;
				width: 90%;
			}
			.pop-close {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: bold;
				width: 50rpx;
				height: 50rpx;
			}
		}

		.popup-content {
			font-size: 28rpx;
			position: relative;
			height: 600rpx;
		}

		.date_box {
			position: absolute;
			top: 0;
			left: 0;
			width: 40%;
			height: 600rpx;
			background: #f7f7f9;
			.date_item {
				padding: 0 40rpx;
				line-height: 100rpx;
			}
			.date_active {
				background: #fff;
			}
		}

		.time_box {
			position: absolute;
			top: 0;
			right: 0;
			width: 60%;
			height: 600rpx;
			.disabled {
				color: #ccc;
				&::after {
					content: '已过期';
					margin-left: 130rpx;
				}
			}
			.outTime {
				color: #ccc;
				&::after {
					content: '即将过期';
					margin-left: 100rpx;
				}
			}
			.time_item {
				padding: 0 40rpx;
				line-height: 100rpx;
				height: 100rpx;
				position: relative;
			}
			.time_active {
				color: red;
				font-weight: bold;
				.time_active_icon {
					position: absolute;
					right: 15%;
					top: 0;
					bottom: 0;
					margin: auto 0;
					display: block;
				}
			}
		}

		.popup-footer {
			width: 100%;
			height: 90rpx;
			background-color: #fff;
			display: flex;
			// 上阴影
			box-shadow: 0 -10rpx 20rpx 0 rgba(0, 0, 0, 0.05);

			.footer-btn {
				flex: 1;
				text-align: center;
				height: 100%;
				// 字体居中
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 34rpx;
				font-weight: bold;
			}
			.close {
				color: #000;
				border-right: 1px solid #ccc;
			}
			.submit {
				text-align: center;
				background: linear-gradient(90deg, #ffa03b 0%, #ff3b21 100%);
				border-radius: 6rpx;
				color: #ffffff;
			}
		}
	}
</style>
