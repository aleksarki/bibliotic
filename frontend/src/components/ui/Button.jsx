/*
 * A button.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Button.scss";

export const buttonColors = {
    BLUE: " btn-blue ",
    GREEN: " btn-green ",
    RED: " btn-red ",
    SKEUO: " btn-skeuo ",
    YELLOW: " btn-yellow "
}

export const buttonPositions = {
    SOLE: " btn-sole ",
    LEFT: " btn-left ",
    MIDDLE: " btn-middle ",
    RIGHT: " btn-right "
}

function Button({ text, icon, children, style, onClick }) {
    const positionNotProvided = Object.values(buttonPositions).every(position => !style.includes(position));
    if (positionNotProvided) {
        style += buttonPositions.SOLE;
    }

    return (
        <div className={ "Button " + style } onClick={ onClick }>
            { text && <span>{ text }</span> }
            { icon && <FontAwesomeIcon icon={ icon } /> }
            { children }
        </div>
    );
}

export default Button;
