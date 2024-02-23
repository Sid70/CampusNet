import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import url from '../api/Serverhost'

const ScrapedContent = () => {
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}/scrape`);
                const data = await response.json();
                setLinks(data.links);
            } catch (error) {
                console.error(`Failed to fetch data. Error: ${error.message}`);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Typography variant="h4">Scraped Links</Typography>
            <ul>
                {links.map((link, index) => (
                    <li key={index}>{link}</li>
                ))}
            </ul>
        </div>
    );
};

export default ScrapedContent;
