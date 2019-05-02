require("@babel/polyfill")

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Menubar from './Components/Menubar'
import ArrowButton from './Components/NavButtons/ArrowButton'
import PlusButton from './Components/NavButtons/PlusButton'
import UserInfo from "./Pages/UserInfoPage"
import LoggedOutCategories from './Components/loggedOutCategories'
import LoggedInCategories from './Components/loggedInCategories'
import CreateAccount from './Components/CreateAccount'
import TestFrameEditor from './Components/TestFrameEditor'
import NewSeriesPage from './Pages/NewSeriesPage'
import LoginPage from './Pages/LoginPage'
import TestPage from './Components/TestPage'
import ViewContentPage from './Pages/ViewContentPage'
import ChangePassword from './Components/ChangePassword'
import SearchResultsPage from './Pages/SearchResultsPage'

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
			loggedInUserId: '',
			pageData     : {}
		}
	}

	componentDidMount()
	{
		this.refresh()
	}

	changePage = (page, pageData) =>
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

	login = async () =>
	{
		try {
			let userIdRes = await fetch('/user/id');
			userIdRes = await userIdRes.json();
			if (userIdRes.status !== 'OK') throw new Error('Failed to fetch current user\'s User ID');

			let loggedInUserId = userIdRes.content;

			this.setState({
				loggedIn: true,
				loggedInUserId: loggedInUserId
			});
		} catch (err) {
			console.error(err);
		}
	}

	render()
	{
		let loggedInUserId = this.state.loggedInUserId;
		const pages={
			changePassword : <ChangePassword changePage={this.changePage} />,
			create    : <CreateAccount changePage={this.changePage}/>,
			homepage  : this.state.loggedIn ? <LoggedInCategories/> : <LoggedOutCategories/>,
			userInfo  :
				<UserInfo
					loggedInUserId={loggedInUserId}
					bio={this.state.bio}
					username={this.state.username}
					error={this.state.userInfoError}
					changePage={this.changePage}
				/>,
			login     : <LoginPage changePage={this.changePage} login={this.login}/>,
			editor    : <TestFrameEditor pageData={this.state.pageData}/>,
			newContent: <NewSeriesPage changePage={this.changePage} {...this.state.pageData} />,
			test      : <TestPage />,
			viewContentPage: <ViewContentPage changePage={this.changePage} refresh={this.refresh} {...this.state.pageData} />,
			searchResultsPage: <SearchResultsPage changePage={this.changePage} {...this.state.pageData} />
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

