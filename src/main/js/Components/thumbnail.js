import React from 'react'
import {Card} from 'react-bootstrap'
const defaultImageURL='https://www.petmd.com/sites/default/files/Acute-Dog-Diarrhea-47066074.jpg'
const defaultTitle   ='Untitled'
const defaultOnClick =()=>alert("defaultOnClick Test")
export default function({title=defaultTitle, imageURL=defaultImageURL, onClick=defaultOnClick})
{
	console.assert(title!==undefined && Object.getPrototypeOf(title)===String.prototype)
	console.assert(imageURL!==undefined && Object.getPrototypeOf(imageURL)===String.prototype)
	console.assert(onClick!==undefined && Object.getPrototypeOf(onClick)===Function.prototype)
	return <Card style={{width: '18rem', cursor: 'pointer'}} onClick={onClick}>
		<Card.Img variant="top" src={imageURL}/>
		<Card.Footer style={{'textAlign': 'center'}}>{title}</Card.Footer>
	</Card>
}