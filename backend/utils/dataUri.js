import DataURIParser from "datauri/parser.js";
import path from "path";
const parser = new DataURIParser();


const getDataUri=async(file)=>{
    const extension = path.extname(file.originalname).toString();
    return parser.format(extension,file.buffer).content;
}

export default getDataUri;