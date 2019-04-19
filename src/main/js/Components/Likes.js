import React, {useState} from 'react'
import Heart from './Heart'
export default function({generalBaseId='Stub', likedByCurrentUserColor='red', notLikedByCurrentUserColor='black'})
{
	const [likedByCurrentUser, setLikedByCurrentUser]=useState(true)//This should fetch whether a user likedByCurrentUser this or not
	console.assert(likedByCurrentUser!==undefined&&Object.getPrototypeOf(likedByCurrentUser)===Boolean.prototype)//Type checking that likedByCurrentUser is boolean
	return <div style={{
		backgroundColor: "Green",
		height         : "300px",
		width          : "300px"
	}}>
		<Heart/>
	</div>
}