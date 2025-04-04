import { cloneElement } from "react";

import { buttonPositions } from "./Button";
import { skeuomorphThemes, useTheme } from "../../contexts/ThemeContext";

import "./ButtonBox.scss";

function ButtonBox({ buttons, gap }) {
    const {theme, setTheme} = useTheme();

    if (skeuomorphThemes.includes(theme)) {  // is skeuomorph
        return (
            <div className="ButtonBox">{
                buttons.map((button, index) => {
                    let props;
                    if (buttons.length == 1) {
                        props = {style: button.props.style + buttonPositions.SOLE};
                    }
                    else if (index == 0) {
                        props = {style: button.props.style + buttonPositions.LEFT};
                    }
                    else if (index == buttons.length - 1) {
                        props = {style: button.props.style + buttonPositions.RIGHT};
                    }
                    else {
                        props = {style: button.props.style + buttonPositions.MIDDLE};
                    }
                    return cloneElement(button, props);
                })
            }</div>
        );
    }

    return (
        <div className="ButtonBox" style={ {gap: gap} }>{
            buttons.map((button, index) => button)
        }</div>
    );
}

export default ButtonBox;
