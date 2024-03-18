import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'
import fs from 'fs'
import { supabaseAPI,supabaseURL } from './config'
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";



const Test = async() =>{

    try {
        
       const result =  await fs.promises.readFile('../public/example.txt', 'utf8' , )
        

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap:50
        })
        const outputText = await splitter.createDocuments([result])
        const supabaseClient = createClient(supabaseURL,supabaseAPI)

        await SupabaseVectorStore.fromDocuments(
            outputText,
            new OllamaEmbeddings,
            {
                client:supabaseClient,
                tableName:'documents'
            }
        )
       
      
      

    } 
    catch (err) {
     console.error(err)
    }
}

Test()