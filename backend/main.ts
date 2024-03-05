import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'


const Test = async() =>{

    try {
        const filePath = 'file://example.txt'
        const result = await fetch(filePath) 
        const text = await result.text()

        const splitter = new RecursiveCharacterTextSplitter()
        const output = await splitter.createDocuments([text])
        console.log(output)
    } 
    catch (err) {
     console.error(err)
    }
}

Test()