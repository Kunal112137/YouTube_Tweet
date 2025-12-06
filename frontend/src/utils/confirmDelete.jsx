import toast  from "react-hot-toast";
export const ConfirmDelete=(onConfirm)=>{
    toast((t)=>(
        <span>
            <h1 className="font-serif text-sm">Are you sure you want to delete this Playlist ?   </h1>
                <button onClick={()=>{
                    toast.dismiss(t.id);
                    onConfirm();
                    toast.success("Playlist deleted !");
                }}
                className="mt-2 mr-2 p-2 py-1 bg-red-500 text-white rounded"
                > Yes
                    
                </button>
                <button onClick={()=>toast.dismiss(t.id)} className="mt-2 px-2 py-1 bg-gray-300 rounded">
                    No
                </button>
         
        </span>
    ),{
        duration:500,
    });
};