import React from 'react';
import PropTypes from 'prop-types';
import DoneButton from '../components/DoneButton';
import FavoriteButton from '../components/FavoriteButton';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LogoutButton from '../components/LogoutButton';
import style from './styles/Profile.module.css';

export default function Profile({ history }) {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div>
      <header>

        <Header history={ history } pageTitle="Profile" searchBtn={ false } />
      </header>
      <main>
        <div className={ style.profilePage }>
          <div className={ style.user__email }>
            <p data-testid="profile-email">{user && user.email}</p>
          </div>
          <div className={ style.container_btn }>
            <DoneButton history={ history } />
            <hr />
            <FavoriteButton history={ history } />
            <hr />
            <LogoutButton history={ history } />
          </div>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

Profile.propTypes = {
  history: PropTypes.shape().isRequired,
};
