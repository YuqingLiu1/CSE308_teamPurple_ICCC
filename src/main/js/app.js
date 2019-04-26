require("@babel/polyfill")

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Menubar from './Components/Menubar'
import ArrowButton from './Components/NavButtons/ArrowButton'
import PlusButton from './Components/NavButtons/PlusButton'
import UserInfo from "./Components/Userinfo"
import LoggedOutCategories from './Components/loggedOutCategories'
import LoggedInCategories from './Components/loggedInCategories'
import CreateAccount from "./Components/CreateAccount"
import TestFrameEditor from './Components/TestFrameEditor'
import NewContentPage from './Pages/NewContentPage'
import LoginPage from './Pages/LoginPage'
import TestPage from "./Components/TestPage";

class App extends Component
{
	constructor(props)
	{
		super(props)
		this.state     ={
			page         : 'homepage',
			loggedIn     : false,
			bio          : '',
			username     : '',
			userInfoError: false,
			generalBaseId: '',
			pageData     : null
		}
		this.changePage=this.changePage.bind(this)
		this.login     =this.login.bind(this)
	}

	componentDidMount()
	{
		this.refresh()
	}

	changePage(page, pageData)
	{
		this.setState({
			page: page,
			pageData: pageData
		})
		if(page==='homepage')
		{
			this.refresh()
		}
	}

	refresh = async () =>
	{
		let res=await fetch('/generalBase/id')
		res    = await res.json()
		this.setState({
			loggedIn: res.id.length!==0,
			generalBaseId: res.id,
		});

		let userInfoRes=await fetch('/user/info')
		userInfoRes    = await userInfoRes.json()
		if(userInfoRes.status==='OK')
		{
			let userInfo=userInfoRes.content
			this.setState({
							  bio          : userInfo.bio,
							  username     : userInfo.username,
							  userInfoError: false
						  })
		}
		else if(userInfoRes.status===403)
		{
			// user is not authorized to make the request (probably logged out)
			this.setState({userInfoError: true})
		}
		else
		{
			this.setState({userInfoError: true})
		}
	}
	login()
	{
		this.setState({loggedIn: true})
	}

	render()
	{
		const pages={
			create    : <CreateAccount changePage={this.changePage}/>,
			homepage  : this.state.loggedIn ? <LoggedInCategories/> : <LoggedOutCategories/>,
			userInfo  :
				<UserInfo
					bio={this.state.bio}
					username={this.state.username}
					profilePictureUrl={'http://localhost/generalBase/thumbnail?id=' + this.state.generalBaseId}
					error={this.state.userInfoError}
				/>,
			login     : <LoginPage changePage={this.changePage} login={this.login}/>,
			editor    : <TestFrameEditor pageData={this.state.pageData}/>,
			newContent: <NewContentPage changePage={this.changePage} />,
			test      : <TestPage />
		}
		return (
			<>
				<link
					rel="stylesheet"
					href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
					integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
					crossOrigin="anonymous"
				/>
				<link
					rel="stylesheet"
					href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
					integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
					crossOrigin="anonymous"
				/>
				<div className="App">
					<Menubar loggedIn={this.state.loggedIn} changePage={this.changePage}/>
					{pages[this.state.page]}
				</div>
			</>
		)
	}
}

ReactDOM.render(
	<App/>,
	document.getElementById('react')
)

