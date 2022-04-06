import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import Message from './message.jsx';
import List from './list.jsx';

class Layout extends React.Component
{
	render()
	{
		return <div>
			<List />
		</div>
	}
}
const container = document.getElementById('root');

// Create a root.
const root = ReactDOMClient.createRoot(container);
root.render(<Layout />);