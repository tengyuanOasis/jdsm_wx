<!-- @format -->

<template>
	<view style="height: 100%">
		<view class="container">
			<view class="header-box">
				<view class="step">
					<view
						class="step-line-bg"
						:style="'width:' + stepPercent + '%;'"
					>
						<view
							class="step-text"
							style=""
							>当前进度{{ choseNum }}/{{ featureLength }}</view
						>
					</view>
				</view>
				<view class="productName">{{ product_title.product_name }}</view>
			</view>

			<scroll-view
				scroll-y
				:scroll-with-animation="false"
				:scroll-into-view="scrollInfoQIdx"
				class="info-list"
				:scroll-top="scrollTop"
			>
				<view
					:id="'question_' + q_idx"
					class="single-info"
					v-for="(q_info, q_idx) in objectToArray(features_optionsEx)"
					:key="q_idx"
				>
					<view class="title-line">
						<view class="count-title-left">
							<view class="feature-name">{{ q_idx + 1 }}、{{ q_info['name'] }}</view>
							<icon
								v-if="q_info['showIcon']"
								:data-info="{ ...q_info, showType: 'feature' }"
								type="QuestionCircleOutline"
								data-showtype="feature"
								@click="showExplain"
							/>
						</view>
					</view>

					<view class="feature-child-box">
						<view
							v-for="(a_info, a_idx) in q_info.children"
							:key="a_idx"
							:class="
								'feature-child  abc' +
								a_idx +
								' ' +
								(dataTemps[q_info.qid][a_idx][8] ? 'isConflict' : '') +
								' ' +
								(dataTemps[q_info.qid][a_idx][1] ? 'count-select' : '')
							"
							:data-price="a_info.price"
							:data-optionid="a_info.option_id"
							:data-optiontype="a_info.isSpecial"
							:data-isselect="isSelect"
							:data-position="abca_idx"
							:data-featuretype="q_info.selectType"
							:data-parentfeatureid="q_info.qid"
							:data-parentIdx="q_idx"
							:data-parentinfo="q_info"
							:data-answerinfo="a_info"
							@click="optionPressFun"
						>
							{{ a_info.name }}

							<icon
								v-if="a_info['hasDetail']"
								type="QuestionCircleOutline"
								style="margin-left: 5px; font-size: 20px"
								:data-info="{ ...a_info, showType: 'option' }"
								@click="showExplain"
							/>
						</view>
					</view>
				</view>
				<button
					v-if="showBtn"
					@click="toPricePage"
					class="count_btn"
					size="default"
					type="button"
					:plain="false"
					primarySize="default"
				>
					立即估价
				</button>
				<view class="blankBlock">这是一个透明标签用来占位</view>
			</scroll-view>
		</view>

		<!-- <popup
			:visible="showModal"
			position="bottom"
			:animation="true"
			onClose="closeModal"
		>
			<view class="popup-content">
				<view class="myModal-title">{{ explainTitle }}</view>
				<text class="explain">{{ explainText }}</text>
				<image
					mode="widthFix"
					class="demoImg"
					:src="explainImg"
				/>
				<icon
					style="position: absolute; right: 12px; top: 12px"
					type="CloseOutline"
					@click="closeModal"
				/>
			</view>
		</popup> -->

		<my-drag-service />
	</view>
