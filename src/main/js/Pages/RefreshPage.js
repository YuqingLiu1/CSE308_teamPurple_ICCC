require('@babel/polyfill')

import React, { useEffect } from 'react';

/**
 * A blank page to be used for refreshing the current page. You give it the page and page data that you want to load,
 * and it automatically changes the page according to those parameters.
 * @param page The page you want to load.
 * @param pageData The page data you want to associate with page.
 * @param changePage The function that changes the page based on page and pageData.
 */
export default function RefreshPage({ page, pageData, changePage }) {
    useEffect(() => {
        changePage(page, pageData);
    }, []);

    return <></>;
}