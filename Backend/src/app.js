import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app= express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    methods:["GET","POST","PUT","DELETE","PATCH"],
    credentials:true
}));




app.use(express.json({limit:"16kb"}));//to parse the incoming request body in json format and to limit the size of the incoming request body to 10kb
//we use unrlencoded becuause some time in url it change to %20 or + so to avoid this we use urlencoded and to undersatand the data we use urlencoded
app.use(express.urlencoded({extended:true,limit:"16kb"}));//to parse the incoming request body in urlencoded format and to limit the size of the incoming request body to 10kb
app.use(express.static("public"));//to serve static files like images ,css files and js files
app.use(cookieParser());//to parse the cookies in the incoming request

//routes import
import adminRouter from"./router/auth.route.js"// the name is "router" but we are able to 
                                               // use it like "userRouter because we have done export default"
                                               // in user.routes.js.


//routes declaration
app.use("/api/v1/users",adminRouter)//good practice:- telling api and ites version
//this is how route work:---> http://localhost:8000/api/v1/users/register-newstudent


export{app}