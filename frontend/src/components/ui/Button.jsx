import "./Button.scss";

function Button({ text, fgcolor, bgcolor }) {
    return (
        <div className="Button" style={ {color: fgcolor, backgroundColor: bgcolor} }>{ text }</div>
    );
}

export default Button;
