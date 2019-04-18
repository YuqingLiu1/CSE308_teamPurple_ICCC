import EdiText from 'react-editext'
// import InlineEdit from 'react-ions/lib/InlineEdit'
import React from 'react'
import {useState} from 'react'
import {Card, Collapse, Modal} from 'react-bootstrap'
import Thumbnail from './thumbnail'
import Button from 'react-bootstrap/Button'
import DBAwareEdiText from './DBAwareEdiText'
export default function({thumbnails, editable, title, setTitle, remove, loggedIn=true})
{
	const categoryFontSize               ='30px'
	const [notCollapsed, setNotCollapsed]=useState(true)
	const [askIfDelete, setAskIfDelete]  =useState(false)
	// console.assert(thumbnails!==undefined && Object.getPrototypeOf(thumbnails)===Array.prototype)
	// console.assert(numberOfRows!==undefined && Object.getPrototypeOf(numberOfRows)===Number.prototype)
	const removeAsker=<div className='mx-auto'>
		Are you sure you want to remove this category?
		<span>
			<Button onClick={remove} variant={'danger'}>Yes</Button>
			<Button onClick={()=>setAskIfDelete(false)}>No</Button>
		</span>
	</div>
	const cards      =<Card.Body style={{overflowX: 'scroll'}}>
		<div>
			<table>
				<tbody>
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
				</tbody>
			</table>
		</div>
	</Card.Body>
	return <Card>
		<Card.Header>
			<div style={{display: 'flex', flexDirection: 'vertical'}}>
				{!loggedIn ? <span className='mx-auto' style={{'fontSize': categoryFontSize}}>{title}</span> :
					<>
						<Button variant="danger"
								onClick={()=>setAskIfDelete(true)}>
							{<i className="fas fa-minus-circle"/>}
						</Button>
						<Button onClick={()=>setNotCollapsed(!notCollapsed)}>{notCollapsed ? '▼' : '▲'}</Button>
						<div className='mx-auto'>
							<DBAwareEdiText viewProps={{style: {fontSize: categoryFontSize}}}
								// inputProps	={{style:{'fontSize':categoryFontSize}}}
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