import OpenAI from "openai";
import { AppError } from "@/lib/errors";

const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
}

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new AppError("A chave da OpenAI nao esta configurada no ambiente local.", 500);
  }

  return new OpenAI({ apiKey });
}
