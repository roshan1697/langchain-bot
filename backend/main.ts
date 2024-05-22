import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import fs from 'fs'
import { supabaseAPI, supabaseURL } from './config'
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { ChatOllama } from "@langchain/community/chat_models/ollama"
import {PromptTemplate} from '@langchain/core/prompts'
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";

import express from 'express'
import cors from'cors'
import { Request, Response } from 'express'
const PORT = '3000'
const app = express()
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173'
}))

const combineText =<T extends {pageContent:string}>(docs:T[])=> {
    return docs.map((doc)=>doc.pageContent).join('\n\n')
}

const Test = async (userQuestion:string,convhistory:string | string[]) => {

    try {

        // const result = await fs.promises.readFile('../public/example.txt', 'utf8',)


        // const splitter = new RecursiveCharacterTextSplitter({
        //     chunkSize: 500,
        //     chunkOverlap: 50
        // })
        // const outputText = await splitter.createDocuments([result])
        const supabaseClient = createClient(supabaseURL, supabaseAPI)

        // await SupabaseVectorStore.fromDocuments(
        //     outputText,
        //     new OllamaEmbeddings,
        //     {
        //         client: supabaseClient,
        //         tableName: 'documents'
        //     }
        // )
        const embeddings = new OllamaEmbeddings({})
        const vectorData = new SupabaseVectorStore(embeddings,{
            client: supabaseClient,
            tableName:'documents',
            queryName:'match_documents1'
        })
    
        const retriever = vectorData.asRetriever()
        const quest = `given some conversation history (if any) and  a question, convert the question  to a standalone question. 
        conversation history:{conv_history}
        question:{userQuestion} standalone question:`
        const answerTemplate = `You are a helpful and enthusiastic support 
        bot who can answer a given question about affect of social media based on the
         context provided and the conversation history . Try to find the answer in the context. if the answer is not in the context,
         the answer in the conversation history if possible.
         If you really don't know the answer, say "I'm sorry, I don't know the 
         answer to that." And direct the questioner to email help@social.com. 
         Don't try to make up an answer. Always speak as if you were chatting
          to a friend.
        context: {context}
        conversation history: {conv_history}
        question: {question}
        answer: `
        const llm = new ChatOllama({})
        const quesTemplate = PromptTemplate.fromTemplate(quest)
        const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

        const standaloneQuestionChain = quesTemplate
            .pipe(llm)
            .pipe(new StringOutputParser())
            

        const retrieverChain = RunnableSequence.from([
            preResult => preResult.standalone_question,
            retriever,
            combineText
        ])    

        const answerChain = answerPrompt
            .pipe(llm)
            .pipe(new StringOutputParser())
        const chain = RunnableSequence.from([
            {
                standalone_question: standaloneQuestionChain,
                original_output: new RunnablePassthrough()
            },
        

            {
            
                context: retrieverChain,
                question: ({original_output})=> original_output.userQuestion,
                conv_history:({original_output})=> original_output.conv_history
            },

            answerChain
        ])
        const res = await chain.invoke({
            userQuestion:userQuestion,
            conv_history:convhistory
        })
        console.log(res)
        return res
    }
    catch (err) {
        console.error(err)
    }
}
app.post('/',async (req:Request,res:Response)=>{
    const data = req.body.message
    const history = req.body.history
    
    const answer = await Test(data,history)
    if(answer){
        return    res.json({
                answer
            })
        }

            res.status(403).json({ message:'error' })
})


app.listen(PORT, ()=> console.log('server running on port ' + PORT))