<!-- @format -->

<template>
	<!-- 常见问题 -->
	<view class="page">
		<uni-collapse>
			<uni-collapse-item
				v-for="(item, index) in questionList"
				:title="item.title"
				:key="index"
			>
				<view class="question-answer">
					{{ item.content }}
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	import QAList from '@/constant/QA.json';
	export default {
		data() {
			return {
				questionList: QAList
			};
		}
	};
</script>
<style lang="scss" scoped>
	.page {
		width: 100%;
		height: 100vh;
		padding: 30rpx;
		.questionContent {
			border-radius: 20rpx;
			overflow: hidden;
		}

		.question-answer {
			box-sizing: border-box;
			color: #999;
			font-size: 24rpx;
			line-height: 36rpx;
			box-sizing: border-box;
			padding: 30rpx;
		}
	}
</style>
