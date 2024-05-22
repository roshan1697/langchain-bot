import { useState } from "react"
import AiChat from "../components/aichat"
import UserChat from "../components/userchat"
import axios from "axios"

const Chat = () => {
   
    const [inputValue, setInputValue] = useState("")
    const [convHistory , setConvHistory] = useState<string[]>([])
    const [loading,setLoading] = useState(false)
    
    const formatConvHistory = ()=>{
        return convHistory.map((message,i)=>{
            if(i%2 === 0){
                return `Human:${message}`
            }
            return `AI: ${message}`
        }).join('\n')
    }
    
     return (
        <div className="h-full bg-gray-100 ">
            <div className="relative w-1/2 h-full mx-auto">
                
                <div className="max-h-full overflow-y-auto">
                {convHistory.length === 0 ? <></> : convHistory.map((message,i)=>{
                    if(i%2 === 0){
                        return <UserChat key={i} message={message}/>
                    }
                    return <AiChat key={i} message={message} />
                })
                    
                }
                </div>






                <div>

                    <div className="absolute bottom-0 w-full px-4 pt-4 bg-gray-100">
                        {loading? <div>Running...</div> : <></>}
                        <div className="relative flex ">

                            <input type="text" placeholder="Write your message!" className="w-full py-3 pl-4 text-gray-600 placeholder-gray-600 bg-gray-100 border-4 rounded-xl focus:outline-none focus:placeholder-gray-400"
                                          onChange={(e) => setInputValue(e.target.value)} 

                            />
                            <div className="absolute inset-y-0 right-0 items-center hidden pr-2 sm:flex">

                                <button type="button" className="inline-flex items-center justify-center w-10 h-10 text-gray-500 transition duration-500 ease-in-out rounded-full hover:bg-gray-300 focus:outline-none "
                                onClick={async()=>{
                    
                                    if(convHistory.length === 0){setConvHistory(inputValue) }
                                    setConvHistory([...convHistory,inputValue])
                                    setLoading(true)
                                    const res = await  axios.post('http://localhost:3000/', {
                                        message:inputValue,
                                        history:formatConvHistory(convHistory)
                                    })
                                        if(res){
                                            setLoading(false)
                                            setConvHistory((prevmessage)=>[...prevmessage,res.data.answer])
                                            
                                        }
                                    
                                    
                                    setInputValue("")
                                }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 ml-2 transform rotate-90">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                    </svg>
                                </button>

                            </div>
                        </div>
                    </div>

                </div>
            </div>


        </div>
    )
}

export default Chat