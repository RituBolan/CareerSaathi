const {PDFParse}= require("pdf-parse");

async function extractTextFromPdf(buffer) {
    const parser= new PDFParse({data: buffer});
    try{
        const result= await parser.getText();
        return result.text.replace(/\n/g, " ").trim();
    }finally{
        await parser.destroy();
    }
    
}

module.exports= {extractTextFromPdf};