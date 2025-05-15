import { cloneElement } from "react";

import { buttonPositions } from "./Button";
import { skeuomorphThemes, useTheme } from "../../contexts/ThemeContext";

import "./ButtonBox.scss";

function ButtonBox({ children, gap }) {
    const {theme} = useTheme();

    if (skeuomorphThemes.includes(theme)) {  // is skeuomorph
        return (
            <div className="ButtonBox">{
                children?.map((button, index) => {
                    let props;
                    if (children.length == 1) {
                        props = {style: button.props.style + buttonPositions.SOLE};
                    }
                    else if (index == 0) {
                        props = {style: button.props.style + buttonPositions.LEFT};
                    }
                    else if (index == children.length - 1) {
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
        <div className="ButtonBox" style={ {gap: gap} }>
            { children?.map((button, index) => button) }
        </div>
    );
}

export default ButtonBox;
