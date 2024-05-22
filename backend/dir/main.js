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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_1 = require("@langchain/community/vectorstores/supabase");
const ollama_1 = require("@langchain/community/embeddings/ollama");
const output_parsers_1 = require("@langchain/core/output_parsers");
const ollama_2 = require("@langchain/community/chat_models/ollama");
const prompts_1 = require("@langchain/core/prompts");
const runnables_1 = require("@langchain/core/runnables");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const PORT = '3000';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173'
}));
const combineText = (docs) => {
    return docs.map((doc) => doc.pageContent).join('\n\n');
};
const Test = (userQuestion, convhistory) => __awaiter(void 0, void 0, void 0, function* () {
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
        const quest = `given some conversation history (if any) and  a question, convert the question  to a standalone question. 
        conversation history:{conv_history}
        question:{userQuestion} standalone question:`;
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
        answer: `;
        const llm = new ollama_2.ChatOllama({});
        const quesTemplate = prompts_1.PromptTemplate.fromTemplate(quest);
        const answerPrompt = prompts_1.PromptTemplate.fromTemplate(answerTemplate);
        const standaloneQuestionChain = quesTemplate
            .pipe(llm)
            .pipe(new output_parsers_1.StringOutputParser());
        const retrieverChain = runnables_1.RunnableSequence.from([
            preResult => preResult.standalone_question,
            retriever,
            combineText
        ]);
        const answerChain = answerPrompt
            .pipe(llm)
            .pipe(new output_parsers_1.StringOutputParser());
        const chain = runnables_1.RunnableSequence.from([
            {
                standalone_question: standaloneQuestionChain,
                original_output: new runnables_1.RunnablePassthrough()
            },
            {
                context: retrieverChain,
                question: ({ original_output }) => original_output.userQuestion,
                conv_history: ({ original_output }) => original_output.conv_history
            },
            answerChain
        ]);
        const res = yield chain.invoke({
            userQuestion: userQuestion,
            conv_history: convhistory
        });
        console.log(res);
        return res;
    }
    catch (err) {
        console.error(err);
    }
});
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body.message;
    const history = req.body.history;
    const answer = yield Test(data, history);
    if (answer) {
        return res.json({
            answer
        });
    }
    res.status(403).json({ message: 'error' });
}));
app.listen(PORT, () => console.log('server running on port ' + PORT));
