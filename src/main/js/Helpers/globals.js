//Everything in this JS file should be exposed to and accessed through the 'window' object
//This is because it's easy, uses the global namespace, and makes this code reusable even without babel.
//The point of these functions is to make reading my code easier. This is because the names are very descriptive (hopefully)

//GENERAL HELPER FUNCTIONS:------------------------------------------------------------
window.isArray=function(x)
{
	return x!==undefined&&x!==null&&Object.getPrototypeOf(x)===Array.prototype
}
window.isString=function(x)
{
	return x!==undefined&&x!==null&&Object.getPrototypeOf(x)===String.prototype
}
window.isObject=function(x)
{
	return x!==undefined&&x!==null&&Object.getPrototypeOf(x)===Object.prototype
}
window.assertIsArray=function(x)
{
	console.assert(isArray(x),'x is not an array! x=',x)
}
window.assertIsString=function(x)
{
	console.assert(isString(x),'x is not a string! x=',x)
}
window.assertIsObject=function(x)
{
	console.assert(isObject(x),'x is not an object! x=',x)
}
window.all=function(array,condition=x=>x)
{
	//This function works just like python's builtin function 'all'.
	//Examples:
	//	all([true,true,true]) === true
	//	all([true,true,false]) === false  (because true && true && true)
	//	all([1,2,3,4],x=>x<5)  === true
	//	all([1,2,3,6],x=>x<5)  === false
	assertIsArray(array)
	for(const element of array)
		if(!condition(element))
			return false
	return true
}
window.areAllArrays=function(...args)
{
	return all(args,isArray)
}
window.areAllStrings=function(...args)
{
	return all(args,isString)
}
window.areAllObjects=function(...args)
{
	return all(args,isObject)
}
window.assertAreAllArrays=function(...args)
{
	console.assert(areAllArrays(...args),'Not all arguments were pure arrays! args=',args)
}
window.assertAreAllStrings=function(...args)
{
	console.assert(areAllStrings(...args),'Not all arguments were pure strings! args=',args)
}
window.assertAreAllObjects=function(...args)
{
	console.assert(areAllObjects(...args),'Not all arguments were pure objects! args=',args)
}
window.flattenedArray=function(arrayOfArrays)
{
	//Turns [[1,2,3],[4,5,6],[[7],[8],[9]]] into [1,2,3,4,5,6,[7],[8],[9]]
	assertIsArray(arrayOfArrays)
	assertAreAllArrays(...arrayOfArrays)
	let out=[]
	for(const array of arrayOfArrays)
		out=out.concat(array)
	return out
}
window.annoyingDialogSelector=function(options,{allow_cancel=false}={})
{
	//This is a hacky solution. Don't seriously use this lol
	assertIsArray(options)
	while(true)
	{
		const response=prompt('Please choose one of the following options:\n'+JSON.stringify(options))
		if(response===null&&allow_cancel)
		{
			return null
		}
		if(options.includes(response))
		{
			return response
		}
	}
}
window.fetchJson=async function(url,body)
{
	//Body is an optional parameter, meaning you don't have to specify it.
	//But, if it IS specified, it must be a javascript Object (not a string, number etc).
	//If body is specified, this method will send a POST request. Otherwise, it will send a GET request.
	//This method will return the JSON.parse'd form of whatever the server gives back (probably an Object)
	console.assert(!body||typeof body==='object','Invalid body type! Must either be undefined or an object')
	console.assert(url!==undefined,'Must specify a URL!')
	try
	{
		const response = await fetch(url,
									 {
										 method:body?'POST':'GET',
										 body:JSON.stringify(body),
										 headers:
											 {
												 "Content-Type": "application/json",
											 }
									 })
		const responseText=await response.text()
		try
		{
			return JSON.parse(responseText)
		}
		catch
		{
			console.error('RESPONSE RETURN INVALID JSON: response was',responseText)
			return responseText
		}
	}
	catch (err)
	{
		console.log('FETCH FAILED: url=',url,'body=',body)
	}
}

//ICCC-SPECIFIC HELPER FUNCTIONS:------------------------------------------------------------
//TODO Most of the below functions do NOT handle server response not OK errors. They should in the future.

