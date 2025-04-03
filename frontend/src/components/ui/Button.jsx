import "./Button.scss";

export const buttonColors = {
    blue: "btn-blue",
    green: "btn-green"
}

function Button({ text, color, onClick }) {
    return (
        <div className={ "Button " + color } onClick={ onClick }>{ text }</div>
    );
}

export default Button;
