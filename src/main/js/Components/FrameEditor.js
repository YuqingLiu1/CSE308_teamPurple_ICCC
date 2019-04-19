import React from 'react'
import {SketchField, Tools} from '../react-sketch'
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"

class FrameEditor extends React.Component
{
	constructor(props)
	{
		super(props)

		this.state={
			tool: Tools.Pencil
		}
	}

	setTool(tool)
	{
		this.setState({
						  tool: tool
					  })
	}

	saveJSON()
	{
		alert(JSON.stringify(this._sketch.toJSON(), null, 4))
	}

	render()
	{
		return (
			<Container>
				<ButtonGroup>
					<Button variant="secondary" onClick={()=>{this.setTool(Tools.Select)}}>
						<i className="far fa-hand-pointer"></i>
					</Button>
					<Button variant="secondary" onClick={()=>{this.setTool(Tools.Pencil)}}>
						<i className="fas fa-pencil-alt"></i>
					</Button>
					<Button variant="secondary" onClick={()=>{this.setTool(Tools.Circle)}}>
						<i className="far fa-circle"></i>
					</Button>
					<Button variant="secondary" onClick={()=>{this.setTool(Tools.Line)}}>
						<i className="fas fa-slash"></i>
					</Button>
					<Button variant="secondary" onClick={()=>{this.setTool(Tools.Rectangle)}}>
						<i className="far fa-square"></i>
					</Button>
					<Button variant="secondary" onClick={()=>{this.saveJSON()}}>
						<i className="fas fa-download"></i>
					</Button>
				</ButtonGroup>
				<SketchField
					width='500px'
					height='500px'
					tool={this.state.tool}
					lineColor='black'
					lineWidth={3}
					ref={c=>(this._sketch=c)}
				/>
			</Container>
		)
	}
}

export default FrameEditor