window.search={
	//The functions 'response', 'results', and 'thumbnails' process a search query progressively, allowing you to debug intermediate steps.
	async response(request={})
	{
		//Just the raw response we get from the server; no post-processing whatsoever
		const defaults={type:'All',creator:null,searchText:'',likedBy:null,...request}
		const response=await window.fetchJson('search',{...defaults,...request})
		if(response.status!=='OK')
		{
			console.error('Search response status was not "OK"!\nRequest:',request,'\nResponse:',response)
			//Even if the response is not "OK" (it might even be undefined), the show MUST go on. We return the response anyway.
			//All functions (such as search.results) that use this search.response function operate under the assumption that the results are ok to use.
		}
		return await window.fetchJson('search',{...defaults,...request})
	},
	async results(query={})
	{
		//Just like search.response, except we discard information we don't need, and give a list of results instead of a dictionary
		const response=await search.response(query)
		return flattenedArray(Object.values(response.content))
	},
}

window.isLoggedIn=async function()
{
	//If no user is logged in, GET /user/info?id should return {"status":"error","content":"No User ID provided and no logged in user"}
	return (await fetchJson("/user/info?id")).status!=='error'
}
window.getCategoryInfoFromId=async function(categoryId)
{
	let response=await fetchJson('/category/info?id='+categoryId)
	console.assert(response.status==='OK','ERROR: response=',response)
	return response.content
}
window.getCategoriesFromCategoryIds=async function(categoryIds)
{
	assertIsArray(categoryIds)
	return await Promise.all(categoryIds.map(getCategoryInfoFromId))//Asynchronously await all of these at once
}
window.getLoggedInUserCategoryIds=async function()
{
	return (await fetchJson('/user/info')).content.user.userCategories
}
window.getLoggedInHomeCategoryIds=async function()
{
	return (await fetchJson('/user/info')).content.user.homeCategories
}
window.getLoggedInHomeCategories=async function()
{
	return (await getCategoriesFromCategoryIds(await getLoggedInHomeCategoryIds())).filter(isObject)//Errors are returned as strings and not objects. Skip them.
}
window.getLoggedInUserCategories=async function()
{
	return (await getCategoriesFromCategoryIds(await getLoggedInUserCategoryIds())).filter(isObject)
}

window.deleteCategory=async function(categoryId)
{
	console.assert(arguments.length ===1       ,'Wrong number of arguments'  )
	console.assert(typeof categoryId==='string','categoryId must be a string')
	return await window.fetchJson('/category/delete?id='+categoryId)
}

window.setCategoryParameter=async function(categoryId,parameterName,parameterValue)
{
	console.log(categoryId,parameterName,parameterValue)
	console.assert(arguments.length    ===3       ,'Wrong number of arguments'     )
	console.assert(typeof parameterName==='string','parameterName must be a string')
	console.assert(typeof categoryId   ==='string','categoryId must be a string'   )
	const categoryInfo=await window.getCategoryInfoFromId(categoryId)
	console.log(JSON.stringify(categoryInfo))
	return await window.fetchJson('/category/edit',{...categoryInfo,[parameterName]:parameterValue})//We simply wait for the refresh-loop to update the gui (it's pretty slow, but it works)
}

window.setCategoryName=async function(categoryId,name)
{
	console.assert(arguments.length ===2       ,'Wrong number of arguments'  )
	console.assert(typeof name      ==='string','name must be a string'      )
	console.assert(typeof categoryId==='string','categoryId must be a string')
	return await setCategoryParameter(categoryId,'name',name)
}
window.setCategorySearchText=async function(categoryId,searchText)
{
	console.assert(arguments.length ===2       ,'Wrong number of arguments'  )
	console.assert(typeof searchText==='string','searchText must be a string')
	console.assert(typeof categoryId==='string','categoryId must be a string')
	return await setCategoryParameter(categoryId,'searchText',searchText)
}
window.setCategoryCreator=async function(categoryId,creator)
{
	console.assert(arguments.length ===2       ,'Wrong number of arguments'  )
	console.assert(typeof categoryId==='string','categoryId must be a string')
	let out=await setCategoryParameter(categoryId,'creator',creator)
	// alert("OUT")
	return out

}
window.setCategoryLikedBy=async function(categoryId,likedBy)
{
	console.assert(arguments.length ===2       ,'Wrong number of arguments'  )
	console.assert(typeof categoryId==='string','categoryId must be a string')
	let out=await setCategoryParameter(categoryId,'likedBy',likedBy)
	// alert("OUT")
	return out

}
window.setCategoryType=async function(categoryId,type)
{
	console.assert(arguments.length ===2       ,'Wrong number of arguments'  )
	console.assert(typeof type      ==='string','type must be a string'      )
	console.assert(typeof categoryId==='string','categoryId must be a string')
	console.assert(['All','User','Series','Episode','Frame'].includes(type),'Type '+JSON.stringify(type)+' is not a valid category type')
	return await setCategoryParameter(categoryId,'type',type)
}

