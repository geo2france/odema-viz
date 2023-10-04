import React from "react";
import { Select, ConfigProvider } from "antd";
import { DarkModeContext } from "../../context/DarkModeProvider";
import { useContext } from "react";

import "./SelectMultiple.css";


const { Option } = Select;

type Props = {
  label: string;
  options: string[];
  setFunction: (value: any) => void;
  values: string[];
  placeHolder?: string;
  inputValue: string;
  setInputValue: (value: any) => void;
};

export default function SelectMultiple({
  label,
  options,
  values,
  setFunction,
  placeHolder = "",
  inputValue,
  setInputValue,
}: Props) {
  const { darkMode } = useContext(DarkModeContext);
  const containerClassName = darkMode
    ? "select-multiple-dark"
    : "select-multiple-light";

  return (

      <Select
        mode="multiple"
        maxTagCount={4}
        size="large"
        defaultValue={[options[0], options[1], options[2]]}
        className={`custom-select ${containerClassName}`}
        style={{ width: "400px", margin: "10px 30px" }}
        onChange={setFunction}
        value={values}
        onSearch={setInputValue}
        placeholder={placeHolder}
      >
        {options.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
  );
}
