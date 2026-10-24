import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessages } from "../config/memory.js";
import redis from "../../../shared/redis/redis.js";

export const agent = async (req, res) =>{
    try {
        const { prompt, conversationId, agent } = req.body
        await redis.del(`messages-${conversationId}`)
        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`,{
            conversationId , role:"user", content:prompt
        })
        
        const result = await graph.invoke({
            prompt, conversationId, agent
        })
        
        await addMessages(conversationId, "user", prompt)
        await addMessages(conversationId, "assistant", result.aiResponse)
        await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`,{
            conversationId , role:"assistant", content:result.aiResponse, images:result.images
        })

        return res.status(200).json({
            answer:result.aiResponse,
            images:result.images || [],
        });
    } catch (error) {
        return res.status(500).json({message:`agent error ${error}`});
    }
}