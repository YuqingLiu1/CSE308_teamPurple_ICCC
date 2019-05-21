import React from 'react';
import Image from "react-bootstrap/Image";
import DBAwareEdiText from "./DBAwareEdiText";
import Likes from './Likes'
import Col from 'react-bootstrap/Col'



export default function ProfileCard({ generalBaseId, profileThumbnailUrl, username, editable, loggedInUserId }) {
    let userTitleText=<div style={{display: 'inline-block'}}>
        {
            username &&
            (
                editable ?
                    <DBAwareEdiText
                        viewProps={{style:{fontSize:50}}}
                        type="text"
                        name="username"
                        value={username}
                    />
                    :
                    <p>{username}</p>
            )
        }
    </div>
    let userImage    =<Image src={profileThumbnailUrl} rounded fluid className="mb-3"/>
    return <div>
        <div style={{textAlign: "center"}}>
            <Col style={{textAlign: "center",display: 'inline-block'}}>
                {userTitleText}
                {userImage}
                <Likes generalBaseId={generalBaseId} loggedInUserId={loggedInUserId}/>
            </Col>
        </div>
    </div>
}