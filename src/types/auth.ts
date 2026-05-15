export type UserPlan = "basic" | "starter" | "premium";

export type AccessUser = {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  createdAt: string;
  lastLoginAt: string;
};

export type AccessSession = {
  user: AccessUser;
  isAuthenticated: boolean;
  expiresAt: string;
};
