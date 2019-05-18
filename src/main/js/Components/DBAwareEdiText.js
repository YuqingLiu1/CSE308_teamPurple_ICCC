require("@babel/polyfill")

import React from 'react'
import EdiText from "react-editext"

export default function DBAwareEdiText(props)
{
	async function onSave(val)
	{
		let userInfoRes=await fetch('/user/edit', {
			method : 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body   : JSON.stringify({
										[props.name]: val
									})
		})
		userInfoRes    = await userInfoRes.json()
		if(userInfoRes.status==='OK')
		{
			// do something on successful save
		}
		else
		{
			// do something on unsuccessful save
		}
	}

	return (
		<EdiText {...{...props, onSave: props.onSave ? props.onSave : onSave}}
			hideIcons={true}
			editButtonContent={<i className="far fa-edit"></i>}
			editButtonClassName="transparent-button"
			saveButtonContent={<i className="fas fa-check"></i>}
			saveButtonClassName="transparent-button green"
			cancelButtonContent={<i className="fas fa-times"></i>}
			cancelButtonClassName="transparent-button red"
		/>
	)
}

