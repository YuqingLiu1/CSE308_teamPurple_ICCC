require("@babel/polyfill");

import React, { Component } from 'react';
import EdiText from "react-editext";

class DBAwareEdiText extends Component {
    constructor(props) {
        super(props);

        this.onSave = this.onSave.bind(this);
    }

    async onSave(val) {
        let userInfoRes = await fetch('/user/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                [this.props.name]: val
            })
        });
        userInfoRes = await userInfoRes.json();
        if (userInfoRes.status === 'OK') {
            // do something on successful save
        } else {
            // do something on unsuccessful save
        }
    };

    render() {
        return (
            <EdiText {...{...this.props, onSave:this.onSave}}
                 hideIcons={true}
                 editButtonContent={<i className="far fa-edit"></i>}
                 editButtonClassName="transparent-button"
                 saveButtonContent={<i className="fas fa-check"></i>}
                 saveButtonClassName="transparent-button green"
                 cancelButtonContent={<i className="fas fa-times"></i>}
                 cancelButtonClassName="transparent-button red"
            />
        );
    }
}

export default DBAwareEdiText;