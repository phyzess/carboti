import type { MessageKey } from "./message-types";

export const zhReviewMessages = {
  "advisory.description": "为当前选中的导入任务生成 AI 建议。",
  "advisory.emptyTitle": "暂无建议",
  "advisory.title": "AI 建议",
  "review.chartDistribution": "确认状态分布",
  "review.chartTrend": "选中任务确认计数",
  "review.consoleTitle": "确认控制台",
  "review.emptyStagedDescription": "选择或处理一个导入任务来查看暂存记录。",
  "review.emptyStagedTitle": "暂无暂存记录",
  "review.eventEmpty": "选择或处理一个导入任务来填充事件流。",
  "review.eventStream": "事件流",
  "review.guardrails": "确认护栏",
  "review.issue": "问题",
  "review.noIssue": "无问题",
  "review.noJobSelected": "未选择导入任务",
  "review.payload": "载荷",
  "review.record": "记录",
  "review.stagedRecords": "暂存记录",
  "review.status": "状态",
  "review.decision": "决策",
} satisfies Partial<Record<MessageKey, string>>;
