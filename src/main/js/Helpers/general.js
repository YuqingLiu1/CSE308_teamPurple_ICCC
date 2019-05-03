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
