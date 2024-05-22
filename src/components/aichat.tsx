
const AiChat = ({message}) => {
    return (
        <div className="">
            
            <div className="flex items-end ">
                <div className="flex flex-col order-2 w-full px-4 space-y-2 text-sm">
                    <div>
                        <span className="inline-block w-full px-4 py-2 text-gray-800 bg-gray-100 rounded-lg rounded-bl-none">                <h1>AI</h1>
{message}</span></div>
                </div>
            </div>
        </div>
        )
}

export default AiChat