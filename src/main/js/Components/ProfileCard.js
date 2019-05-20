import React from 'react';
import Image from "react-bootstrap/Image";
import DBAwareEdiText from "./DBAwareEdiText";
import Likes from './Likes'

export default function({ generalBaseId, profileThumbnailUrl, username, editable }) {
    return <div>
        <div style={{textAlign: "center"}}>
            <Image src={profileThumbnailUrl} rounded fluid className="mb-3"/>
            <div style={{display: 'inline-block'}}>
                {
                    username &&
                    (
                        editable ?
                            <DBAwareEdiText
                                type="text"
                                name="username"
                                value={username}
                            />
                                :
                            <p>{username}</p>
                    )
                }
            </div>
        </div>
        <Likes generalBaseId={generalBaseId}/>
    </div>
}