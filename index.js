import express, { urlencoded, json } from 'express';
import { Schema, model, connect } from 'mongoose';
import { join } from 'path';
import { generate } from 'shortid';

const app = express();

const port = 6000;



app.use(urlencoded({extended:true}))
app.use(json());

let shortId = generate();

const userSchema = new Schema({
    shortURL:{
        type: String,
        required :true,
        unique:true,
    },
    redirectionURL:{
    type:String,
    required:true,
}
});
const URL = model('URL',userSchema);

connect("mongodb://127.0.0.1:27017/url")
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log("Error connecting to database",err)
})


app.get('/',(req,res)=>{
    res.sendFile(join(__dirname,'index.html'));
})

app.post('/url',async(req,res)=>{
    const longURL = req.body.url;
    await URL.create({
        shortURL : shortId,
        redirectionURL: longURL
    })
    res.send(`<p>Your Short URL is <a href="${shortId}">http://localhost:1000/${shortId}<p>`);
})


app.get('/:shortURL',async(req,res)=>{
    const shortURL = req.params.shortURL;
    const url = await URL.findOne({shortURL :shortURL});
    res.redirect(url?.redirectionURL)
})

app.listen(port,()=>{
    console.log("server started at 1000")
})