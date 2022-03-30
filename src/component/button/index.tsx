import { FC } from "react";
import "./style.scss";

type ButtonProps = {
  handleOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  text?: string;
  isDisabled?: boolean | undefined;
};

const Button: FC<ButtonProps> = ({ handleOnClick, text, isDisabled }) => {
  return (
    <button className="Button" disabled={isDisabled} onClick={handleOnClick}>
      {text}
    </button>
  );
};

export default Button;
