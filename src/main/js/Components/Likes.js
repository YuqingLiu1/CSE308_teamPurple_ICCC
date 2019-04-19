import React, {useState} from 'react'
import Heart from './Heart'
export default function({generalBaseId='Stub', likedByCurrentUserColor='red', notLikedByCurrentUserColor='black'})
{
	const [likedByCurrentUser, setLikedByCurrentUser]=useState(true)//This should fetch whether a user likedByCurrentUser this or not
	console.assert(likedByCurrentUser!==undefined && Object.getPrototypeOf(likedByCurrentUser)===Boolean.prototype)//Type checking that likedByCurrentUser is boolean
	function toggleLikedByCurrentUser()
	{
		setLikedByCurrentUser(!likedByCurrentUser)
	}
	//
	return <div
		style={{
			backgroundColor: "rgba(1,1,1,.2)",
			// height         : "30px",
			padding:"10px",
			borderRadius:"10px",
			// width          : "30px"
		}}>
		<Heart style={{height:"30px"}}
				onClick={toggleLikedByCurrentUser}
			   color={likedByCurrentUser ? likedByCurrentUserColor : notLikedByCurrentUserColor}/>
		12389
	</div>
}