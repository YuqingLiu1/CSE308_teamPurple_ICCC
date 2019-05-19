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
	console.assert(isObject(x),'x is not a string! x=',x)
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

//ICCC-SPECIFIC HELPER FUNCTIONS:------------------------------------------------------------
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
window.setCategoryParameter=async function(categoryId,parameterName,parameterValue)
{
	console.log(categoryId,parameterName,parameterValue)
	console.assert(arguments.length    ===3       ,'Wrong number of arguments'     )
	console.assert(typeof parameterName==='string','parameterName must be a string')
	console.assert(typeof categoryId   ==='string','categoryId must be a string'   )
	const categoryInfo=await window.getCategoryInfoFromId(categoryId)
	console.log(JSON.stringify(categoryInfo))
	return await window.fetchJson('/user/categories/edit',{...categoryInfo,[parameterName]:parameterValue})//We simply wait for the refresh-loop to update the gui (it's pretty slow, but it works)
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
window.setCategoryType=async function(categoryId,type)
{
	console.assert(arguments.length ===2       ,'Wrong number of arguments'  )
	console.assert(typeof type      ==='string','type must be a string'      )
	console.assert(typeof categoryId==='string','categoryId must be a string')
	console.assert(['All','User','Series','Episode','Frame'].includes(type),'Type '+JSON.stringify(type)+' is not a valid category type')
	return await setCategoryParameter(categoryId,'type',type)
}