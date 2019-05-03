require("@babel/polyfill")

import React, { Component } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DBAwareEdiText from "../Components/DBAwareEdiText"
import ProfileCard from "../Components/ProfileCard"
import UploadProfilePicture from "../Components/UploadProfilePicture"
import Category from '../Components/Category'
import Category2 from "../Components/Category2";

export default class UserInfoPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			bio: '',
			userThumbnail: '',
			reload: false,
			userCategoryIds: []
		};
	}

	async componentDidMount() {
		try {
			let userId = this.props.userId;
			let userInfoRes = await fetch('/user/info?id=' + userId);
			userInfoRes = await userInfoRes.json();
			if (userInfoRes.status !== 'OK') throw new Error('Failed to fetch user info');

			let userThumbnail = userInfoRes.content.sketch.thumbnail;
			let username = userInfoRes.content.generalBase.title;
			let bio = userInfoRes.content.generalBase.description;
			let userCategoryIds = userInfoRes.content.user.userCategories;

			this.setState({
				userThumbnail: userThumbnail,
				username: username,
				bio: bio,
				userCategoryIds: userCategoryIds
			});
		} catch (err) {
			console.error(err);
		}
	}

	async componentDidUpdate() {
		if (this.state.reload) {
			try {
				let userId = this.props.userId;
				let userInfoRes = await fetch('/user/info?id=' + userId);
				userInfoRes = await userInfoRes.json();
				if (userInfoRes.status !== 'OK') throw new Error('Failed to fetch user info');

				let userThumbnail = userInfoRes.content.sketch.thumbnail;
				let username = userInfoRes.content.generalBase.title;
				let bio = userInfoRes.content.generalBase.description;

				this.setState({
					userThumbnail: userThumbnail,
					username: username,
					bio: bio,
					reload: false
				});
			} catch (err) {
				console.error(err);
			}
		}
	}

	reload = () => {
		this.setState({
			reload: true
		});
	}

	render() {
		let userThumbnail = this.state.userThumbnail;
		let username = this.state.username;
		let bio = this.state.bio;
		let userCategoryIds = this.state.userCategoryIds;
		let changePage = this.props.changePage;
		return (
			<Container className="mt-5">
				<Jumbotron>
					<Container>
						<Row>
							<Col xs={5} style={{textAlign: "center"}}>
								<Row>
									<ProfileCard
										profileThumbnailUrl={userThumbnail}
										username={username}
									/>
									<UploadProfilePicture uploadType='profile' refresh={this.reload}/>
								</Row>
							</Col>
							<Col xs={7}>
								<h1>Bio:</h1>
								{
									username &&
										<DBAwareEdiText
											inputProps={{rows: 5}}
											type="textarea"
											name="bio"
											value={bio}
										/>
								}
							</Col>
						</Row>
						<Row className='mt-5'>
							{
								userCategoryIds.map((userCategoryId) => {
									return (
										<Category2 key={userCategoryId} loggedIn={true} categoryId={userCategoryId} changePage={changePage} />
									);
								})
							}
						</Row>
					</Container>
				</Jumbotron>
			</Container>
		);
	}
}
