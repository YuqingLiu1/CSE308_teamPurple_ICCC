require('@babel/polyfill')

import React, { useState, useEffect } from 'react';

import Media from 'react-bootstrap/Media';

export default function Comment({generalBaseId}){

    const [comments, setComments] = useState('');
    const [myList, setMyList] = useState('');
    useEffect(() => {
        let isMounted = true;

        async function loadCommentData() {
            try {
                console.log(generalBaseId);
                let res = await fetch(`/comments/myComments?id=${generalBaseId}`);
                res = await res.json();
                if (res.status !== 'OK') throw new Error(`Failed to load comment for general base ID: ${generalBaseId}`);
                let comments = res.content;

                if (isMounted) {
                    setComments(comments);
                }
                console.log(comments);
                console.log("comments length is " + comments.length);
                var list=[];
                if (comments.length > 0) {
                    for (var i = 0; i < comments.length; i++) {
                        //console.log("in loop");
                        list.push(
                            <div>
                                <Media className='my-1'>
                                    <Media.Body>
                                        <h5>On {comments[i].title}:</h5>
                                        " {comments[i].content} "
                                    </Media.Body>
                                </Media>
                            </div>
                        )
                        //console.log("now list is " + list);
                    }
                    //console.log(list);
                }
                else{
                    list.push(<div>
                            This user does not have any comments yet : (
                    </div>);
                }

                if (isMounted) {
                   setMyList(list);
                }

                //console.log(myList);


            } catch (err) {
                console.error(err);
            }
        };
        loadCommentData();

        return () => isMounted = false;
    }, [generalBaseId]);


        return (<div>
            {myList}
            </div>);

}