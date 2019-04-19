require("@babel/polyfill")

import React, {Component} from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DBAwareEdiText from "./DBAwareEdiText"
import Image from "react-bootstrap/Image"

class Userinfo extends Component
{
	render()
	{
		if(this.props.error)
		{
			return (
				<Container className="mt-5">
					<Jumbotron>
						<Container>
							<Row className="justify-content-center">
								<p>Sorry, something went wrong <i className="far fa-frown"></i></p>
							</Row>
						</Container>
					</Jumbotron>
				</Container>
			)
		}
		else
		{
			return (
				<Container className="mt-5">
					<Jumbotron>
						<Container>
							<Row>
								<Col xs={5}>
									<div style={{textAlign: "center"}}>
										<Image src={this.props.profilePictureUrl} rounded fluid className="mb-3"/>
										<div style={{display: 'inline-block'}}>
											<DBAwareEdiText
												type="text"
												name="username"
												value={this.props.username}
												/>
										</div>
									</div>
								</Col>
								<Col xs={7}>
									<DBAwareEdiText
										inputProps={{
											rows: 5
										}}
										type="textarea"
										name="bio"
										value={this.props.bio}
									/>
								</Col>
							</Row>
						</Container>
					</Jumbotron>
				</Container>
			)
		}
	}
}

export default Userinfo