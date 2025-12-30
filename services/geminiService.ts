
import { GoogleGenAI } from "@google/genai";
import { PayrollRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPayrollInsights = async (records: PayrollRecord[]): Promise<string> => {
  if (records.length === 0) return "No payroll data available for analysis.";

  const summary = records.map(r => ({
    name: r.employeeName,
    type: r.type,
    net: r.netSalary,
    overtime: r.overtimeTotal
  }));

  const prompt = `
    As a Senior HR Financial Analyst, analyze the following payroll records for this period:
    ${JSON.stringify(summary)}

    Provide a concise 3-paragraph summary:
    1. Overall spending trends (Total payout, average per employee).
    2. Overtime analysis (Identify if overtime is excessive and where).
    3. Actionable recommendations for the next period to optimize costs or improve employee satisfaction.
    Keep the tone professional and helpful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service. Please check your network or API configuration.";
  }
};
