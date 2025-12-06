import { useState } from 'react'
import {Footer,Header} from './components/index.js';
import { Outlet } from 'react-router-dom';

function App() {
  const [reloadKey,setReloadKey]=useState(0);
  const [isLoading,setIsLoading]=useState(false);
  const handleReload=()=>{
    setIsLoading(true);
    setTimeout(()=>{
      setReloadKey(prev=>prev+1);h
      setIsLoading(false);

    },1500);
    
  }
  return (
    <div className='min-h-screen flex flex-col'>
      <Header onReload={handleReload} isLoading={isLoading}/>
      <main className='flex-1'>
        <div key={reloadKey}>
          <Outlet/>
        </div>
      </main>
      <Footer/>
    </div>
  )
   // return !loading ? (
  //     <div className=''>
  //       {/* <Header /> */}
  //       <Outlet />
  //       {/* <Footer /> */}
  //     </div>
  // ) : null
}

export default App
