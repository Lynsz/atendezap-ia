export type KnowledgeCategory =
  | "faq"
  | "product"
  | "service"
  | "objection"
  | "policy"
  | "payment"
  | "delivery"
  | "schedule"
  | "support"
  | "custom";

export type KnowledgeItemStatus = "active" | "draft" | "archived";

export type KnowledgePriority = "low" | "medium" | "high";

export type KnowledgeItem = {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  status: KnowledgeItemStatus;
  tags: string[];
  priority: KnowledgePriority;
  createdAt: string;
  updatedAt: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  status: KnowledgeItemStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProductKnowledgeItem = {
  id: string;
  name: string;
  description: string;
  price?: string;
  benefits: string[];
  commonQuestions: string[];
  objections: string[];
  status: KnowledgeItemStatus;
  createdAt: string;
  updatedAt: string;
};

export type ObjectionItem = {
  id: string;
  objection: string;
  suggestedAnswer: string;
  category: KnowledgeCategory;
  status: KnowledgeItemStatus;
  createdAt: string;
  updatedAt: string;
};

export type PolicyItem = {
  id: string;
  title: string;
  description: string;
  category: KnowledgeCategory;
  status: KnowledgeItemStatus;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeInsight = {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "success";
  createdAt: string;
};
