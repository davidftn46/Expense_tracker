import React from 'react';
import slika from '../images/slika.jpg';

const Home = () => {
    return (
        <div className="home-container">
            <img src={slika} alt="Opis slike" className="home-image" />
            <p className="home-quote">"Many people take no care of their money till they come nearly<br></br> to the end of it, and others do just the same with their time."<br></br><i className="home-author">Johann Wolfgang von Goethe</i></p>
        </div>
    );
};

export default Home;