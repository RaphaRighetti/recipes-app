import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import searchIcon from '../images/searchIcon.svg';
import profileIcon from '../images/profileIcon.svg';
import SearchBar from './SearchBar';
import style from '../pages/styles/Header.module.css';
import logoIcon from '../images/ícone Recipes app.png';
import iconePrato from '../images/icone-prato.png';
import iconeBebida from '../images/icone-bebida.png';
import iconeCheck from '../images/icone-check.png';
import iconeCoracao from '../images/Icone-coracao.png';
import iconeProfile from '../images/Perfil.png';

export default function Header(props) {
  const history = useHistory();
  const { searchBtn, pageTitle, url, setFunc } = props;
  const [specificHeader, setSpecificHeader] = useState(false);

  const handleClick = () => {
    history.push('/profile');
  };

  const itsSpecific = () => {
    setSpecificHeader(!specificHeader);
  };

  return (

    <header className={ style.header }>
      <div className={ style.header_container }>
        <div className={ style.logo }>
          <img className={ style.logo_icon } src={ logoIcon } alt="icone do logo" />
          <span>Recipes</span>
          <strong>app</strong>
        </div>
        <div>
          <button // sempre presente
            className={ style.btn }
            data-testid="profile-top-btn"
            type="button"
            src={ profileIcon }
            onClick={ handleClick }
          >
            <img className={ style.icon } src={ profileIcon } alt="profile" />
          </button>

          { !searchBtn ? ''
            : (
              <button // presente somente em algumas páginas
                className={ style.btn }
                data-testid="search-top-btn"
                type="button"
                src={ searchIcon }
                onClick={ itsSpecific }
              >
                <img className={ style.icon } src={ searchIcon } alt="search" />
              </button>
            )}
        </div>
      </div>
      <div className={ style.title_page }>

        { pageTitle === 'Drinks'
        && (<img
          className={ style.drinks }
          src={ iconeBebida }
          alt="icone de bebida"
        />) }

        {pageTitle === 'Meals'
        && (<img className={ style.meals } src={ iconePrato } alt="icone de prato" />)}

        {pageTitle === 'Done Recipes'
        && (<img
          className={ style.check }
          src={ iconeCheck }
          alt="icone de check"
        />)}

        {pageTitle === 'Favorite Recipes'
        && (<img
          className={ style.check }
          src={ iconeCoracao }
          alt="icone de coração"
        />)}

        {pageTitle === 'Profile'
        && (<img
          className={ style.check }
          src={ iconeProfile }
          alt="icone de perfil"
        />)}

        <h1 data-testid="page-title">{pageTitle}</h1>
        {
          specificHeader
          && <SearchBar
            url={ url }
            type={ pageTitle.toLowerCase() }
            history={ history }
            setFunc={ setFunc }
          />

        }
      </div>

    </header>
  );
}

Header.defaultProps = {
  url: 'https://www.themealdb.com/api/json/v1/1/',
  setFunc: () => true,
};

Header.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  searchBtn: PropTypes.bool.isRequired,
  url: PropTypes.string,
  setFunc: PropTypes.func,
};
