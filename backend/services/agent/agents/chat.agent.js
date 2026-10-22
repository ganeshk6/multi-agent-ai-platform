import { getModel } from "../config/llmModels"

export const chatAgent = async(state) => {
    const llm = await getModel("chat")
    const prompt = "You are an intelligent AI assistant."
    const response = await llm.invoke([
        {
            "role": "system",
            "content": prompt
        },
        {
            "role": "human",
            "content": state.prompt
        }
    ])

    return {
        ...state,
        aiResponse:response.content
    }
}