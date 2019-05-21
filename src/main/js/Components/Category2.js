import React, {Component, useState} from 'react'
import {Card, Collapse, Modal} from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import DBAwareEdiText from './DBAwareEdiText'
import CategoryCard from "./CategoryCard"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

/**
 * Props:
 *   - categoryId: String (the Category ID of this category)
 *   - changePage: function (the function that will be called when clicking on items in this category to go to a new
 *                           page)
 *   - loggedIn: boolean (whether this category is being displayed in a context where the viewer is a logged in user)
 */

// function Category2(props)
// {
//     const {categoryId,changePage}=props
//     const [name,setName]=useState('')
//     const [items,setItems]=useState([])
//     const [loading,setLoading]=useState('')
// }

export default class Category2 extends Component
{
	constructor(props)
	{
		super(props)

		this.state={
			items              : [],
			loading            : true,
			isMyCategory       : false,
			notExpandedControls: true,
			type               : '',
			creator            : '',
			searchText         : '',
			name               : '',
			myUserId           : '',
			everythingILike    : [],
			likedBy            : false,
		}
	}

	async componentDidMount()
	{
		try
		{

			let props     =this.props
			let categoryId=props.categoryId
			let changePage=props.changePage

			if(this.props.loggedIn && await window.isMyCategory(categoryId))
			{
				this.setState({isMyCategory: true})
				this.setState({myUserId: await window.getMyUserId()})
			}

			// fetch category information
			let categoryInfoRes=await fetch('/category/info?id='+categoryId)
			categoryInfoRes    = await categoryInfoRes.json()
			console.log("CATEGORY: ", categoryInfoRes)
			if(categoryInfoRes.status!=='OK') throw new Error('Failed to fetch category with ID: '+categoryId)

			let type      =categoryInfoRes.content.type
			let creator   =categoryInfoRes.content.creator
			let searchText=categoryInfoRes.content.searchText
			let name      =categoryInfoRes.content.name
			let likedBy   =categoryInfoRes.content.likedBy
			this.setState({type: type})
			this.setState({creator: creator})
			this.setState({searchText: searchText})
			this.setState({name: name})
			this.setState({likedBy: likedBy})
			this.setState({everythingILike: (await window.fetchJson('/likes/everythingILike')).content})
			let searchRes

			if(searchText==="LikedByMe")
			{
				searchRes= await fetch(`/likes/GetlikedItem?type=${type}`)
			}
			else
			{
				// use category information to search for users/content
				searchRes= await fetch('/search', {
					method : 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body   : JSON.stringify({
												type      : type,
												creator   : creator,
												searchText: searchText,

											})
				})
			}
			searchRes= await searchRes.json()
			if(searchRes.status!=='OK') throw new Error('Failed to search')

			// map the returned users/content into items that can be displayed in this category
			let users  =searchRes.content.users
			let content=[...searchRes.content.series, ...searchRes.content.episodes, ...searchRes.content.frames]
			users      =users.map((user)=>
								  {
									  return {
										  title        : user.generalBase.title,
										  thumbnail    : user.sketch.thumbnail,
										  sketchId     : user.sketch.id,
										  generalBaseId: user.generalBase.id,
										  userId       : user.user.id,
										  onClick()
										  {
											  changePage('userInfo', {
												  userId: user.user.id,
											  })
										  }
									  }
								  })
			content    =content.map((frame)=>
									{
										return {
											title        : frame.generalBase.title,
											sketchId     : frame.sketch.id,
											generalBaseId: frame.generalBase.id,
											contentBaseId: frame.contentBase.id,
											onClick()
											{
												changePage('viewContentPage', {contentBaseId: frame.contentBase.id})
											}
										}
									})

			// add the mapped users/content into this category's list of items
			this.setState({
							  name   : name,
							  items  : [...content, ...users],
							  loading: false
						  })
		}
		catch(err)
		{
			console.error(err)
		}
	}

