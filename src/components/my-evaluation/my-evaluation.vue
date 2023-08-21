<!-- @format -->

<template>
	<view class="card evaluation">
		<view class="card-header">
			<view class="card-header-title">用户评价</view>
			<uni-icons
				type="forward"
				className="more-icon"
				@click="toCommonProblem"
			/>
		</view>
		<swiper
			style="height: 322px"
			previousMargin="10px"
			nextMargin="10px"
			:autoplay="true"
			:vertical="true"
			:circular="true"
			duration="3000"
		>
			<swiper-item
				:key="index"
				v-for="(evaluation, index) in evaluationList"
			>
				<view
					class="evaluationBox"
					v-for="(item, index1) in evaluation"
					:key="index1"
				>
					<my-avatar
						slot="image"
						:name="item.spuName"
						:desc="item.evaluation"
					/>
					<view class="right">
						<view class="swiper-item-header">
							<view class="swiper-item-header-spuName">{{ item.spuName }}</view>
							<view class="swiper-item-header-price">¥{{ item.sellPrice }}</view>
						</view>
						<view class="collapse-item-content {">
							{{ item.evaluation }}
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	const evaluation = require('@/constant/evaluation.json');
	console.log('evaluation: ', evaluation);
	export default {
		data() {
			return {
				evaluationList: evaluation,
				evaluation: []
			};
		},
		methods: {
			toCommonProblem: function () {
				uni.navigateTo({
					url: '/pages/questionguide/questionguide'
				});
			}
		},
		created: function () {}
	};
</script>
<style lang="scss" scoped>
	.card {
		width: 100%;
		border-radius: 20rpx;
		background-color: #fff;
		margin: 0 0 30rpx;
		padding: 20rpx;

		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: bold;
		}

		.card-header-title {
			font-size: 36rpx;
			margin: 20rpx;
			font-weight: bold;
		}
	}

	.evaluation {
		.evaluationBox {
			display: flex;
			padding: 20rpx;
			align-items: center;
			.right {
				width: 100%;
				margin-left: 20rpx;

				.swiper-item-header {
					width: 100%;
					display: flex;
					justify-content: space-between;

					.swiper-item-header-spuName {
						font-size: 28rpx;
						font-weight: bold;
					}
					.swiper-item-header-price {
						font-weight: bold;
						color: red;
						font-size: 28rpx;
					}
				}

				.collapse-item-content {
					color: #999;
					line-height: 40rpx;
					font-size: 20rpx;
				}
			}
		}
	}
</style>
