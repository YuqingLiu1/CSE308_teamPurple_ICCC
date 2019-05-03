async function fetchJson(url,body)
{
	//Body is an optional parameter, meaning you don't have to spcify it.
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