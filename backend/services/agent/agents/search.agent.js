import { searchTool } from "../config/tavily.js"

export const searchAgent = async(state) => {
    try {
        const results = await searchTool.invoke({
            query:state.prompt
        })
        
        return {
            ...state,
            searchResult:results,
            images:results.images
        }
    } catch (error) {
        console.log(`tavily search error ${error}`)
        return {
            ...state,
            searchResult:[],
            images:[]
        }
    }
}