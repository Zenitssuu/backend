// promise method
const asyncHandler = (requestHandler) => {
    return (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((err) => next(err))
    }
}

export {asyncHandler}

// const asyncHandler = ()=>{}
//higher order fn
// const aysncHandler = (fn)=>{ () => {} }
// const aysncHandler = (fn) => () => {} 

/*
try and catch method
 const asyncHandler = (fn) => async (req,res,next) => {
    try{
        await fn(req,res,next)
    }
    catch(err){
        res.status(err.code || 500).json({
            success:false,
            message:err.message
        })
    }
} 
*/