import React from "react";
import SwipeComponent from "./SwipeComponent";

interface SwipeDeleteComponentProps {
    onDelete: () => void,
    children: JSX.Element
}

const SwipeDeleteComponent = ({ onDelete, children }: SwipeDeleteComponentProps) => {
    return (
        <SwipeComponent onSwipe={onDelete} text="Delete" color="#b60000" children={children} />
    );
}

export default SwipeDeleteComponent;