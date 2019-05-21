require("@babel/polyfill")

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Menubar from './Components/Menubar';
import UserInfoPage from './Pages/UserInfoPage';
import LoggedOutCategories from './Components/loggedOutCategories';
import LoggedInCategories from './Components/loggedInCategories';
import CreateAccount from './Components/CreateAccount';
import TestFrameEditor from './Components/TestFrameEditor';
import NewSeriesPage from './Pages/NewSeriesPage';
import LoginPage from './Pages/LoginPage';
import TestPage from './Components/TestPage';
import ViewContentPage from './Pages/ViewContentPage';
import ChangePassword from './Components/ChangePassword';
import SearchResultsPage from './Pages/SearchResultsPage';
import CreateCategoryPage from './Pages/CreateCategoryPage';
import RefreshPage from './Pages/RefreshPage';

import './Helpers/globals';

class App extends Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			prevPage: '',
			prevPageData: {},
			page: 'homepage',
			pageData: {},
			loggedIn: false,
			bio: '',
			username: '',
			userInfoError: false,
			generalBaseId: '',
			loggedInUserId: '',
		}
	}

	componentDidMount()
	{
		this.refresh()
		window.changePage=this.changePage
	}

	changePage = (page, pageData) => {
		// keep track of the last page that was loaded (for refresh)
		let prevPage = this.state.page;
		let prevPageData = this.state.pageData;
		this.setState({
			prevPage: prevPage,
			prevPageData: prevPageData,
		});

		// update the page to be loaded
		this.setState({
			page: page,
			pageData: pageData
		});

		if (page === 'homepage') {
			this.refresh();
		}
	};

	refresh=async()=>
	{
		let res=await fetch('/generalBase/id')
		res    = await res.json()
		this.setState({
						  loggedIn     : res.id.length!==0,
						  generalBaseId: res.id,
					  })

		let userInfoRes=await fetch('/user/info?id')
		userInfoRes    = await userInfoRes.json()
		if(userInfoRes.status==='OK')
		{
			let userInfo=userInfoRes.content
			this.setState({
				              loggedInUserId: userInfo.user.id,
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
			//TODO From Ryan: What the heck is going on here lol, why does it always make an error?
			// Elliot: because both this else clause and the preceding else if clause are error cases; the else if
			// is just more specific about what the error is
			this.setState({userInfoError: true})
		}
	}

	login=async()=>
	{
		try
		{
			let userIdRes=await fetch('/user/id')
			userIdRes    =await userIdRes.json()
			if(userIdRes.status!=='OK')
				throw new Error('Failed to fetch current user\'s User ID')

			let loggedInUserId=userIdRes.content
			this.setState({
							  loggedIn      : true,
							  loggedInUserId: loggedInUserId
						  })
		}
		catch(err)
		{
			console.error(err)
		}
	}

	render()
	{
		let loggedInUserId   =this.state.loggedInUserId;
		let prevPage = this.state.prevPage;
		let prevPageData = this.state.prevPageData;
		let changePage = this.changePage;

		window.loggedInUserId=loggedInUserId//A bit hacky (setting a global variable here), but very useful for debugging.

		const pages={
			changePassword   : <ChangePassword    changePage={this.changePage}/>,
			create           : <CreateAccount     changePage={this.changePage}/>,
			login            : <LoginPage         changePage={this.changePage}                          login  ={this.login  } />,
			viewContentPage  :
				<ViewContentPage
					changePage={this.changePage}
					{...this.state.pageData}
					refresh={this.refresh}
					loggedInUserId={loggedInUserId}
				/>,
			searchResultsPage: <SearchResultsPage changePage={this.changePage} {...this.state.pageData} />,
			newContent       : <NewSeriesPage     changePage={this.changePage} {...this.state.pageData} />,
			editor           : <TestFrameEditor   pageData={this.state.pageData}/>,
			test             : <TestPage/>,
			homepage         :
				this.state.loggedIn ?
					<LoggedInCategories userId={loggedInUserId} changePage={this.changePage} />
						:
					<LoggedOutCategories changePage={this.changePage} />,
			userInfo        :
				<UserInfoPage
					userId={loggedInUserId}
					loggedInUserId={loggedInUserId}
					changePage={this.changePage}
					{...this.state.pageData}
				/>,
			createCategoryPage: <CreateCategoryPage changePage={this.changePage} {...this.state.pageData} />,
			refresh: <RefreshPage page={prevPage} pageData={prevPageData} changePage={changePage}/>
		}

		return <>
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
				<Menubar loggedIn={this.state.loggedIn} userId={this.state.loggedInUserId} changePage={this.changePage} />
				{pages[this.state.page]}
			</div>
			{/*<Category3/>/!*For testing*!/*/}
		</>
	}
}

ReactDOM.render(
	<App/>,
	document.getElementById('react')
)

