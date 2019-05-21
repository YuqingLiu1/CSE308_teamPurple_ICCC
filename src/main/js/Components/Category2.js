import React, { useState, useEffect } from 'react'
import { Card, Collapse } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import DBAwareEdiText from './DBAwareEdiText'
import CategoryCard from "./CategoryCard"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

/**
 * Props:
 *   - categoryId: String (the Category ID of this category)
 *   - changePage: function (the function that will be called when clicking on items in this category to go to a new
 *                           page)
 *   - loggedInUserId: User ID of logged in user, or not specified if user is logged out
 */
export default function Category2({ categoryId, loggedInUserId, changePage }) {
	const [isMyCategory, setIsMyCategory] = useState(false);
	const [type, setType] = useState('');
	const [creator, setCreator] = useState('');
	const [searchText, setSearchText] = useState('');
	const [name, setName] = useState('');
	const [likedBy, setLikedBy] = useState('');
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [notExpandedControls, setNotExpandedControls] = useState(true);
	useEffect(() => {
		let isMounted = true;

		async function loadData() {
			try {
				// fetch category information
				let res = await fetch(`/category/info?id=${categoryId}`);
				res = await res.json();
				if (res.status !== 'OK') throw new Error(`Failed to fetch category with ID: ${categoryId}.`);
				let type = res.content.type;
				let creator = res.content.creator;
				let searchText = res.content.searchText;
				let name = res.content.name;
				let likedBy = res.content.likedBy;
				let isMyCategory = res.content.userRef === loggedInUserId;
				if (isMounted) {
					setType(type);
					setCreator(creator);
					setSearchText(searchText);
					setName(name);
					setLikedBy(likedBy);
					setIsMyCategory(isMyCategory);
				}

				// now that we have info about this category, perform a search for users/content based on it
				res = await fetch('/search', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						type: type,
						creator: creator,
						searchText: searchText,
						likedBy: likedBy,
					})
				});
				res = await res.json();
				if (res.status !== 'OK') throw new Error('Failed to search.');

				// map the returned users/content into items that can be displayed in this category
				let users = res.content.users;
				let content = [...res.content.series, ...res.content.episodes, ...res.content.frames];
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
				content = content.map((frame) => {
					return {
						title: frame.generalBase.title,
						sketchId: frame.sketch.id,
						generalBaseId: frame.generalBase.id,
						contentBaseId: frame.contentBase.id,
						onClick() {
							changePage('viewContentPage', {contentBaseId: frame.contentBase.id})
						}
					}
				});

				// add the mapped users/content into this category's list of items
				if (isMounted) {
					setItems([...content, ...users]);
					setLoading(false);
				}
			} catch (err) {
				console.error(err);
			}
		}
		loadData();

		return () => isMounted = false;
	}, [type, searchText, creator, likedBy]);

	// rendering logic
	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this category?")) {
			await window.deleteCategory(categoryId);
			changePage('refresh');
		}
	};
	const handleChangeType = async (t) => {
		if (type !== t) {
			await window.setCategoryType(categoryId, t);
			setType(t);
		}
	};
	const handleChangeSearch = async () => {
		const text = window.prompt(`Please enter a search query for this category:\n(Current search query: ${searchText})`);
		if (text == null) {
			window.alert("Cancelled changing the category's search query");
		} else {
			if (text !== searchText) {
				await window.setCategorySearchText(categoryId, text);
				setSearchText(text);
				alert(`Set search text to: ${text}`);
			} else {
				alert("Search text unchanged.");
			}
		}
	};
	const handleChangeCreator = async (creator) => {
		if (creator === 'Me') {
			await window.setCategoryCreator(categoryId, loggedInUserId);
			setCreator(loggedInUserId);
		} else {
			await window.setCategoryCreator(categoryId, null);
			setCreator(null);
		}
	};
	const handleChangeLikedBy = async (x) => {
		if (x === 'Me') {
			await window.setCategoryLikedBy(categoryId, loggedInUserId);
			setLikedBy(loggedInUserId);
		} else {
			await window.setCategoryLikedBy(categoryId, null);
			setLikedBy('');
		}
	};

	const categoryFontSize = '30px';
	const controls = (
		<Collapse in={!notExpandedControls}>
			<div>
				<Button onClick={handleDelete} className='mr-3'>Delete</Button>
				This category shows
				<select value={type} onChange={e => handleChangeType(e.target.value)} className='mx-1'>
					<option value="All" label="everything"/>
					<option value="Content" label="all content"/>
					<option value="User" label="all users"/>
					<option value="Series" label="all series"/>
					<option value="Episode" label="all episodes"/>
					<option value="Frame" label="all frames"/>
				</select>
				{
					type !== 'User' && type !=='All' &&
					<select value={creator ? "Me" : "Anybody"} onChange={e => handleChangeCreator(e.target.value)} className='mr-1'>
						<option value="Me" label="that I made"/>
						<option value="Anybody" label="that anybody made"/>
					</select>
				}
				containing the search phrase
				<Button onClick={handleChangeSearch} className='mx-1'>
					{JSON.stringify(searchText)}
				</Button>
				<select value={likedBy ? "Me" : 'not me'} onChange={e => handleChangeLikedBy(e.target.value)}>
					<option value="Me" label=" if I liked it"/>
					<option value='not me' label=" whether or not I liked it"/>
				</select>
			</div>
		</Collapse>
	);

	const cards = (
		<Card.Body style={{overflowX: 'scroll'}}>
			<div>
				<table>
					<tbody>
						<tr>
							{
								!items.length ?
									<td>
										{
											loading ?
												'(Still loading, please be patient...)'
													:
												'(There are 0 results that match this category)'
										}
									</td>
										:
									items.map(x => {
										return (
											<td key={x.generalBaseId}>
												{
													x.userId ?
														<CategoryCard userId={x.userId} onClick={x.onClick}/>
															:
														<CategoryCard contentBaseId={x.contentBaseId} onClick={x.onClick}/>
												}
											</td>
										);
									})
							}
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
						!isMyCategory ?
							<span className='mx-auto' style={{ 'fontSize': categoryFontSize }}>
								{name}
							</span>
								:
							<div className='mx-auto'>
								{
									loading ?
										'Loading...'
											:
										<Container>
											<Row>
												<Button onClick={() => setNotExpandedControls(!notExpandedControls)}>
													{notExpandedControls ? '▼' : '▲'}
												</Button>
												<DBAwareEdiText
													viewProps={{style: {fontSize: categoryFontSize}}}
													value={name}
													type={'text'}
													onSave={name=>window.setCategoryName(categoryId, name)}
												/>
											</Row>
											<Row>
												{controls}
											</Row>
										</Container>
								}
							</div>
					}
				</div>
			</Card.Header>
			{cards}
		</Card>
	);
}