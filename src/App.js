/* eslint-disable no-mixed-spaces-and-tabs */
import axios from 'axios';
import React, { useEffect, useState} from 'react';
import './App.css';

const App = () => {
    // eslint-disable-next-line no-unused-vars
    const [pageNumberLimit, setPageNumberLimit] = useState(5);
    const [items, setItems] = useState(null);
  	const [currentPage, setCurrentPage] = useState(1);
  	const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  	const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    const [loading, setLoading] = useState(false);
    const pages = [];
    let key = [];
    let pageIncrementBtn = null;
    let pageDecrementBtn = null;
	
    useEffect(() => {
        getData();
        if (items) 
            getPageSize();
    }, []);
	
    useEffect(() => {
        if (loading)
            setTimeout(() => setLoading(false) , 500);
    }, [ loading ]);
	
    //Paginationdaki numaralı sayfalardan birine yönelendirme.
    const handleClick = event => {
        setLoading(prevState => !prevState);
        const { id } = event.target;
        setCurrentPage(Number(id));
        getData(Number(id));
        setLoading(prevState => !prevState);  
    };

    const getPageSize = () => {
        if (items)  
            return items.total / 12;
    };

    for (let i = 1; i <= getPageSize(); i++ ) {
        pages.push(i);
    }

    for (let i = 0; i <= Object.keys(sessionStorage).length - 1; i++){
        key.push(Object.keys(sessionStorage)[i]);
    }

    //Pagination kısmını return eden fonksiyon.
    const renderPagesNumbers = pages.map((number) => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
            return(
                <li 
                    key			= { number } 
                    id			= { number } 
                    onClick		= { handleClick } 
                    className	= { currentPage == number ? 'active' : null } 
                >
                    { number }
                </li>
            );
        } else {
            return null;
        }
    });

    //Api isteği session storage kontrolü sağlanarak yapılıyor.
    const getData = param => {
        if (!param) {
            param = 1;
        }
        const sessionResult = key.filter(e => e == param);
    
        if (sessionResult[0]) {
            let data = JSON.parse(sessionStorage.getItem(`${param}`)); 
            setItems(data);
            setLoading(prevState => !prevState);
        } else {
            axios.get(`http://gateway.marvel.com/v1/public/characters?ts=1&apikey=28a7a1300246b753803b1254a45b216d&hash=3962d34abe1e2d95e7e41885568fc386&offset=${ (param - 1) * 12 }&limit=12`)
                .then(res => {
                    sessionStorage.setItem(`${param}`, JSON.stringify(res.data.data));
                    setItems(res.data.data);
                });
            setLoading(prevState => !prevState);	
        }    
    };

    //Paginationdaki ileri butonun tetiklendiği kısım.
    const handleNextbtn = newPageNum => {
        setLoading(prevState => !prevState);
        setCurrentPage(newPageNum);

        if (newPageNum > maxPageNumberLimit) {
            setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
        getData(newPageNum);
        setLoading(prevState => !prevState);
    };

    //Paginationdaki geri butonun tetiklendiği kısım.
    const handlePrevbtn = newPageNum => {
        setLoading(prevState => !prevState);
        setCurrentPage(newPageNum);

        if ((currentPage-1) % pageNumberLimit==0) {
            setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
        getData(newPageNum);
        setLoading(prevState => !prevState);
    };

    if (pages.length > maxPageNumberLimit) {
        pageIncrementBtn = <li onClick = { handleNextbtn }> &hellip; </li>;
    }

    if (pages.length >= minPageNumberLimit) {
        pageDecrementBtn = <li onClick = { handlePrevbtn }> &hellip; </li>;
    }

    return (
        !loading 
            ?	<div className="mainContainer">
                {/* Header - Start */}
                <div className="headerContainer">
                    <div id="image1">
                        <img 
                            src = { 'images/image1.svg' }  
                            alt = "logo" 
                        />
                    </div>

                    <div id="marvelLogo">
                        <img 
                            src = { 'images/image2.svg' } 
                            alt = "logo" 
                        />
                    </div>
                </div>
                {/* Header - End */}
		
                {
                    loading && <div className='loading'> <span>Loading</span> </div>
                }

                {/* Content - Start */}
                <div className="contentContainer">
                    {
                        items && items.results.map((item, index) => (
                            <div 
                                key			= { index } 
                                className	= 'contentMovie'
                            >
                                <div id="contentImage">
                                    <img 
                                        src = { `${item.thumbnail.path}.${item.thumbnail.extension}` } 
                                        alt = "image" 
                                    />
                                </div>
                                <div id="title">
                                    <b>{ item.name }</b>
                                </div>
                            </div>
                        ))   
                    }
                </div>
                {/* Content - End */}

                {/* Pagination - Start */}
                <div className='pagination'>
			
                    <ul className='pageNumbers'> 
                        <li>
                            <button 
                                onClick = { () => handlePrevbtn(currentPage - 1) } 
                                disabled= { currentPage == pages[0] ? true : false } 
                            > ❮ 
                            </button>
                        </li>
                        { pageDecrementBtn }
                        { renderPagesNumbers } 
                        { pageIncrementBtn }
                        <li>
                            <button onClick = { () => handleNextbtn(currentPage + 1) }> ❯ </button>
                        </li>
                    </ul> 
		
                </div>
                {/* Pagination - End */} 
            </div>
            :	<div id='loading'>  </div>
    );
};

export default App;