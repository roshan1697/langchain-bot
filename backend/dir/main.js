"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_1 = require("@langchain/community/vectorstores/supabase");
const ollama_1 = require("@langchain/community/embeddings/ollama");
const output_parsers_1 = require("@langchain/core/output_parsers");
const ollama_2 = require("@langchain/community/chat_models/ollama");
const prompts_1 = require("@langchain/core/prompts");
const Test = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const result = await fs.promises.readFile('../public/example.txt', 'utf8',)
        // const splitter = new RecursiveCharacterTextSplitter({
        //     chunkSize: 500,
        //     chunkOverlap: 50
        // })
        // const outputText = await splitter.createDocuments([result])
        const supabaseClient = (0, supabase_js_1.createClient)(config_1.supabaseURL, config_1.supabaseAPI);
        // await SupabaseVectorStore.fromDocuments(
        //     outputText,
        //     new OllamaEmbeddings,
        //     {
        //         client: supabaseClient,
        //         tableName: 'documents'
        //     }
        // )
        const embeddings = new ollama_1.OllamaEmbeddings({});
        const vectorData = new supabase_1.SupabaseVectorStore(embeddings, {
            client: supabaseClient,
            tableName: 'documents',
            queryName: 'match_documents1'
        });
        const retriever = vectorData.asRetriever();
        const quest = 'given a question convert it to standalone question. question:{proDes} standalone question:';
        const llm = new ollama_2.ChatOllama({});
        const quesTemplate = prompts_1.PromptTemplate.fromTemplate(quest);
        const chain = quesTemplate.pipe(llm).pipe(new output_parsers_1.StringOutputParser()).pipe(retriever);
        const res = yield chain.invoke({
            proDes: 'what are the effect of social media?'
        });
        console.log(res);
    }
    catch (err) {
        console.error(err);
    }
});
Test();
