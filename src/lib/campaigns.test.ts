import { describe, expect, it } from "vitest";
import {
  aggregateCampaignResults,
  calculateCampaignCosts,
  createCampaignResultSchema,
  createCampaignSchema,
  getCampaignDiagnostics,
  summarizeByDimension,
  type CampaignResult,
  type CampaignWithResults
} from "./campaigns";

describe("campaigns", () => {
  it("rejeita status e decisao invalidos", () => {
    expect(() => createCampaignSchema.parse({ name: "Teste", channel: "Meta Ads", objective: "Leads", status: "done" })).toThrow();
    expect(() => createCampaignSchema.parse({ name: "Teste", channel: "Meta Ads", objective: "Leads", decision: "delete" })).toThrow();
  });

  it("rejeita valores negativos em resultados", () => {
    expect(() => createCampaignResultSchema.parse({ leads: -1 })).toThrow();
    expect(() => createCampaignResultSchema.parse({ spend_amount: -10 })).toThrow();
  });

  it("calcula custo por lead, cadastro e assinatura", () => {
    expect(calculateCampaignCosts({ spend_amount: 120, leads: 12, signups: 4, subscriptions: 2 })).toEqual({
      cost_per_lead: 10,
      cost_per_signup: 30,
      cost_per_subscription: 60
    });
  });

  it("mantem custos nulos sem gasto ou base", () => {
    expect(calculateCampaignCosts({ spend_amount: null, leads: 12, signups: 4, subscriptions: 2 })).toEqual({
      cost_per_lead: null,
      cost_per_signup: null,
      cost_per_subscription: null
    });
    expect(calculateCampaignCosts({ spend_amount: 100, leads: 0, signups: null, subscriptions: undefined })).toEqual({
      cost_per_lead: null,
      cost_per_signup: null,
      cost_per_subscription: null
    });
  });

  it("agrega resultados manuais por campanha", () => {
    const results = [
      { campaign_id: "c1", visitors: 100, leads: 10, signups: 2, spend_amount: 50 },
      { campaign_id: "c1", visitors: 30, leads: 5, signups: 1, spend_amount: 25 }
    ] as CampaignResult[];

    expect(aggregateCampaignResults(results)).toMatchObject({
      visitors: 130,
      leads: 15,
      signups: 3,
      spend_amount: 75,
      cost_per_lead: 5,
      cost_per_signup: 25
    });
  });

  it("exibe diagnostico com dados simulados", () => {
    const diagnostics = getCampaignDiagnostics({
      visitors: 100,
      clicks: 0,
      leads: 2,
      signups: 0,
      onboardings: 0,
      first_responses: 0,
      saved_responses: 0,
      checkouts: 0,
      subscriptions: 0,
      spend_amount: 100,
      cost_per_lead: 50,
      cost_per_signup: null,
      cost_per_subscription: null
    });

    expect(diagnostics).toContain("A página ou oferta pode não estar clara.");
  });

  it("gera comparacao por nicho e canal quando ha dados", () => {
    const campaigns = [
      {
        id: "c1",
        name: "Delivery 1",
        niche: "delivery",
        channel: "Meta Ads",
        totals: {
          visitors: 100,
          clicks: 0,
          leads: 10,
          signups: 3,
          onboardings: 2,
          first_responses: 2,
          saved_responses: 1,
          checkouts: 1,
          subscriptions: 1,
          spend_amount: 80,
          cost_per_lead: 8,
          cost_per_signup: 26.67,
          cost_per_subscription: 80
        }
      },
      {
        id: "c2",
        name: "Loja 1",
        niche: "loja",
        channel: "Google Ads",
        totals: {
          visitors: 50,
          clicks: 0,
          leads: 4,
          signups: 1,
          onboardings: 1,
          first_responses: 1,
          saved_responses: 0,
          checkouts: 0,
          subscriptions: 0,
          spend_amount: 40,
          cost_per_lead: 10,
          cost_per_signup: 40,
          cost_per_subscription: null
        }
      }
    ] as CampaignWithResults[];

    expect(summarizeByDimension(campaigns, "niche")[0]).toMatchObject({ label: "delivery", campaigns: 1, leads: 10, subscriptions: 1 });
    expect(summarizeByDimension(campaigns, "channel")[0]).toMatchObject({ label: "Meta Ads", campaigns: 1, leads: 10, subscriptions: 1 });
  });
});
