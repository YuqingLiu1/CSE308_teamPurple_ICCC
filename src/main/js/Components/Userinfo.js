require("@babel/polyfill")

import React, {useEffect, useState} from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DBAwareEdiText from "./DBAwareEdiText"
import ProfileCard from "./ProfileCard"
import UploadImage from "./UploadImage"
import Category from './Category'
import doFetch from '../Helpers/general.js'

export default function({bio, error, profilePictureUrl, username, changePage})
{
	const [refresh, setRefresh]=useState('false')
	const [items, setItems]=useState([{},{},{},{},{}])

	function f()
	{
		async function refreshItems()
		{
			setItems(JSON.parse(await doFetch("test/user/series")).content.seriesList.map(x=>
																				  {
																					  return {
																						  title        : x.generalBase.title,
																						  thumbnail    : x.sketch.thumbnail,
																						  sketchId     : x.sketch.id,
																						  generalBaseId: x.generalBase.id,
																						  contentBaseId: x.contentBase.id,
																						  onClick(){changePage('viewContentPage', {
																						  	  contentBaseId: x.contentBase.id,
																							  sketchId: x.sketch.id
																						  })}
																					  }
																				  }))
		}
		refreshItems()
	}

	useEffect(f)

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
						<Category items={items} title={'My Episodes'}/>
					</Row>
				</Container>
			</Jumbotron>
		</Container>
	}
}
