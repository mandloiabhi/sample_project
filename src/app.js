import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

// app.use(cors())
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
    
// }))

app.use(cors({
  origin: (origin, callback) => {
    // Always allow any origin
    callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // specify the allowed HTTP methods
  credentials: true, // enable credentials (cookies, authorization headers, etc.)
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'], // specify additional headers to be exposed to the browser
}));


// i am doing configuration setting
app.use( express.json( {limit : "16kb"}))   // it says i am accepting json from request 
app.use(express.urlencoded({limit:"16kb",extended:true}))   // it is saying for how use accept data from url
app.use(express.static("public"))
app.use(cookieParser())   // this is very important  now this is middleware  


// app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true }))
// routes imports
// app.use(express.json())
import userRouter from './routes/user.routes.js'

// routes declaration
// now we are using  middle ware  as in form of app.use( )  
app.get("/arun",(req,res)=>{res.send('virat')});
app.use("/api/v1/users",userRouter);

// http://localhost:8000/api/v1/users/register   

export{app}


