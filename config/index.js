export const CLOUD_ENV = 'dev-2g6vkydrb65a226e'

export const playMode = {
	sequence: 0,
	loop: 1,
	random: 2
}



// 题目类型映射表
export const QUESTION_TYPES = {
	// 选择题
	'1': 'Choice',
	// 多选题
	'2': 'MultipleChoice',
	// 填空题
	'3': 'FillIn',
	// 判断题
	'4': 'Judgment '
}

// computer section_types 计算机答题 章节枚举列表
export const COMPUTER_SECTION_TYPES = {
	'1': '第一章 基础知识',
	'2': '第二章 操作系统应用',
	'3': '第三章 文字处理',
	'4': '第四章 电子表格',
	'5': '第五章 演示文稿',
	'6': '第六章 计算机网络基础',
	'7': '第七章 Internet应用',
	'8': '第八章 信息安全与网络道德',
	'9': '第九章 计算机多媒体技术'
}

// 科目映射表
export const SUBJECT_TYPES = {
	'1': {
		subjectTitle: '计算机',
		sectionTypes: COMPUTER_SECTION_TYPES
	}
}

// answer 页面标题
export const ANSWER_TITLE_TYPES = {
	'computer': '计算机答题',
	'error': '错题集',
	'collection': '收藏集'
}
