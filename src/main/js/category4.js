//This is a backup of the old version of category2

import React, { Component } from 'react'
import {Card, Collapse, Modal} from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import DBAwareEdiText from './DBAwareEdiText'
import CategoryCard from "./CategoryCard";

// ( {
//         items = [{contentBaseId: 1}, {contentBaseId: 2}, {contentBaseId: 3}]
//         ,
//         editable
//         ,
//         title
//         ,
//         setTitle
//         ,
//         remove
//         ,
//         loggedIn = true
//     }
// )

/**
 * Props:
 *   - categoryId: String (the Category ID of this category)
 *   - changePage: function (the function that will be called when clicking on items in this category to go to a new
 *                           page)
 *   - loggedIn: boolean (whether this category is being displayed in a context where the viewer is a logged in user)
 */
export default class Category2 extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			items: [],
			loading: true
		};
	}

	async componentDidMount() {
		try {
			let categoryId = this.props.categoryId;

			// fetch category information
			let categoryInfoRes = await fetch('/category/info?id=' + categoryId);
			categoryInfoRes = await categoryInfoRes.json();
			if (categoryInfoRes.status !== 'OK') throw new Error('Failed to fetch category with ID: ' + categoryId);

			let type = categoryInfoRes.content.type;
			let creator = categoryInfoRes.content.creator;
			let searchText = categoryInfoRes.content.searchText;
			let name = categoryInfoRes.content.name;

			// use category information to search for users/content
			let searchRes = await fetch('/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
										 type: type,
										 creator: creator,
										 searchText: searchText
									 })
			});
			searchRes = await searchRes.json();
			if (searchRes.status !== 'OK') throw new Error('Failed to search');

			// map the returned users/content into items that can be displayed in this category
			let items = [];
			let users = searchRes.content.users;
			let series = searchRes.content.series;
			let episodes = searchRes.content.episodes;
			let frames = searchRes.content.frames;
			let changePage = this.props.changePage;
			// TODO: handle mapping users
			users = users.map((user) => {
				return {
					title: user.generalBase.title,
					thumbnail: user.sketch.thumbnail,
					sketchId: user.sketch.id,
					generalBaseId: user.generalBase.id,
					userId: user.user.id,
					onClick() {
						changePage('userInfo', {
							userId: user.user.id,
						})
					}
				}
			});
			series = series.map((series) => {
				return {
					title: series.generalBase.title,
					thumbnail: series.sketch.thumbnail,
					sketchId: series.sketch.id,
					generalBaseId: series.generalBase.id,
					contentBaseId: series.contentBase.id,
					onClick() {
						changePage('viewContentPage', {
							initialContentBaseId: series.contentBase.id,
							initialSketchId: series.sketch.id
						})
					}
				}
			});
			episodes = episodes.map((episode) => {
				return {
					title: episode.generalBase.title,
					thumbnail: episode.sketch.thumbnail,
					sketchId: episode.sketch.id,
					generalBaseId: episode.generalBase.id,
					contentBaseId: episode.contentBase.id,
					onClick() {
						changePage('viewContentPage', {
							initialContentBaseId: episode.contentBase.id,
							initialSketchId: episode.sketch.id
						})
					}
				}
			});
			frames = frames.map((frame) => {
				return {
					title: frame.generalBase.title,
					thumbnail: frame.sketch.thumbnail,
					sketchId: frame.sketch.id,
					generalBaseId: frame.generalBase.id,
					contentBaseId: frame.contentBase.id,
					onClick() {
						changePage('viewContentPage', {
							initialContentBaseId: frame.contentBase.id,
							initialSketchId: frame.sketch.id
						})
					}
				}
			});

			// add the mapped users/content into this category's list of items
			items.push.apply(items, series);
			items.push.apply(items, episodes);
			items.push.apply(items, frames);
			items.push.apply(items, users);

			this.setState({
							  name: name,
							  items: items,
							  loading: false
						  });
		} catch (err) {
			console.error(err);
		}
	}

	render() {
		let items = this.state.items;
		let loggedIn = this.props.loggedIn;
		let name = this.state.name;
		let loading = this.state.loading;
		const categoryFontSize = '30px';
		// const [notCollapsed, setNotCollapsed] = useState(true)
		// const [askIfDelete, setAskIfDelete] = useState(false)
		// const removeAsker = (
		//     <div className='mx-auto'>
		//         Are you sure you want to remove this category?
		//         <span>
		//             <Button onClick={remove} variant={'danger'}>Yes</Button>
		//             <Button onClick={() => setAskIfDelete(false)}>No</Button>
		//         </span>
		//     </div>
		// );
		const cards = (
			<Card.Body style={{overflowX: 'scroll'}}>
				<div>
					<table>
						<tbody>
							<tr>
								{items.map(x =>
											   <td key={x.generalBaseId}>
												   {
													   x.userId ?
														   <CategoryCard userId={x.userId} onClick={x.onClick}/>
														   :
														   <CategoryCard contentBaseId={x.contentBaseId} onClick={x.onClick}/>
												   }
											   </td>)}
							</tr>
						</tbody>
					</table>
				</div>
			</Card.Body>
		);

		return (
			<Card>
				<Card.Header>
					<div style={{display: 'flex', flexDirection: 'vertical'}}>
						{
							!loggedIn ?
								<span className='mx-auto' style={{'fontSize': categoryFontSize}}>{name}</span>
								:
								<>
									{/*<Button variant="danger"*/}
									{/*onClick={() => setAskIfDelete(true)}>*/}
									{/*{<i className="fas fa-minus-circle"/>}*/}
									{/*</Button>*/}
									{/*<Button onClick={() => setNotCollapsed(!notCollapsed)}>{notCollapsed ? '▼' : '▲'}</Button>*/}
									<div className='mx-auto'>
										{
											loading ?
												'Loading...'
												:
												<DBAwareEdiText viewProps={{style: {fontSize: categoryFontSize}}}
													// inputProps	={{style:{'fontSize':categoryFontSize}}}
																value={name} type={'text'} onSave={alert}/>
										}
									</div>
								</>
						}
					</div>
					{/*<Collapse in={askIfDelete}>*/}
					{/*{removeAsker}*/}
					{/*</Collapse>*/}
				</Card.Header>
				{/*<Collapse in={notCollapsed}>*/}
				{/*{cards}*/}
				{/*</Collapse>*/}
				{cards}
			</Card>
		);
	}
}