	render()
	{

		let self          =this
		const handleDelete=()=>
		{
			if(window.confirm("Are you sure you want to delete this category?"))
			{
				window.deleteCategory(categoryId)
			}
			self.componentDidMount()
		}

		const handleChangeType=(type)=>
		{
			window.setCategoryType(categoryId, type)
			this.setState({type: type})
			self.componentDidMount()
		}

		const handleChangeSearch=()=>
		{
			const text=window.prompt("Please enter a search query for this category:\n(Current search query: '"+this.state.searchText+"')")
			if(text==null)
			{
				window.alert("Cancelled changing the category's search query")
			}
			else
			{
				window.setCategorySearchText(categoryId, text)
				this.setState({searchText: text})
				alert("Set search text to "+JSON.stringify(text))
			}
			self.componentDidMount()
		}

		let items             =this.state.items
		let loggedIn          =this.props.loggedIn
		let categoryId        =this.props.categoryId
		let name              =this.state.name
		let loading           =this.state.loading
		const categoryFontSize='30px'

		async function handleChangeCreator(creator)
		{
			if(creator==='Me')
			{
				let creator1=await window.getMyUserId()
				self.setState({creator: creator1})
				window.setCategoryCreator(categoryId, creator1)
			}
			else
			{
				// alert("That anybody made")
				self.setState({creator: null})
				window.setCategoryCreator(categoryId, null)
			}
			self.componentDidMount()
		}

		async function handleChangeLikedBy(x)
		{
			if(x==='Me')
			{
				let myUserId=await window.getMyUserId()
				self.setState({likedBy: myUserId})
				window.setCategoryLikedBy(categoryId, myUserId)
			}
			else
			{
				// alert("That anybody made")
				self.setState({likedBy: null})
				window.setCategoryLikedBy(categoryId, null)
			}
			self.componentDidMount()
		}

		const controls=<>
			<Collapse in={!this.state.notExpandedControls}>
				<div>
					<Button onClick={handleDelete}>
						Delete
					</Button>
					<span style={{width: 200, color: 'rgba(0,0,0,0)'}}>..................</span> {/*Just to separate it with a space - we can do this in nicer way later on*/}
					This category shows
					<select value={this.state.type} onChange={event=>handleChangeType(event.target.value)}>
						<option value="All" label="everything"/>
						<option value="Content" label="all content"/>
						<option value="User" label="all users"/>
						<option value="Series" label="all series"/>
						<option value="Episode" label="all episodes"/>
						<option value="Frame" label="all frames"/>
					</select>
					{
						this.state.type==='User' ? <></> :
							<select value={this.state.creator ? "Me" : "Anybody"} onChange={event=>handleChangeCreator(event.target.value)}>
								<option value="Me" label="that I made"/>
								<option value="Anybody" label="that anybody made"/>
							</select>
					}
					{/*{this.state.creator?" that I made ":" that anybody made "}*/}
					containing the search phrase
					<Button onClick={handleChangeSearch}>
						{JSON.stringify(this.state.searchText)}
					</Button>
					<select value={this.state.likedBy ? "Me" : null} onChange={event=>handleChangeLikedBy(event.target.value)}>
						<option value="Me" label=" if I liked it"/>
						<option value={null} label=" whether or not I liked it"/>
					</select>

					{/*<Button onClick={()=>alert(JSON.stringify(this.state.everythingILike))}>*/}
						{/*Everything I Like*/}
					{/*</Button>*/}

					{/*<select  value={this.state.type} onChange={event=>handleChangeType(event.target.value)}>*/}
					{/*</select>*/}
				</div>
			</Collapse>
		</>

		if(this.state.likedBy)
		{
			items=items.filter(x=>this.state.everythingILike.includes(x.generalBaseId))
		}

		const cards=<Card.Body style={{overflowX: 'scroll'}}>
			<div>
				<table>
					<tbody>
						<tr>
							{(!items.length) ? (this.state.loading?"(Still loading, please be patient...)":"(There are 0 results that match this category)") :
								items.map(x=>
										  {
											  console.log("CATEGORY RESULT", x)
											  return <td key={x.generalBaseId}>
												  {
													  x.userId ?
														  <CategoryCard userId={x.userId}
																		onClick={x.onClick}/>
														  :
														  <CategoryCard contentBaseId={x.contentBaseId}
																		onClick={x.onClick}/>
												  }
											  </td>
										  })}
						</tr>
					</tbody>
				</table>
			</div>
		</Card.Body>

		return <Card>
			<Card.Header>
				<div style={{display: 'flex', flexDirection: 'vertical'}}>
					{
						!(loggedIn && this.state.isMyCategory) ?
							<span className='mx-auto'
								  style={{'fontSize': categoryFontSize}}>
									{name}
                                </span>
							:
							<>
								<div className='mx-auto'>
									{
										loading ?
											'Loading...'
											:
											<>
												<Container>
													<Row>
														<Button onClick={()=>this.setState({notExpandedControls: !this.state.notExpandedControls})}>
															{this.state.notExpandedControls ? '▼' : '▲'}
														</Button>
														<DBAwareEdiText viewProps={{style: {fontSize: categoryFontSize}}}
																		value={name}
																		type={'text'}
																		onSave={name=>window.setCategoryName(categoryId, name)}
														/>
													</Row>
													<Row>
														{controls}
													</Row>
												</Container>
											</>
									}
								</div>
							</>
					}
				</div>
			</Card.Header>
			{cards}
		</Card>
	}
}