import {RefreshCw} from 'lucide-react'
const RelaodBtn=({ isLoading=false,onRelaod})=>{
    return(
        <button onClick={onRelaod}
        disabled={isLoading}
        className={`flex item-center justify-center rounded-lg transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 foucs:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed p-2`} arial-label="Reload content">
                <RefreshCw  size={20} className={`${isLoading ? 'animated-spin': ''}`} />
        </button>
    )
}
export default RelaodBtn;
