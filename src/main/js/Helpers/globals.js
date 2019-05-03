//Everything in this JS file should be exposed to and accessed through the 'window' object
//This is because it's easy, uses the global namespace, and makes this code reusable even without babel.

//GENERAL HELPER FUNCTIONS:------------------------------------------------------------
window.isArray=function(x)
{
	return x!==undefined&&x!==null&&Object.getPrototypeOf(x)===Array.prototype
}
window.assertIsArray=function(x)
{
	console.assert(isArray(x),'x is not an array! x=',x)
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
window.assertAreAllArrays=function(...args)
{
	console.assert(areAllArrays(...args),'Not all arguments were arrays! args=',args)
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

//ICCC-SPECIFIC HELPER FUNCTIONS:------------------------------------------------------------
window.search={
	//The functions 'repsonse', 'results', and 'thumbnails' process a search query progressively, allowing you to debug intermediate steps.
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
