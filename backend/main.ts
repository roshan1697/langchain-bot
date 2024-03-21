import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import fs from 'fs'
import { supabaseAPI, supabaseURL } from './config'
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { ChatOllama } from "@langchain/community/chat_models/ollama"
import {PromptTemplate} from '@langchain/core/prompts'

const combineText =<T extends {pageContent:string}>(docs:T[])=> {
    return docs.map((doc)=>doc.pageContent).join('\n\n')
}

const Test = async () => {

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
        const quest = 'given a question convert it to standalone question. question:{proDes} standalone question:'
        const llm = new ChatOllama({})
        const quesTemplate = PromptTemplate.fromTemplate(quest)
        const chain = quesTemplate.pipe(llm).pipe(new StringOutputParser()).pipe(retriever).pipe(combineText )
        const res = await chain.invoke({
            proDes:'what are the effect of social media?'
        })
        console.log(res)
    }
    catch (err) {
        console.error(err)
    }
}

Test()