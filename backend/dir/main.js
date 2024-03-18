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
const text_splitter_1 = require("langchain/text_splitter");
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_1 = require("@langchain/community/vectorstores/supabase");
const ollama_1 = require("@langchain/community/embeddings/ollama");
const Test = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield fs_1.default.promises.readFile('../public/example.txt', 'utf8');
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50
        });
        const outputText = yield splitter.createDocuments([result]);
        const supabaseClient = (0, supabase_js_1.createClient)(config_1.supabaseURL, config_1.supabaseAPI);
        yield supabase_1.SupabaseVectorStore.fromDocuments(outputText, new ollama_1.OllamaEmbeddings, {
            client: supabaseClient,
            tableName: 'documents'
        });
    }
    catch (err) {
        console.error(err);
    }
});
Test();
