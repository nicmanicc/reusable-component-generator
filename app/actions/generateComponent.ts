"use server";

import OpenAI from "openai";
const client = new OpenAI();

export const generateComponent = async (promptInput: string) => {
  const response = await client.responses.create({
    model: "gpt-5-mini",
    prompt: {
      id: "pmpt_694552ca937c8196aad1c80dd2973db2045fb08fa22f3415",
      version: "2",
    },
    input: promptInput,
  });
  return response.output_text;
};
