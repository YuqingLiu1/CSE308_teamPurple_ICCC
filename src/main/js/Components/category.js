import EdiText from 'react-editext'
// import InlineEdit from 'react-ions/lib/InlineEdit'
import React from 'react'
import {useState} from 'react'
import {Card, Collapse, Modal} from 'react-bootstrap'
import Thumbnail from './thumbnail'
import Button from 'react-bootstrap/Button'
export default function({thumbnails, editable, title, setTitle, remove, loggedIn=true})
{
	const categoryFontSize='30px'
	const [notCollapsed,setNotCollapsed]=useState(true)
	const [askIfDelete ,setAskIfDelete ]=useState(false)
	console.assert(thumbnails!==undefined && Object.getPrototypeOf(thumbnails)===Array.prototype)
	// console.assert(numberOfRows!==undefined && Object.getPrototypeOf(numberOfRows)===Number.prototype)
	const removeAsker=<div class='mx-auto' >
			Are you sure you want to remove this category?
			<span>
			<Button onClick={remove} variant={'danger'}>Yes</Button>
			<Button onClick={()=>setAskIfDelete(false)}>No</Button>
			</span>
	</div>
	const cards=<Card.Body style={{'overflow-x': 'scroll'}}>
		<div>
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
		</div>
	</Card.Body>
	return <Card>
		<Card.Header>
			<div style={{'display': 'flex', 'flex-direction': 'vertical'}}>
				{!loggedIn ? <span class='mx-auto' style={{'font-size': categoryFontSize}}>{title}</span> :
					<>
						<Button variant="danger"
								onClick={()=>setAskIfDelete(true)}>
							{<i style={{'flex-grow': 0}}
								className="fas fa-minus-circle"/>}
						</Button>
						<Button onClick={()=>setNotCollapsed(!notCollapsed)}>{notCollapsed ? '▼' : '▲'}</Button>
						<div class='mx-auto'>
							<EdiText viewProps={{style: {'font-size': categoryFontSize}}}
								// inputProps	={{style:{'font-size':categoryFontSize}}}
									 value={title} type={'text'} onSave={alert}/>
						</div>
					</>}
			</div>
		<Collapse in={askIfDelete}>
			{removeAsker}
		</Collapse>
		</Card.Header>
		<Collapse in={notCollapsed}>
			{cards}
		</Collapse>
	</Card>
}