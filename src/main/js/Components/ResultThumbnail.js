import React from 'react'
import {Card} from 'react-bootstrap'
import Thumbnail from './Thumbnail'
function linkToGeneralBaseId(generalBaseId)
{
	alert('Calling linkToGeneralBaseId in ResultThumbnail.js. This function is a stub. Replace it with something that would set the current page to whoever/whatever owns '+generalBaseId)
}
//This component takes a search result and turns it into a thumbnail.
export default function(props)
{
	const {result:{type,sketch:{thumbnail},generalBase:{id,title}}}=props
	return <Thumbnail {...props}
					  {...{type,title}}
					  imageURL={thumbnail}
					  onClick={()=>linkToGeneralBaseId(id)}
					  />
}
//A search result might look something like this:
//		contentBase: {id: "5cc8f8230e5732259b3501bb", generalBaseRef: "5cc8f8230e5732259b3501ba", author: "5cc8d85a0e57322500d6ab11", type: "Series", contributable: false, …}
//		generalBase:
//		children: ["5cc9b68b0e57322942f45850"]
//		comments: Array(0)
//		length: 0
//		__proto__: Array(0)
//		dateCreated: "2019-05-01T01:36:35.953+0000"
//		dateLastEdited: "2019-05-01T01:36:35.953+0000"
//		description: "What it's like to go to school."
//		id: "5cc8f8230e5732259b3501ba"
//		likers: Array(0)
//		length: 0
//		__proto__: Array(0)
//		sketch: "5cc8f8240e5732259b3501bc"
//		title: "School"
//		type: "ContentBase"
//		typeRef: "5cc8f8230e5732259b3501bb"
//		__proto__: Object
//		sketch:
//		data: "{"version":"2.4.3","objects":[{"type":"rect","version":"2.4.3","originX".........(etc, very long line).............
//		id: "5cc8f8240e5732259b3501bc"
//		thumbnail: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlYA"
//		__proto__: Object
//		type: "Series"
//		user: null
