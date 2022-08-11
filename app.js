const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const bodyParser = require("body-parser");
const catchAsync = require('./utils/catchAsync');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors('*'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// testing with try catch
app.get("/",async(req,res,next) =>{
    try{
        res.status(200).json({
            status:true,
            message:"Working..."
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:false,
            message:err.message
        })
    }
})

//testing without try catch
app.get("/test-catch",catchAsync(async(req,res,next) =>{
    res.status(200).json({
        status:true,
        message:"testing try catch"
    })
}))


//testing AppError function
app.post("/app-error-test",catchAsync(async(req,res,next) =>{
    let name = req.body.name
    if(!name){
        next(new AppError(`Please pass name in body data`,400));
    }

    res.status(200).json({
        status:true,
        name:name
    })
}))


//handling unlisted routes
app.all('*',(req,res,next) =>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 8000;
app.listen(port,() =>{
    console.log(`App running on port ${port}...`);
});
module.exports = app;