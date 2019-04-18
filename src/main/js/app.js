require("@babel/polyfill")

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Menubar from './Components/Menubar'
import Userinfo from "./Components/Userinfo"
import LoggedOutCategories from './Components/loggedOutCategories'
import LoggedInCategories from './Components/loggedInCategories'
import LoginForm from "./Components/LoginForm"
import CreateAccount from "./Components/CreateAccount"
class App extends Component
{
	constructor(props)
	{
		super(props)
		this.state={
			page         : 'homepage',
			loggedIn     : false,
			bio          : '',
			username     : '',
			userInfoError: false
		}
		this.changePage=this.changePage.bind(this)
		this.login     =this.login.bind(this)
		this.refresh   =this.refresh.bind(this)
	}

	componentDidMount()
	{
		this.refresh()
	}

	changePage(page)
	{
		this.setState({page: page})
		this.refresh()
	}

	async refresh()
	{
		let res=await fetch('/generalBase/id')
		res    = await res.json()
		this.setState({loggedIn: res.id.length!==0})

		let userInfoRes=await fetch('/user/info')
		userInfoRes    = await userInfoRes.json()
		if(userInfoRes.status==='OK')
		{
			let userInfo=userInfoRes.content
			this.setState({bio: userInfo.bio, username: userInfo.username})
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
			create  : <CreateAccount/>,
			homepage: this.state.loggedIn ? <LoggedInCategories/> : <LoggedOutCategories/>,
			userInfo:
				<Userinfo
					bio={this.state.bio}
					username={this.state.username}
					profilePictureUrl="https://akm-img-a-in.tosshub.com/indiatoday/images/story/201804/RTX5L0IT.jpeg?qlnshqvD6xOuLhFcVvAqQ3OzqMM9ncYQ"
					error={this.state.userInfoError}
				/>,
			login   : <LoginForm changePage={this.changePage} login={this.login}/>
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

