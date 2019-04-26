require("@babel/polyfill")

import React, {useState} from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DBAwareEdiText from "./DBAwareEdiText"
import ProfileCard from "./ProfileCard"
import UploadImage from "./UploadImage"
import Category from './Category'

export default function({bio, error, profilePictureUrl, username})
{
	const [refresh, setRefresh]=useState('false')
	if(refresh)
	{
		setRefresh(false)
		return <></>
	}
	if(error)
	{
		return <Container className="mt-5">
			<Jumbotron>
				<Container>
					<Row className="justify-content-center">
						<p>Sorry, something went wrong :(<i className="far fa-frown"/></p>
					</Row>
				</Container>
			</Jumbotron>
		</Container>
	}
	else
	{
		return <Container className="mt-5">
			<Jumbotron>
				<Container>
					<Row>
						<Col xs={5}>
							<div style={{textAlign: "center"}}>
								<ProfileCard
									profileThumbnailUrl={profilePictureUrl}
									username={username}
								/>
								<UploadImage uploadType='profile' refresh={()=>setRefresh(true)}/>
							</div>
						</Col>
						<Col xs={7}>
							<h1>Bio:</h1>
							<DBAwareEdiText
								inputProps={{rows: 5}}
								type="textarea"
								name="bio"
								value={bio}
							/>
						</Col>
					</Row>
					<Row className='mt-5'>
						<Category/>
					</Row>
				</Container>
			</Jumbotron>
		</Container>
	}
}
