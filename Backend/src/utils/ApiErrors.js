class ApiErrors extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message); // Call parent Error constructor

    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.errors = errors;
    this.data = null; // Always return data field in response

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiErrors };


// class ApiErrors extends Error {
//     constructor(
//       statusCode,
//       message = "Something went wrong",
//       errors = [],
//       stack = ""
//     ) {
//       super(message); // Call parent Error constructor with message
  
//       this.statusCode = statusCode;
//       this.data = null;
//       this.message = message;
//       this.success = false;
//       this.errors = errors;
  
//       if (stack) {
//         this.stack = stack;
//       } else {
//         Error.captureStackTrace(this, this.constructor);
//       }
//     }
//   }
  
//   export { ApiErrors };
  