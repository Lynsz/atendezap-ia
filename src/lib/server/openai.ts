import OpenAI from "openai";
import { requireOpenAiEnv } from "@/lib/server/env";

const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
}

export function hasOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOpenAIClient() {
  const { apiKey } = requireOpenAiEnv();

  return new OpenAI({ apiKey });
}
