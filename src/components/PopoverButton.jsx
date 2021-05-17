import React from "react";
import { useDetectClickOutside } from "../hooks/";

const PopoverButton = ({
    title,
    buttonChildren,
    popoverChildren,
    className,
    ...rest
}) => {
    const { ref, isComponentVisible, setIsComponentVisible } =
        useDetectClickOutside(false);

    let classNames = (
        "rgt-columns-manager-wrapper " + (className || "")
    ).trim();

    return (
        <div {...rest} ref={ref} className={classNames}>
            <button
                className={`rgt-columns-manager-button${
                    isComponentVisible
                        ? " rgt-columns-manager-button-active"
                        : ""
                }`}
                onClick={() => setIsComponentVisible(!isComponentVisible)}
            >
                {buttonChildren}
            </button>
            <div
                className={`rgt-columns-manager-popover${
                    isComponentVisible
                        ? " rgt-columns-manager-popover-open"
                        : ""
                }`}
            >
                <span className="rgt-columns-manager-popover-title">
                    {title}
                </span>
                <div className="rgt-columns-manager-popover-body">
                    {popoverChildren}
                </div>
            </div>
        </div>
    );
};

export default PopoverButton;
