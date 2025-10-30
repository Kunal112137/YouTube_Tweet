import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // use promise-based fs

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // ✅ delete local file after successful upload
    await fs.unlink(localFilePath);

    return response;
  } catch (error) {
    // delete even if upload failed
    try {
      await fs.unlink(localFilePath);
    } catch (e) {
      console.warn("Failed to delete temp file:", e.message);
    }
    return null;
  }
}
  export const DeleteFile=async(publicId)=>{
    try{
      const result=await cloudinary.uploader.destroy(publicId);
      return result;
    }catch(error){
      console.error("src::utilis:: cloudinary::DeleteFile",error);
      throw error;
    }

};
export { uploadCloudinary };


// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs/promises"; // use promise-based fs

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadCloudinary = async (localFilePath) => {
//   if (!localFilePath) return null;

//   try {
//     // Upload file to Cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });

//     console.log("✅ File uploaded to Cloudinary:", response.url);

//     // Remove local file after upload
//     await fs.unlink(localFilePath);

//     return response;
//   } catch (error) {
//     console.error("❌ Cloudinary upload failed:", error.message);

//     // Remove local file if upload fails
//     try {
//       await fs.unlink(localFilePath);
//     } catch (err) {
//       console.error("Failed to delete local file:", err.message);
//     }

//     return null;
//   }
// };

// export { uploadCloudinary };



// import { v2 as cloudinary } from 'cloudinary'
// import fs from "fs"
// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEYS,
//     api_secret:process.env.CLOUDINARY_API_SECRETS
//   });

//   const uploadCloudinary=async(localFilePath)=>{
//     try{
//       if(!localFilePath) return null
//       // upload the file on cloudinary
//       const response= await cloudinary.uploader.upload(localFilePath,{
//         resource_type:"auto"
//       })
//       console.log("file is uploaded on cloudinary", response.url)
//       return response;
//       fs.unlink(localFilePath)
//       // fs.unlinkSync(localFilePath)

//     }
//     catch(error){
//       fs.unlinkSync(localFilePath)   // remove the locally saved
//       // temporary file as the upload operation got failed
//       return null;

//     }
//   }
//   export {uploadCloudinary}

  