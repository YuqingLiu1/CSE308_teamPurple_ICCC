import React, {useState} from 'react'
import Heart from './Heart'
import doFetch from '../Helpers/general.js'
export default function({generalBaseId='', likedByCurrentUserColor='red', notLikedByCurrentUserColor='black'})
{
    const [likedByCurrentUser, setLikedByCurrentUser]=useState(true)
    const [numberOfLikers    , setNumberOfLikers    ]=useState(true)

    console.assert(likedByCurrentUser!==undefined && Object.getPrototypeOf(likedByCurrentUser)===Boolean.prototype)//Type checking that likedByCurrentUser is boolean

    async function updateNumberOfLikers()
    {
        setNumberOfLikers(await doFetch('/getNumlikes?id='+generalBaseId,{method:'Get'}))
    }

    async function updateLikedByCurrentUser()
    {

        setLikedByCurrentUser(await doFetch('/liked?id=' + generalBaseId, {method: 'Get'}) === 'True')
    }

    function update()
    {
        updateNumberOfLikers()
        updateLikedByCurrentUser()
    }

    async function toggle()
    {
        await doFetch('/clicklike?id='+generalBaseId,{method:'Get'})
    }

    async function onClick()
    {
        await toggle()
        update()
    }

    update()

    return <div
        style={{
            backgroundColor: "rgba(1,1,1,.2)",
            // height         : "30px",
            padding:"10px",
            borderRadius:"10px",
            // width          : "30px"
        }}>
        <Heart style={{height:"30px"}}
               onClick={onClick}
               color={likedByCurrentUser ? likedByCurrentUserColor : notLikedByCurrentUserColor}/>
        {numberOfLikers}
    </div>
}