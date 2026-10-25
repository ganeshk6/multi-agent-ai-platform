import { searchTool } from "../config/tavily.js"

export const searchAgent = async(state) => {
    try {
        const results = await searchTool.invoke({
            query:state.prompt
        })
        const webResults = Array.isArray(results)
            ? results
            : Array.isArray(results?.results)
                ? results.results
                : [];

        const images = Array.isArray(results?.images)
            ? results.images
            : [];

        return {
            ...state,
            searchResult: webResults,
            images,
        };
    } catch (error) {
        return {
            ...state,
            searchResult:[],
            images:[]
        }
    }
}