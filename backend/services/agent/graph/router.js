import { getModel } from "../config/llmModels.js"

export const router = async(state) => {
    if(state.agent && state.agent !== "auto"){
        return {
            ...state,
            agent:state.agent
        }
    }
    const llm = await getModel("router")
    const prompt = `You are an agent router,
    Available agents:

    - chat
    - search
    - coading
    - ppt
    - pdf
    - vision

    Rules:

    chat:
    General conversation,
    explanations,
    learning,
    quesrions.

    search:
    Current events,
    latest information,
    news,
    recent developments,
    internet loopup.

    coding:
    Generate code,
    debug code,
    build projects,
    architecture,
    API design,

    pdf:
    Questions about generate PDFs or documents context.

    ppt:
    Questions about generate ppts or ppt context.

    vision:
    Generate image,
    create image

    Return ONLY one word:

    chat
    search
    coding
    pdf
    ppt
    vision

    User Query:
    ${state.prompt}
    `

    const response = await llm.invoke(prompt)

    return {
        ...state,
        agent:response.content.trim().toLowerCase()
    }
}