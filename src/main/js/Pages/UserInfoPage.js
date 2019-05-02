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
			userId: props.loggedInUserId,
			username: '',
			bio: '',
			userThumbnail: '',
			reload: false,
			items: [],   // don't keep this; let categories load their own content
			userCategoryIds: []
		};
	}

	async componentDidMount() {
		try {
			let seriesRes = await fetch('/test/user/series');
			seriesRes = await seriesRes.json();
			if (seriesRes.status !== 'OK') throw new Error('Failed to fetch user\'s series');

			let changePage = this.props.changePage;

			let items = seriesRes.content.seriesList.map((series) => {
				return {
					title: series.generalBase.title,
					thumbnail: series.sketch.thumbnail,
					sketchId: series.sketch.id,
					generalBaseId: series.generalBase.id,
					contentBaseId: series.contentBase.id,
					onClick() {
						changePage('viewContentPage', {
							initialContentBaseId: series.contentBase.id,
							initialSketchId: series.sketch.id
						})
					}
				}
			});

			let userInfoRes = await fetch('/user/info');
			userInfoRes = await userInfoRes.json();
			if (userInfoRes.status !== 'OK') throw new Error('Failed to fetch current user info');

			let userThumbnail = userInfoRes.content.sketch.thumbnail;
			let username = userInfoRes.content.generalBase.title;
			let bio = userInfoRes.content.generalBase.description;
			let userCategoryIds = userInfoRes.content.user.userCategories;

			this.setState({
				items: items,
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
				let seriesRes = await fetch('/test/user/series');
				seriesRes = await seriesRes.json();
				if (seriesRes.status !== 'OK') throw new Error('Failed to fetch user\'s series');

				let changePage = this.props.changePage;

				let items = seriesRes.content.seriesList.map((series) => {
					return {
						title: series.generalBase.title,
						thumbnail: series.sketch.thumbnail,
						sketchId: series.sketch.id,
						generalBaseId: series.generalBase.id,
						contentBaseId: series.contentBase.id,
						onClick() {
							changePage('viewContentPage', {
								initialContentBaseId: series.contentBase.id,
								initialSketchId: series.sketch.id
							})
						}
					}
				});

				let userInfoRes = await fetch('/user/info');
				userInfoRes = await userInfoRes.json();
				if (userInfoRes.status !== 'OK') throw new Error('Failed to fetch current user info');

				let userThumbnail = userInfoRes.content.sketch.thumbnail;
				let username = userInfoRes.content.generalBase.title;
				let bio = userInfoRes.content.generalBase.description;

				this.setState({
					items: items,
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
		let items = this.state.items;
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
							{/*<Category items={items} title={'My Series'} loggedIn={false}/>*/}
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
