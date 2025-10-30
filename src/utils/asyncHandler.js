// Two ways to write down promise and try-catch(using async await)
// asyncHandler utility
// asyncHandler utility to wrap async route handlers
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export { asyncHandler };

// 2nd way
// const asyncHandler=(fc)=>async(req,res,next)=>{
// try{

// }catch(error){
//     res.status(error.code || 500).json({
//         success:false,
//         message:error.message
//     })
// }
// }



// export {asyncHandler}