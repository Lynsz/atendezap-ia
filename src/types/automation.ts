export type AutomationTrigger =
  | "new_lead"
  | "customer_no_reply"
  | "message_received"
  | "urgent_lead"
  | "proposal_sent"
  | "stalled_service";

export type AutomationAction =
  | "send_welcome_message"
  | "generate_ai_reply"
  | "create_follow_up_reminder"
  | "mark_as_urgent"
  | "move_pipeline_stage"
  | "suggest_next_action";

export type AutomationStatus = "active" | "paused" | "draft";

export type Automation = {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  status: AutomationStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalRuns: number;
  lastRunAt?: string;
};

export type AutomationLog = {
  id: string;
  automationId: string;
  automationName: string;
  action: AutomationAction;
  executedAt: string;
  result: string;
  status: "success" | "skipped" | "failed";
};
