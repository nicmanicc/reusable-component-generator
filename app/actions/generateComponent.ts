"use server";

import OpenAI from "openai";
const client = new OpenAI();

export const generateComponent = async (promptInput: string, code?: string) => {
  const response = await client.responses.create({
    model: "gpt-5-mini",
    prompt: {
      id: "pmpt_694552ca937c8196aad1c80dd2973db2045fb08fa22f3415",
      version: "8",
    },
    input: promptInput + " Here is the existing code to refine: " + code,
  });
  return response.output_text;
};
