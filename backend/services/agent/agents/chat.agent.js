import {
    AIMessage,
    HumanMessage,
    SystemMessage
} from "@langchain/core/messages";

import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {
    try {
        const llm = await getModel("chat");
        const history = await getMemory(state.conversationId);

        const searchContext = state.searchResult
            ? `
                Web Search Results:
                ${JSON.stringify(state.searchResult)}

                Use these search results to answer the user's question.
                Do not generate, describe, or return image URLs.
                `
            : "";

        const systemPrompt = `
        You are Orvexa, an intelligent AI assistant.

        ${searchContext}

        Rules:
        - For simple questions and greetings, respond naturally in plain text.
        - For technical, educational, coding, or detailed topics, use clean Markdown.
        - If search results exist, use them to answer the user's question.
        - Do not mention internal tools.
        - Do not return image URLs in your text response.
        - Use headings, lists, and fenced code blocks when appropriate.
        - Keep paragraphs short and readable.
        - Avoid unnecessarily long answers.
        `;

        const messages = [
            new SystemMessage(systemPrompt)
        ];

        const chatHistory = Array.isArray(history)
            ? history
            : Array.isArray(history?.array)
                ? history.array
                : [];

        chatHistory.slice(-10).forEach((msg) => {
            if (
                !msg ||
                typeof msg.content !== "string"
            ) {
                return;
            }

            if (msg.role === "user") {
                messages.push(new HumanMessage(msg.content));
            } else if (msg.role === "assistant") {
                messages.push(new AIMessage(msg.content));
            }
        });

        // Pass the actual user query, not the system prompt.
        if (
            typeof state.prompt !== "string" ||
            !state.prompt.trim()
        ) {
            throw new Error("User prompt is missing or invalid.");
        }

        messages.push(new HumanMessage(state.prompt));

        const response = await llm.invoke(messages);

        return {
            ...state,
            aiResponse:
                typeof response.content === "string"
                    ? response.content
                    : JSON.stringify(response.content),
            images: state.images ?? []
        };

    } catch (error) {
        console.error("Chat agent error:", error);

        throw error;
    }
};