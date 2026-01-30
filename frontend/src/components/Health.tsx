import { useEffect } from "react"

const apiurl = import.meta.env.VITE_API_URL

const Health = () => {

    useEffect(()=>{
        fetch(`${apiurl}/health`, {method : 'GET'});
    },[])

  return (
    <div>
      
    </div>
  )
}

export default Health
