export default async function(url,{method='GET',body=undefined}={})
{
    //ALWAYS returns a string (NOT an object) (via a promise, so you have to use await to get it)
    //Example usages:
    //  await doFetch('/getNumlike',{method:'GET'})
    //  JSON.parse(await doFetch('/user/info'))
    //  j=JSON.parse(await doFetch('/user/info'))
    // j.content.email
    try
    {
        const response = await fetch(url,{method,body})
        return await response.text()
    }
    catch (err)
    {
        console.log('fetch failed', err)
    }
}

// exports.shouldShowRightButton = async (currentContentId) => {
//     try {
//
//     } catch (err) {
//         // handle error
//         console.error(err);
//     }
// }

/**
async function doFetch(url,{method='GET',ContentType='application/json',body=undefined}={})
{
    //ALWAYS returns a string (NOT an object) (via a promise, so you have to use await to get it)
    //Example usages:
    //  await doFetch('/getNumlike',{method:'GET'})
    //  JSON.parse(await doFetch('/user/info'))
    //  j=JSON.parse(await doFetch('/user/info'))
    // j.content.email
    try
    {
        const response = await fetch(url,{method,body})
        return await response.text()
    }
    catch (err)
    {
        console.log('fetch failed', err)
    }
}


JSON.parse(await doFetch('/comment/add', {
    method: 'POST',
    body: JSON.stringify({on: '5cc8dd5b0e5732259b3501a6',
        author: '5cc8fbd4aa1e99310201561c',
        content: 'Hello Ben!'})
}))
 */


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