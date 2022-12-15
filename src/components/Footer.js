import { Link } from 'react-router-dom';
import drinkIcon from '../images/drinkIcon.svg';
import mealIcon from '../images/mealIcon.svg';
import style from '../pages/styles/Footer.module.css';

function Footer() {
  return (
    <div
      className={ style.footer }
      data-testid="footer"
      style={ { position: 'fixed', bottom: '0' } }
    >
      <Link to="/drinks">
        <button
          type="button"
        >
          <img src={ drinkIcon } alt="Drinks" data-testid="drinks-bottom-btn" />
        </button>
      </Link>

      <Link to="/meals">
        <button
          type="button"
        >
          <img src={ mealIcon } alt="Meals" data-testid="meals-bottom-btn" />
        </button>
      </Link>
    </div>
  );
}

export default Footer;
