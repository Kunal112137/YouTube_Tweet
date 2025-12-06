import Logo from '../Logo'
function Footer(){
    return(
        <footer className='px-4 bg-black'>
            <div className=' mx-auto flex max-w-7xl items-center justify-between border-t py-2'></div>
       <div className='mr-4 w-12 shrink-0 sm:w-16'>
        <Logo/>
       </div>
       <p className='text-sm test-white'>0{new Date().getFullYear() }YourTube. All rights reserved</p>
        </footer>
    )
}
export default Footer