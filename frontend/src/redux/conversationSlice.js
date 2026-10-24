import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
    name:"conversation",
    initialState:{
        conversations:[],
        selectedConversation:null
    },
    reducers:{
        setConversations:(state, action)=>{
            state.conversations=action.payload
        },
        addConversation:(state,action)=>{
            state.conversations.unshift(action.payload)
        },
        setSelectConversation:(state,action)=>{
            state.selectedConversation = action.payload
        },
        setConvTitle:(state, action)=>{
            const {title, convId} = action.payload
            state.conversations = state.conversations.map((conv)=>(
                conv._id == convId?(
                    {...conv, title}
                ):conv
            ))

            if(state.selectedConversation?._id == convId){
                state.selectedConversation={...state.selectedConversation,title}
            }
        }
    }
})

export const {setConversations, addConversation, setSelectConversation, setConvTitle} = conversationSlice.actions
export default conversationSlice.reducer