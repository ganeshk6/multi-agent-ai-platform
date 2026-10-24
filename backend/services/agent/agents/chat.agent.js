import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/memory.js";

export const chatAgent = async(state) => {
    const llm = await getModel("chat")
    const history = await getMemory(state.conversationId);
    const searchContext = state.searchResult ? `
    Web Search Results:

    ${JSON.stringify(state.searchResult)}

    Answer the user using only the above search results.
    ` :"";

    const systemPrompt = `
        You are Orvexa, an intelligent AI assistant.


        ${searchContext}
        If searchContext exists:

        - Use search results to answer.
        - Do not mention internal tools.

        Rules:
        - For simple questions, greetings and short queries, respond naturally in plan text.
        - For technical, educational, coding or detailed topics, use clean Markdown.
        
        Formatting:
        - Use # for titles and ## for sections.
        - Leave a blank line after headings.
        - Use bullent points for lists.
        - Use numbered lists for steps.
        - Use fenced code blocks with language tags for code.
        - Keep paragraphs short and readable.
        - Never write headings and content on the same line.
        - Never generate large walls of text.
    `;

    const messages = [
        new SystemMessage(systemPrompt)
    ]

    const chatHistory = Array.isArray(history)
        ? history
        : Array.isArray(history?.array)
            ? history.array
            : [];

    chatHistory.forEach((msg) => {
        if (msg.role === "user") {
            messages.push(new HumanMessage(msg.content));
        } else if (msg.role === "assistant") {
            messages.push(new AIMessage(msg.content));
        }
    });
    
    messages.push(new HumanMessage(systemPrompt))

    const response = await llm.invoke(messages)

    return {
        ...state,
        aiResponse:response.content
    }
}