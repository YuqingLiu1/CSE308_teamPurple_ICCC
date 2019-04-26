import React, {useState} from 'react'
import Heart from './Heart'
import doFetch from '../Helpers/general.js'
export default function({generalBaseId='5cb0a38f799a830d030811fe', likedByCurrentUserColor='red', notLikedByCurrentUserColor='black'})
{
    const [likedByCurrentUser, setLikedByCurrentUser]=useState(true)//This should fetch whether a user likedByCurrentUser this or not
    console.assert(likedByCurrentUser!==undefined && Object.getPrototypeOf(likedByCurrentUser)===Boolean.prototype)//Type checking that likedByCurrentUser is boolean
    function toggleLikedByCurrentUser()
    {
        setLikedByCurrentUser(!likedByCurrentUser)
    }
    //
    async function Setcolor() {
        var re=JSON.parse(await doFetch('/clicklike?id='+generalBaseId,{method:'Get'}))
        console.log(re)
        if(re.status==='OK'){
            console.log('get')
            setLikedByCurrentUser(!likedByCurrentUser)
        }
    }


    return <div
        style={{
            backgroundColor: "rgba(1,1,1,.2)",
            // height         : "30px",
            padding:"10px",
            borderRadius:"10px",
            // width          : "30px"
        }}>
        <Heart style={{height:"30px"}}
               onClick={Setcolor}
               color={likedByCurrentUser ? likedByCurrentUserColor : notLikedByCurrentUserColor}/>
        12389
    </div>
}