window.getUserInfo=async function(userId)
{
	console.assert(arguments.length ===1       ,'Wrong number of arguments')
	console.assert(typeof userId    ==='string','userId must be a string'  )
	return await window.fetchJson('/user/info?id='+userId)
}
window.getUserTitle=async function(userId)
{
	console.assert(arguments.length ===1       ,'Wrong number of arguments')
	console.assert(typeof userId    ==='string','userId must be a string'  )
	return (await getUserInfo(userId)).content.generalBase.title
}

window.getContentAuthor=async function(contentId)
{
	//Return the userId of the author of some contentId
	console.assert(arguments.length ===1       ,'Wrong number of arguments' )
	console.assert(typeof contentId ==='string','contentId must be a string')
	return (await getContentInfo(contentId)).content.contentBase.author
}
window.getContentAuthorTitle=async function(contentId)
{
	//Return the userId of the author of some contentId
	console.assert(arguments.length ===1       ,'Wrong number of arguments' )
	console.assert(typeof contentId ==='string','contentId must be a string')
	return await getUserTitle(await getContentAuthor(contentId))
}

window.goToContentAuthor=async function(contentId)
{
	//Go to the user page of the author of some contentId
	console.assert(arguments.length ===1       ,'Wrong number of arguments' )
	console.assert(typeof contentId ==='string','contentId must be a string')
	return window.goToUserPage(await window.getContentAuthor(contentId))
}

window.goToUserPage=async function(userId)
{
	//A void function
	console.assert(arguments.length ===1       ,'Wrong number of arguments')
	console.assert(typeof userId    ==='string','userId must be a string'  )
	window.changePage('userInfo', {userId})//This variable is made global in app.js
}

window.getContentInfo=async function(contentId)
{
	console.assert(arguments.length ===1       ,'Wrong number of arguments' )
	console.assert(typeof contentId ==='string','contentId must be a string')
	return await window.fetchJson('/content/info?id='+contentId)
}

window.getMyUserInfo=async function()
{
	console.assert(arguments.length ===0       ,'Wrong number of arguments' )
	//Get user info of the logged in user
	return await window.fetchJson('/user/info?id')//Get info about the current user
}

window.getMyUserId=async function()
{
	console.assert(arguments.length ===0       ,'Wrong number of arguments' )
	//Get the userId of the logged in user
	return (await window.getMyUserInfo()).content.user.id
}

window.isMyContent=async function(contentId)
{
	console.assert(arguments.length ===1       ,'Wrong number of arguments' )
	console.assert(typeof contentId ==='string','contentId must be a string')
	//return true IFF the current logged in user is the author of the contentId
	if(!await isLoggedIn())return false
	return await window.getContentAuthor(contentId)===await window.getMyUserId()
}

window.getCategoryUserId=async function(categoryId)
{
	console.assert(arguments.length ===1       ,'Wrong number of arguments'  )
	console.assert(typeof categoryId==='string','categoryId must be a string')
	//Get the user that created this category
	return (await window.getCategoryInfoFromId(categoryId)).userRef
}

window.isMyUserId=async function(userId)
{
	console.assert(arguments.length ===1       ,'Wrong number of arguments')
	console.assert(typeof userId    ==='string','userId must be a string'  )
	if(!await isLoggedIn())return false
	return await getMyUserId()===userId
}

window.isMyCategory=async function(categoryId)
{
	console.assert(arguments.length ===1       ,'Wrong number of arguments'  )
	console.assert(typeof categoryId==='string','categoryId must be a string')
	if(!await isLoggedIn())return false
	//Returns true IFF the logged in user owns that category ID
	return await isMyUserId(await getCategoryUserId(categoryId))
}

window.getWhoLikedUser=async function(userId)
{
	//Get all userIds that liked the given userId
	// (await getUserInfo(userId)).content.
}
