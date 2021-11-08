import {useEffect, useState} from 'react'

import logo from './logo.svg' 

import BuriedPoint from './buriedPoint';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  useEffect(()=>{

    const a = new BuriedPoint()

  },[])


  return (
    <div className="App">
     
      {
        [0,1,2,3,4,5,6,7,8,9].map((index)=>{
          return <div 
          key={index}
          monitor-exposure={
            JSON.stringify({
              a: index
            })
          }
          id={`id${index}`}
          onClick={()=>{
            console.log(123);
       
          }}
          >
            <img src={logo} width='136px' height='178px' />
            <span>{index}</span>
          </div>

        })
      }
    </div>
  )
}

export default App
