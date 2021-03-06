require("@babel/polyfill")

import React, {Component} from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DBAwareEdiText from "../Components/DBAwareEdiText"
import ProfileCard from "../Components/ProfileCard"
import UploadProfilePicture from "../Components/UploadProfilePicture"
import Category from '../Components/Category'
import Category2 from "../Components/Category2"
import Button from 'react-bootstrap/Button'
import ViewMyComment from "../Components/ViewMyComment"

export default class UserInfoPage extends Component
{
	constructor(props)
	{
		super(props)

		this.state={
			generalBaseId  : '',
			username       : '',
			bio            : '',
			userThumbnail  : '',
			reload         : false,
			userCategoryIds: [],
		}
	}

	async componentDidMount()
	{
		try
		{
			let userId     =this.props.userId
			let userInfoRes=await fetch('/user/info?id='+userId)
			userInfoRes    = await userInfoRes.json()
			if(userInfoRes.status!=='OK') throw new Error('Failed to fetch user info')

			let generalBaseId  =userInfoRes.content.generalBase.id
			let userThumbnail  =userInfoRes.content.sketch.thumbnail
			let username       =userInfoRes.content.generalBase.title
			let bio            =userInfoRes.content.generalBase.description
			let userCategoryIds=userInfoRes.content.user.userCategories

			this.setState({
							  generalBaseId  : generalBaseId,
							  userThumbnail  : userThumbnail,
							  username       : username,
							  bio            : bio,
							  userCategoryIds: userCategoryIds
						  })
		}
		catch(err)
		{
			console.error(err)
		}
	}

	async componentDidUpdate()
	{
		if(this.state.reload)
		{
			try
			{
				let userId     =this.props.userId
				let userInfoRes=await fetch('/user/info?id='+userId)
				userInfoRes    = await userInfoRes.json()
				if(userInfoRes.status!=='OK') throw new Error('Failed to fetch user info')

				let generalBaseId=userInfoRes.content.generalBase.id
				let userThumbnail=userInfoRes.content.sketch.thumbnail
				let username     =userInfoRes.content.generalBase.title
				let bio          =userInfoRes.content.generalBase.description

				this.setState({
								  generalBaseId: generalBaseId,
								  userThumbnail: userThumbnail,
								  username     : username,
								  bio          : bio,
								  reload       : false
							  })
			}
			catch(err)
			{
				console.error(err)
			}
		}
	}

	reload=()=>
	{
		this.setState({
						  reload: true
					  })
	}

	handleAddCategory=(event)=>
	{
		event.preventDefault()

		this.props.changePage('createCategoryPage', {userId: this.props.userId, location: 'User'})
	}

	render()
	{
		let userThumbnail             =this.state.userThumbnail
		let username                  =this.state.username
		let bio                       =this.state.bio
		let userCategoryIds           =this.state.userCategoryIds
		let changePage                =this.props.changePage
		let loggedIn                  =this.props.loggedIn
		let generalBaseId             =this.state.generalBaseId
		let loggedInUserId            =this.props.loggedInUserId
		let profilePictureUploadButton=<>{
			loggedIn &&
			<UploadProfilePicture uploadType='profile' refresh={this.reload}/>
		}</>
		let profilePicture   =<>{
			generalBaseId &&
			<ProfileCard
				generalBaseId={generalBaseId}
				profileThumbnailUrl={userThumbnail}
				username={username}
				editable={loggedIn}
				loggedInUserId={loggedInUserId}
			/>
		}</>
		let profileBio       =<><h1>Bio:</h1>
			{
				bio &&
				(
					loggedIn ?
						<DBAwareEdiText
							inputProps={{rows: 5}}
							type="textarea"
							name="bio"
							value={bio}
						/>
						:
						<p>{bio}</p>
				)
			}</>
		let allOfMyComments  =<><h1>My Comments:</h1>
			{
				generalBaseId &&
				<ViewMyComment
					generalBaseId={generalBaseId}
				/>
			}</>
		let addCategoryButton=<>{
			loggedIn &&
			<Row>
				<Button onClick={this.handleAddCategory}>Add Category</Button>
			</Row>
		}</>
		let userCategories   =<>{
			userCategoryIds.map((userCategoryId)=>
								{
									return (
										<Category2 key={userCategoryId} loggedIn={true} categoryId={userCategoryId} changePage={changePage}/>
									)
								})
		}</>
		return (
			<Container className="mt-5">
				<Jumbotron>
					<Container>
						<Row>
							<Col xs={5} style={{textAlign: "center"}}>
								<Row>
									{profilePicture}
									{profilePictureUploadButton}
								</Row>
							</Col>
							<Col xs={7}>
								{profileBio}
								<br>
								</br>
								{allOfMyComments}
							</Col>
						</Row>
						{addCategoryButton}
						<Row className='mt-5'>
							{userCategories}
						</Row>
					</Container>
				</Jumbotron>
			</Container>
		)
	}
}
