import {Helmet} from "react-helmet";
import React from 'react';
class Setup extends React.Component
{
	render()
	{
		return <div> 
			<Helmet>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin / >
				<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet" />
			</Helmet>
		</div>
	}
}

export default Setup;