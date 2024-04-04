import { Error } from "mongoose";

class apiError extends Error{
    constructor(
        stausCode,
        messsage = "something went wrong",
        errors=[],
        stack=""

    ){
        super(this.message)
        this.statusCOde = stausCode
        this.data = null
        this.message = messsage
        this.success = false;
        this.errors = errors


        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
};

export {apiError}