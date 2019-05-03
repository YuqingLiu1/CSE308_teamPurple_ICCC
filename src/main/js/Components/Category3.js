import EdiText from 'react-editext'
// import InlineEdit from 'react-ions/lib/InlineEdit'
import React from 'react'
import {useState} from 'react'
import {Card, Collapse, Modal} from 'react-bootstrap'
import Thumbnail from './Thumbnail'
import Button from 'react-bootstrap/Button'
import DBAwareEdiText from './DBAwareEdiText'
import ResultThumbnail from './ResultThumbnail'
export default function({items=[{contentBaseId: 1},{contentBaseId: 2},{contentBaseId: 3}], editable, title, setTitle, remove, loggedIn=true})
{
	const categoryFontSize               ='30px'
	const [notCollapsed, setNotCollapsed]=useState(true)
	const [askIfDelete, setAskIfDelete]  =useState(false)
	const [results, setResults]  =useState([])//These are the search results
	const [query,setQuery]=useState(undefined)

	async function refreshResults()
	{
		if(query)//Don't do anything until we get the query, which will be undefined until we get a response
		{
			const results=await window.search.results()//TODO: THIS IS A STUB
			setResults(results)
		}
	}

	async function getQuery()
	{

	}

	const removeAsker=<div className='mx-auto'>
		Are you sure you want to remove this category?
		<span>
			<Button onClick={remove} variant={'danger'}>Yes</Button>
			<Button onClick={()=>setAskIfDelete(false)}>No</Button>
		</span>
	</div>
	// items=JSON.parse(await doFetch("test/user/series")).seriesList.map(x=>{return {title:x.generalBase.title,thumbnail:x.sketch.thumbnail,sketchId:x.sketch.id,generalBaseId:x.generalBase.id,contentBaseId:x.contentBase.id}})
	const thumbnails=results.map(result=>
									 <td key={JSON.stringify(result)}>
										 <ResultThumbnail result={result}/>
									 </td>)
	const cards     =<Card.Body style={{overflowX: 'scroll'}}><div><table><tbody><tr>
			{thumbnails}
		</tr></tbody></table></div></Card.Body>
	let upperLeftButtons=loggedIn ?
		<>
			<Button variant="danger" onClick={()=>setAskIfDelete(true)}>
				{<i className="fas fa-minus-circle"/>}
			</Button>
			<Button onClick={()=>setNotCollapsed(!notCollapsed)}>
				{notCollapsed ? '▼' : '▲'}
			</Button>
			<div className='mx-auto'>
				<DBAwareEdiText viewProps={{style: {fontSize: categoryFontSize}}}
								value={title}
								type={'text'}
								onSave={alert}/>
			</div>
		</>
		:
		<span className='mx-auto' style={{'fontSize': categoryFontSize}}>
			{title}
		</span>
	return <Card>
		<Card.Header>
			<div style={{display: 'flex', flexDirection: 'vertical'}}>
				{upperLeftButtons}
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