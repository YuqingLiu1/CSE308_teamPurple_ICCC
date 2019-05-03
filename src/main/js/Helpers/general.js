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

