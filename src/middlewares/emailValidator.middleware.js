import axios from "axios";
import { ApiErrors } from "../utils/apiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import dotenv from "dotenv";
import {data} from "react-router-dom";
dotenv.config();
const ABSTRACT_API_KEY=process.env.ABSTRACT_API_KEY;
export const emailValidator=asyncHandler(async(req,res)=>{
    const {email}=req.body;
    if(!email)throw new ApiErrors(400,"Email is required");
        const response=await axios.get(`https://emailreputation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&email=${email}`
        );
        constdat=response.data;
        if(data.email.deliverability.status!=="DELIVERABLE")throw new ApiErrors(400,"invalid emial address");
      next();
})