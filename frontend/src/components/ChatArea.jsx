import React from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMessages } from '../features/getMessages'
import { setArtifacts, setMessages } from '../redux/messageSlice'

function ChatArea() {
    const {selectedConversation} = useSelector(state=>state.conversation);
    const {artifacts} = useSelector(state=>state.message);
    const dispatch = useDispatch();
    console.log(artifacts)
    console.log(selectedConversation)
    useEffect(()=>{
        const getMesg = async()=>{
            if (!selectedConversation?._id) {
                dispatch(setMessages([]));
                dispatch(setArtifacts([]));
                return;
            }
            if(selectedConversation){
                if(selectedConversation.title == "New Chat")return;
                const data = await getMessages(selectedConversation?._id);
                dispatch(setMessages(data));
                const latestArtifactMsg = [...data].reverse().find(msg=>msg?.artifacts && msg?.artifacts.length>0)
                dispatch(setArtifacts(latestArtifactMsg?.artifacts || []))
            }
        }
        getMesg()
    },[selectedConversation?._id])

    return (
        <div className='flex-1 flex flex-col min-w-0'>
        <Nav />
        <MessageList />
        <ChatInput />
        </div>
    )
}

export default ChatArea
