import React from 'react';
import PropTypes from 'prop-types';
import iconeLogout from '../images/icone-logout.png';

function LogoutButton({ history }) {
  const handleClick = () => {
    localStorage.clear();
    history.push('/');
  };

  return (
    <div>
      <img
        src={ iconeLogout }
        alt="icone de logout"
      />

      <button
        data-testid="profile-logout-btn"
        onClick={ handleClick }
        type="button"
      >
        Logout
      </button>
    </div>
  );
}

LogoutButton.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default LogoutButton;
