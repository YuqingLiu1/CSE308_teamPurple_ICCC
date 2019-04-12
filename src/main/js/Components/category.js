import React from 'react'
import {Card} from 'react-bootstrap'
import Thumbnail from './thumbnail'
export default function({thumbnails,editable,name})
{
	console.assert(thumbnails  !==undefined && Object.getPrototypeOf(thumbnails  )===Array .prototype)
	// console.assert(numberOfRows!==undefined && Object.getPrototypeOf(numberOfRows)===Number.prototype)
	return <Card>
		<Card.Header style={{'text-align':'center'}}>{name}</Card.Header>
		<Card.Body style={{'overflow':'scroll'}}>
			<table>
				<tr>
					<td>
						<Thumbnail/>
					</td>
					<td>
						<Thumbnail/>
					</td>
					<td>
						<Thumbnail/>
					</td>
					<td>
						<Thumbnail/>
					</td>
					<td>
						<Thumbnail/>
					</td>
					<td>
						<Thumbnail/>
					</td>
					<td>
						<Thumbnail/>
					</td>
					<td>
						<Thumbnail/>
					</td>
					<td>
						<Thumbnail/>
					</td>
				</tr>
			</table>
		</Card.Body>
	</Card>;
}