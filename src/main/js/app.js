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
			pageHistory: ['homepage'],
			pageDataHistory: [{}],
			pageIndex: 0,
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

	backPage = () => {
		let newPageIndex = this.state.pageIndex;
		newPageIndex = newPageIndex > 0 ? newPageIndex - 1 : newPageIndex;
		this.setState({
			pageIndex: newPageIndex,
		});
	}

	changePage = (page, pageData) => {
		// if refresh page was last page, remove it and don't add the current page (because it would be a duplicate)
		let newPageIndex = this.state.pageIndex;
		let newPageHistory = this.state.pageHistory;
		let newPageDataHistory = this.state.pageDataHistory;
		if (newPageIndex > 0) {
			if (newPageHistory[newPageIndex] === 'refresh') {
				newPageHistory.splice(newPageIndex);
				newPageDataHistory.splice(newPageIndex);
				newPageIndex = newPageIndex - 1;
				this.setState({
					pageHistory: newPageHistory,
					pageDataHistory: newPageDataHistory,
					pageIndex: newPageIndex,
				});
				if (page === 'homepage') {
					this.refresh();
				}
				return;
			}
		}

		// if refresh page wasn't the last page, then add the new page (and page data) to the history;
		// also make sure to remove any history after the current page index (to maintain back button consistency)
		newPageIndex = newPageIndex + 1;
		newPageHistory.splice(newPageIndex);
		newPageDataHistory.splice(newPageIndex);
		newPageHistory.push(page);
		newPageDataHistory.push(pageData);
		this.setState({
			pageHistory: newPageHistory,
			pageDataHistory: newPageDataHistory,
			pageIndex: newPageIndex,
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
		let pageIndex = this.state.pageIndex;
		let page = this.state.pageHistory[pageIndex];
		let pageData = this.state.pageDataHistory[pageIndex];
		let prevPage = pageIndex > 0 ? this.state.pageHistory[pageIndex - 1] : 'homepage';
		let prevPageData = pageIndex > 0 ? this.state.pageDataHistory[pageIndex - 1] : {};
		let changePage = this.changePage;

		window.loggedInUserId=loggedInUserId//A bit hacky (setting a global variable here), but very useful for debugging.

		const pages={
			changePassword   : <ChangePassword    changePage={this.changePage}/>,
			create           : <CreateAccount     changePage={this.changePage}/>,
			login            : <LoginPage         changePage={this.changePage}                          login  ={this.login  } />,
			viewContentPage  :
				<ViewContentPage
					changePage={this.changePage}
					{...pageData}
					refresh={this.refresh}
					loggedInUserId={loggedInUserId}
				/>,
			searchResultsPage: (
				<SearchResultsPage
					changePage={this.changePage}
					{...pageData}
				/>),
			newContent: (
				<NewSeriesPage
					changePage={this.changePage}
					{...pageData}
				/>),
			editor: (
				<TestFrameEditor
					pageData={pageData}
				/>),
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
					{...pageData}
				/>,
			createCategoryPage: (
				<CreateCategoryPage
					changePage={this.changePage}
					{...pageData}
				/>),
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
				<Menubar
					loggedIn={this.state.loggedIn}
					userId={this.state.loggedInUserId}
					changePage={this.changePage}
					backPage={this.backPage}
				/>
				{pages[page]}
			</div>
		</>
	}
}

ReactDOM.render(
	<App/>,
	document.getElementById('react')
)

