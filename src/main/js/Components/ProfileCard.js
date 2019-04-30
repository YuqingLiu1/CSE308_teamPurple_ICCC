import React from 'react';
import Image from "react-bootstrap/Image";
import DBAwareEdiText from "./DBAwareEdiText";
import Likes from './Likes'

export default function({profileThumbnailUrl, username}) {
    return <div>
        <div style={{textAlign: "center"}}>
            <Image src={profileThumbnailUrl} rounded fluid className="mb-3"/>
            <div style={{display: 'inline-block'}}>
                <DBAwareEdiText
                    type="text"
                    name="username"
                    value={username}
                />
            </div>
        </div>
        {/*<Likes/>*/}
    </div>
}