</template>
<script>
	import { tips } from '../../utils/tips';
	import { commonDomain as domain } from '../../constant/common';
	import find from 'lodash/find';
	export default {
		data() {
			return {
				qaMap: {},

				//问题Qid & 答案info映射
				product_conflict: [],

				explainTitle: '',

				//示例图标题
				explainText: '',

				//示例图文本
				explainImg: null,

				//示例图片
				recycle_lowest_money: 0,

				product_title: {
					product_name: ''
				},

				stepPercent: 0,

				//机型基本信息
				choseNum: 0,

				//初始进度
				showBtn: false,

				//估价按钮显示
				featureLength: 0,

				//问题总数
				scrollTop: 0,

				dataTemps: {},
				versionId: '',

				//spuid
				features: [],

				features_options: {},
				isSelect: false,

				//当前列表数据
				features_optionsEx: {},

				scrollInfoQIdx: '',
				showModal: false,
				q_idx: '',
				a_idx: '',

				a_info: {
					price: '',
					option_id: '',
					isSpecial: ''
				},

				q_info: {
					selectType: '',
					qid: '',
					children: []
				}
			};
		},
		onLoad: function (options) {
			this.versionId = options.versionId;
			this.getMainData();
		},
		onPullDownRefresh: function () {
			uni.stopPullDownRefresh();
		},
		methods: {
			objectToArray(obj = {}) {
				const keys = Object.keys(obj);
				return keys.map((item) => {
					const [name, qid, showIcon, selectType, sort] = item.toString().split('|');
					return {
						name,
						qid,
						showIcon: showIcon === 'true',
						selectType,
						sort,
						children: obj[item]
					};
				});
			},
			//按顺序拷贝对象
			sortObj: function (obj) {
				var arr = [];
				for (var i in obj) {
					arr.push([obj[i], i]);
				}
				arr.sort(function (a, b) {
					return a[0] - b[0];
				});
				var len = arr.length;
				var obj = {};
				for (var i = 0; i < len; i++) {
					obj[arr[i][1]] = arr[i][0];
				}
				return obj;
			},

			getMainData: function () {
				let _this = this;

				let keys = [],
					temps = {},
					values = [],
					product_title,
					product_conflict = [],
					min_price,
					//price_area,
					type_name,
					features_options = {},
					features_optionsEx = {},
					recycle_lowest_money;

				uni.request({
					url: `${domain.apiHost}/getAllVfoInfoForMain`,
					header: {
						'content-type': 'application/x-www-form-urlencoded' // post请求需设置
					},
					data: {
						versionId: _this.versionId,
						company: 'jd'
					},
					method: 'POST',
					success: function (res) {
						if (res.statusCode === 200) {
							if (res.data.status === 200) {
								let resData = res.data.data; //主数据
								//强制转换一次int类型
								resData[0].product_title.markup_money = parseInt(
									resData[0].product_title.markup_money
								);

								product_title = resData[0].product_title; //机器总体情况
								product_conflict = resData[1].product_conflictOption;
								recycle_lowest_money = parseInt(product_title.recycle_lowest_money);
								type_name = product_title.type_name;
								features_options = resData[2].product_info[0];
								//console.log(features_options)

								_this.setData({
									product_name: product_title.product_name,
									features_options: features_options,
									product_title: product_title,
									recycle_lowest_money: recycle_lowest_money,
									product_conflict: product_conflict
								});

								for (var p = 0; p < resData[2].product_info.length; p++) {
									for (var key in features_options) {
										keys.push(key);
										values.push(features_options[key]);
									}
								}
								let features_optionsEx = _this.copyObj(features_options);

								for (let r = 0; r < keys.length; r++) {
									if (r > 0) {
										let deleteTemp = keys[r];
										delete features_optionsEx[deleteTemp];
									}
								} // 渲染

								_this.setData({
									//特征，选项赋值
									features: keys,
									options: values,
									features_optionsEx: features_optionsEx,
									featureLength: keys.length //初始化顶部进度的总步数
								});

								for (let k = 0; k < keys.length; k++) {
									let tempKey = keys[k].split('|')[1];
									let tempType = keys[k].split('|')[3];
									let tempValues = []; //临时数组

									for (let j = 0; j < values[k].length; j++) {
										let tempValuesEx = [];

										tempValuesEx.push(values[k][j].option_id); // tempValuesEx.push(values[k][j].name);

										tempValuesEx.push(false);

										tempValuesEx.push(tempType);
										tempValuesEx.push(values[k][j].isSpecial);
										tempValuesEx.push(values[k][j].name);
										tempValuesEx.push(keys[k].split('|')[0]);
										tempValuesEx.push(values[k][j].price);
										tempValuesEx.push(values[k][j].second_price);
										tempValuesEx.push(false);
										//小数组push完毕，赋值

										tempValues.push(tempValuesEx); //临时数组push完毕，赋值

										temps[tempKey] = tempValues;
									}
								}

								_this.setData({
									dataTemps: temps
								});
								//console.log(temps)
							} else {
								wx.showToast({
									title: '获取机型数据失败',
									icon: 'none',
									duration: 2000,
									mask: true
								});
							} // tips.ERROR_500()
						}
					},
					fail: function (err) {
						tips.ERROR_500();
					}
				});
			},

			copyObj: function (obj) {
				var newobj = {};
				for (var attr in obj) {
					newobj[attr] = obj[attr];
				}
				return newobj;
			},

			/*点击按钮事件
			 */
			optionPressFun: function (event) {
				this.answerCheck(event);
				this.showNextQuestion(event);
				this.toggleBtn(event);
				this.isConflictFun(event);
				this.updateQaMap(event);
				this.scrollToNextQuestion(event);
			},

			updateQaMap: function (params) {
				const { parentfeatureid: qId, answerinfo, parentinfo } = params.currentTarget.dataset;

				const { selectType } = parentinfo;

				let { qaMap } = this;
				if (selectType === 'multiSelect') {
					if (!qaMap[qId]) {
						qaMap[qId] = [];
					}
					let idx = null;
					const isChecked = find(qaMap[qId], ({ answerinfo: ans }, index) => {
						const bol = ans.option_id === answerinfo.option_id;
						if (bol) {
							idx = index;
						}
						return bol;
					});
					if (Boolean(isChecked)) {
						qaMap[qId].splice(idx, 1);
					} else {
						qaMap[qId].push({
							answerinfo,
							parentinfo
						});
					}
				} else {
					qaMap[qId] = {
						answerinfo,
						parentinfo
					};
				}
				this.setData({
					qaMap
				});
			},

			/**
			 * 用于修改dataTemps
			 */
			answerCheck(event) {
				let temps = this.dataTemps;
				let info = event.currentTarget.dataset || {};
				let ansId = info.optionid;
				let qId = info.parentfeatureid;
				let isMultiSelect = info.featuretype === 'multiSelect';
				for (let k = 0; k < temps[qId].length; k++) {
					if (!isMultiSelect) {
						temps[qId][k][1] = false;
					}
					if (ansId == temps[qId][k][0] && isMultiSelect) {
						temps[qId][k][1] = !temps[qId][k][1];
					} else if (ansId == temps[qId][k][0]) {
						temps[qId][k][1] = true;
					}
				}
				this.setData({
					dataTemps: temps
				});
			},

			showNextQuestion: function (event) {
				let info = event.currentTarget.dataset || {};
				let { dataTemps: temps, features_options, features_optionsEx } = this;
				let currentOptionType = info.optiontype;
				let currentParentId = info.parentfeatureid;
				let qIdList = this.features;
				if (currentOptionType == 'true') {
					for (let x = 0; x < qIdList.length; x++) {
						let tempfeatureType = qIdList[x].split('|')[3]; //keys中第p个特征的类型
						if (['otherSelect', 'multiSelect'].includes(tempfeatureType)) {
							let tempfeatureNew = qIdList[x];
							delete features_optionsEx[tempfeatureNew];
						}
					}
					for (let qId in temps) {
						for (let b = 0; b < temps[qId].length; b++) {
							if (['otherSelect', 'multiSelect'].includes(temps[qId][b][2])) {
								temps[qId][b][1] = false;
							}
						}
					}
					this.setData({
						dataTemps: temps,
						features_optionsEx: features_optionsEx //showBtn: true
					});
				} else {
					for (let p = 0; p < qIdList.length; p++) {
						let tempfeatureId = qIdList[p].split('|')[1]; //keys中第p个特征id

						if (currentParentId == tempfeatureId) {
							let newP = p + 1;
							let tempfeatureNew = qIdList[newP];
							let addfeature = features_options[tempfeatureNew];
							features_optionsEx[tempfeatureNew] = addfeature;
						}
					}
					this.setData({
						features_optionsEx: features_optionsEx
					});
				}
			},

			toggleBtn: function () {
				this.setData({
					showBtn: false
				});
				let choseNum = 0; //选中个数
				let temps = this.dataTemps;
				let qIds = []; // console.log(this.data.dataTemps)
				for (let qId in temps) {
					qIds.push(qId);
					for (let b = 0; b < temps[qId].length; b++) {
						if (temps[qId][b][1] == true) {
							choseNum++;
						}
						if (
							temps[qId][b][2] == 'specialSelect' &&
							temps[qId][b][1] == true &&
							temps[qId][b][3] == 'true'
						) {
							this.setData({
								showBtn: true
							});
						}
					}
				}

				//更新顶部选中进度
				if (choseNum > qIds.length - 2) {
					this.setData({
						showBtn: true,
						featureLength: qIds.length
					});
				}

				//多选多个时，不允许超过总长度
				if (choseNum > qIds.length) {
					return;
				}
				this.setData({
					choseNum: choseNum,
					stepPercent: (choseNum / qIds.length) * 100
				});
			},

			scrollToNextQuestion: function (event) {
				const { parentidx } = event.currentTarget.dataset;
				const { showBtn, scrollTop } = this;
				if (showBtn) {
					this.scrollInfoQIdx = null;
					this.scrollTop = scrollTop < 9999 ? 9999 : scrollTop + 1;
				} else {
					this.scrollInfoQIdx = `question_${parentidx + 1}`;
				}
			},

			isConflictFun: function (event) {
				let product_conflict = this.product_conflict;
				let tempDatas = this.dataTemps;
				let choseNum = this.choseNum;
				for (let aim in tempDatas) {
					for (let j = 0; j < tempDatas[aim].length; j++) {
						tempDatas[aim][j][8] = false;
					}
				}
				this.setData({
					dataTemps: tempDatas
				});
				for (let q = 0; q < product_conflict.length; q++) {
					let conflictOptions = product_conflict[q].conflict_optionStr;
					conflictOptions = conflictOptions.substring(0, conflictOptions.length - 1).split('|');
					for (let arry in tempDatas) {
						for (let x = 0; x < tempDatas[arry].length; x++) {
							if (tempDatas[arry][x][1] == true) {
								let choseText = tempDatas[arry][x][4];
								if (conflictOptions.indexOf(choseText) != -1) {
									conflictOptions.splice(conflictOptions.indexOf(choseText), 1);
									if (conflictOptions.length == 1) {
										for (let arryEx in tempDatas) {
											for (let b = 0; b < tempDatas[arryEx].length; b++) {
												if (tempDatas[arryEx][b][4] == conflictOptions) {
													tempDatas[arryEx][b][8] = true;
													tempDatas[arryEx][b][1] = false;
												}
											}
										}
									}
								}
							}
						}
					}
				}
				this.setData({
					dataTemps: tempDatas
				});
			},

			getAnswerId(list) {
				console.log('list: ', list);
				return list.map((item) => {
					const isArray = Array.isArray(item);
					if (isArray) {
						return this.getAnswerId(item);
					} else {
						const { answerinfo } = item;
						return answerinfo.option_id;
					}
				});
			},

			getPrice() {
				const answerList = this.getAnswerId(Object.values(this.qaMap)).flat().filter(Boolean);

				const { versionId: spuId } = this;
				return new Promise((resolve, reject) => {
					uni.request({
						url: `${domain.apiHost}/ext/web/quote`,
						data: {
							spuId,
							company: 'jd',
							answerIds: answerList
						},
						method: 'POST',
						dataType: 'json',
						success: function (res) {
							console.log('res: ', res);
							const { data, statusCode } = res;
							console.log('statusCode: ', statusCode);
							if (statusCode === 200) {
								resolve(data.data);
							}
						},
						fail: function (err) {
							resolve(err);
							tips.ERROR_500();
						}
					});
				});
			},

			async toPricePage() {
				const that = this;
				let { dataTemps: temps, features: keys, product_title, versionId } = this;
				let choseCount = 0;
				let new_price;
				let //picked price
					new_price_second;
				let new_father_name;
				let //picked feature name
					new_child_name;
				let //picked option name
					new_name;
				let //拼接上new_father_name+new_child_name
					area_sum1 = [];
				let area_sum1_second = [];
				let area_sum2 = [];
				let area_sum3 = [];
				let area_sum4 = [];
				let Arry_price = [];
				let //prices group
					Arry_name = []; //options group
				let max_price;
				let price_area;
				let min_price;
				let product_name;
				let final_price;
				let old_final_price = 0;
				let priceRatio;
				let single_price;
				let overLowPrice = false;
				let arrayX = [];
				let global_markup_info = {};
				let global_markup_money = 0;
				let specialOption = false;
				let jswg = 0;
				let pmwg = 0; //llq 2022.6.20
				// temps: spuId : [answer info list]
				for (let arry in temps) {
					for (let y = 0; y < temps[arry].length; y++) {
						if (temps[arry][y][1]) {
							choseCount++;
							new_price = temps[arry][y][6];
							new_price_second = temps[arry][y][7];
							new_father_name = temps[arry][y][5];
							new_child_name = temps[arry][y][4];
							arrayX.push(temps[arry][y][0]);
							if (temps[arry][y][0] == '44370bea01de45ef898a7ee23ed08532') {
								specialOption = true;
							}
							if (temps[arry][y][5] == '机身外观') {
								jswg = parseInt(temps[arry][y][6]);
							}
							if (temps[arry][y][5] == '屏幕外观') {
								pmwg = parseInt(temps[arry][y][6]);
							}
							//2022.6.20llq

							if (new_child_name == '都不是，下一步') {
								new_child_name = '无';
							}
							new_name = '【' + new_father_name + '】' + ':' + new_child_name;
							if (choseCount > keys.length) {
								Arry_name[keys.length - 1] += ',' + new_child_name;
							} else {
								Arry_name.push(new_name);
							}
							switch (temps[arry][y][2]) {
								case 'basicSelect':
									area_sum1.push(new_price);
									area_sum1_second.push(new_price_second);
									break;
								case 'specialSelect':
									area_sum2.push(new_price);
									break;
								case 'otherSelect':
									area_sum3.push(new_price);
									break;
								case 'multiSelect':
									area_sum4.push(new_price);
									break;
							}
						}
					}
				}
				area_sum1 = that.arrySum(area_sum1);
				area_sum1_second = that.arrySum(area_sum1_second);
				area_sum2 = that.arrySum(area_sum2);
				area_sum3 = that.arrySum(area_sum3);
				area_sum4 = that.arrySum(area_sum4);
				if (area_sum3 == undefined) {
					area_sum3 = 0;
				}
				if (area_sum4 == undefined) {
					area_sum4 = 0;
				}
				if (Arry_price.indexOf(undefined) != -1) {
					uni.showToast({
						title: '请您勾选完整后再估价',
						icon: 'none',
						duration: 2000,
						mask: true
					});
					Arry_name = [];
					Arry_price = [];
					return;
				}
				max_price = that.product_title.max_price;
				product_name = that.product_title.product_name;
				min_price = that.product_title.min_price;
				price_area = that.product_title.price_area.split('|');
				if (area_sum2 != 0) {
					area_sum1 = area_sum1_second;
				}
				priceRatio = 1 - area_sum1 / max_price;
				for (var i = 0; i < price_area.length; i++) {
					price_area[i] = parseInt(price_area[i]);
				} //count area4's price

				if (area_sum4 != undefined && area_sum4 != 0) {
					for (var u = 0; u < price_area.length + 1; u++) {
						if (u != price_area.length) {
							if (area_sum4 <= price_area[u]) {
								area_sum4 = price_area[u];
								break;
							}
						} else {
							overLowPrice = true;
						}
					}
				}
				if (
					that.product_title.type_name == 'phone' &&
					specialOption &&
					area_sum3 != undefined &&
					area_sum3 != 0
				) {
					area_sum3 = area_sum3 - pmwg - jswg + parseInt(jswg) * 0.3;
				}
				//2022.6.20

				if (!overLowPrice) {
					final_price = Math.round(
						max_price - area_sum1 - priceRatio * (area_sum2 + area_sum3 + area_sum4)
					);
				} else {
					final_price = Math.round(2 * priceRatio * min_price);
				}
				if (final_price <= min_price) {
					final_price = Math.round(min_price + priceRatio * min_price);
				}
				if (priceRatio < 0) {
					final_price = min_price;
				}

				//处理加价券的情况
				let isNew = that.isNewFun(arrayX);
				let isLock = that.isLockFun(arrayX);
				uni.setStorage({
					key: 'is_new',
					data: isNew
				});
				const priceInfo = await this.getPrice();
				final_price = priceInfo.quotePrice;
				console.log('final_price: ', final_price);
				// 用于查找是否有范围加价券
				uni.request({
					url: `${domain.apiHost}/findFWMarkUpRoll`,
					headers: {
						'content-type': 'application/x-www-form-urlencoded' // post请求需设置
					},

					data: {
						company: 'jd',
						money: final_price,
						versionId
					},
					dataType: 'json',
					method: 'post',
					success: function (res) {
						if (res.statusCode === 200) {
							if (res.data.status === 200) {
								if (
									res.data.data.newflag == 3 ||
									(res.data.data.newflag == 1 && isNew) ||
									(res.data.data.newflag == 2 && !isNew)
								) {
									global_markup_info = res.data.data;
									global_markup_money = parseInt(res.data.data.fmarkup_money);
								}
							}
							if (
								(that.product_title.ismarkup == 2 && isNew && that.product_title.newFlag == 1) ||
								(that.product_title.ismarkup == 2 && !isNew && that.product_title.newFlag == 2) ||
								(that.product_title.ismarkup == 2 && that.product_title.newFlag == 3)
							) {
								old_final_price = final_price; //存上老价格

								//判断是否有全局的加价券
								if (global_markup_money != 0) {
									final_price += global_markup_money;
									final_price += that.product_title.markup_money;
									that.product_title.markup_money =
										global_markup_money + that.product_title.markup_money; //更换加价券金额
									that.product_title.mrremark =
										'范围加价：' +
										global_markup_money +
										' ；机型加价：' +
										that.product_title.markup_money; //加价备注
								} else {
									//下单传老价格参数
									final_price += that.product_title.markup_money;
									that.product_title.mrremark = '机型加价：' + that.product_title.markup_money; //加价备注
								}
							} else {
								console.log('无机型加价券-');
								if (global_markup_money != 0) {
									old_final_price = final_price; //存上老价格
									final_price += global_markup_money;
									that.product_title.markup_id = global_markup_info.markup_id_fw; //更换加价券id
									that.product_title.markup_money = global_markup_money; //更换加价券金额
									that.product_title.mrremark = '范围加价：' + global_markup_money; //哪种类型的加价券
								} else {
									console.log('无机型，也无范围加价券');
									that.product_title.markup_id = '';
									that.product_title.markup_money = 0;
									that.product_title.mrremark = ''; //加价备注
								}
							}

							if (!(final_price - that.product_title.markup_money > that.recycle_lowest_money)) {
								uni.alert({
									title: '提示',
									content: '智能估价较低，可联系在线客服，说明机况进行人工报价哦~'
								});
								return;
							}
							if (
								isLock &
								(that.product_title.type_name == 'phone') &
								(that.product_title.brand_name == '苹果') &
								(that.product_title.lock_money > 0)
							) {
								final_price += that.product_title.lock_money;

								//修改加价券相关信息
								that.product_title.markup_id = that.product_title.version_id; //存机型id
								that.product_title.markup_money += that.product_title.lock_money; //更换加价券金额
								that.product_title.mrremark +=
									' iphone有锁机加价：' + that.product_title.lock_money;
							}
							uni.setStorage({
								key: 'final_price',
								data: final_price
							});
							uni.setStorage({
								key: 'old_final_price',
								data: old_final_price
							});

							// Arry_name = Object.values(that.data.qaMap).map((item) => {
							//   return `【${item.parentinfo.name}】:${item.name}`;
							// });

							uni.setStorage({
								key: 'Arry_name',
								data: Arry_name
							});
							uni.setStorage({
								key: 'product_title',
								data: that.product_title
							});
							uni.setStorage({
								key: 'versionId',
								data: that.versionId
							});
							uni.setStorage({
								key: 'isDigital',
								data: false
							});
							uni.navigateTo({
								url: '/pages/showcountprice/showcountprice'
							});
						} else {
							uni.showToast({
								title: '系统忙碌，请稍后重试~',
								icon: 'none',
								duration: 2000,
								mask: false
							});
						}
					}
				});
			},

			isNewFun: function (arrays) {
				let temp = this.features_options;
				console.log(this.product_title);
				for (let key in temp) {
					for (let y = 0; y < temp[key].length; y++) {
						if (temp[key][y].isNew == 1) {
							if (arrays.indexOf(temp[key][y].option_id) != -1) {
								return true;
							}
						}
					}
				}
				return false;
			},

			isLockFun: function (arrays) {
				let temp = this.features_options;
				for (let key in temp) {
					for (let y = 0; y < temp[key].length; y++) {
						if (temp[key][y].name.trim() == '水货有锁') {
							if (arrays.indexOf(temp[key][y].option_id) != -1) {
								return true;
							}
						}
					}
				}
				return false;
			},

			//求和方法
			arrySum: function (arr) {
				var s = 0;
				arr.forEach(function (val, idx, arr) {
					s += val;
				}, 0);
				return s;
			},

			/**
			 * 弹出层函数
			 * 弹出示例图的函数
			 */
			//弹出事件
			showExplain: function (e) {
				const { info } = e.currentTarget.dataset;
				const { showType } = info;
				if (showType === 'feature') {
				} else {
				}
				const baseArr = {
					versionId: this.versionId,
					brandId: this.product_title.brand_id,
					typeId: this.product_title.type_id
				};
				this.getExplainData(Object.assign(baseArr, explainParams), info.name);
				this.setData({
					showModal: true
				});
			},

			closeModal: function () {
				this.setData({
					showModal: false
				});
			},

			getExplainData: function (explainParams, titleName) {
				let that = this;
				uni.request({
					url: `${domain.apiHost}/getFOImgWordsDetail`,
					headers: {
						'content-type': 'application/x-www-form-urlencoded' // post请求需设置
					},

					data: explainParams,
					method: 'POST',
					dataType: 'json',
					success: function (res) {
						if (res.status === 200) {
							if (res.data.status === 200) {
								console.log(res);
								that.setData({
									explainTitle: titleName,
									//示例图标题
									explainText: res.data.data.wordsDetail,
									//示例图文本
									explainImg: `${domain.apiHost}` + res.data.data.imgDetail
								});
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none',
									duration: 2000,
									mask: false
								});
							}
						} else {
							uni.showToast({
								title: '获取示例图出错，请联系客服',
								icon: 'none',
								duration: 2000,
								mask: false
							});
						}
					}
				});
			}
		}
	};
</script>
<style lang="scss">
	@import './placeordersteps.scss';
</style>
