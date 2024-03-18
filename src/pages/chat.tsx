import AiChat from "../components/aichat"
import UserChat from "../components/userchat"

const Chat = () => {
    return (
        <div className="h-full bg-gray-100 ">
            <div className="w-1/2 mx-auto">

                <div className="">
                    <UserChat />
                    <AiChat />
                </div>
                <div>

                    <div className="px-4 pt-4 mb-2 border-gray-200">
                        <div className="relative flex ">

                            <input type="text" placeholder="Write your message!" className="w-full py-3 pl-4 text-gray-600 placeholder-gray-600 bg-gray-100 border-4 rounded-xl focus:outline-none focus:placeholder-gray-400" />
                            <div className="absolute inset-y-0 right-0 items-center hidden pr-2 sm:flex">

                                <button type="button" className="inline-flex items-center justify-center w-10 h-10 text-gray-500 transition duration-500 ease-in-out rounded-full hover:bg-gray-300 focus:outline-none">
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