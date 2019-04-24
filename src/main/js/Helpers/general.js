async function doFetch(url,{method='POST',body=undefined}={})
{
    //ALWAYS returns a string (NOT an object) (via a promise, so you have to use await to get it)
    //Example usages:
    //  await doFetch('/getNumlike',{method:'GET'})
    //  JSON.parse(await doFetch('/user/info'))
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