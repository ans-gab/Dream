"use client";
import React, { useState, useEffect } from "react";
import useStore from "@/app/store/useStore"; // 引入 Zustand store
import { InputNumber, Tooltip } from "antd";
import "./ball.css";

// @ts-ignore

interface RedBallProps {
  numbers?: string;
  editable?: boolean;
  isChoose?: boolean;
}

const RedBall = ({ numbers, editable, isChoose }: RedBallProps) => {
  const { data } = useStore();
  // @ts-ignore
  const [numberList, setNumberList] = useState(numbers.split(","));
  const [editIndex, setEditIndex] = useState(-1);
  // 定义是否被选中
  const [selectStates, setSelectStates] = useState<string[]>(
    Array(numberList.length).fill("circle red-ball"),
  );
  const { chooseNumber, setChooseNumbersNumber } = useStore();
  // 初始加载时，默认都没有选中
  useEffect(() => {
    setSelectStates(Array(numberList.length).fill("circle red-ball"));
  }, [numbers]);

  // 定义选中的号码、
  function getCount(num: any) {
    let count = 0;
    data.forEach((item) => {
      if (item.red.split(",").includes(num)) {
        count++;
      }
    });
    return count;
  }

  const tooltip = (num: any) => {
    let count = getCount(num);
    return `${num}在当前时间区间内出现了${count}次`;
  };

  const handleInputChange = (index: string | number, value: any) => {
    const paddedValue = String(value).padStart(2, "0");

    if (numberList.includes(paddedValue)) {
    } else {
      const updatedList = [...numberList];
      // @ts-ignore
      updatedList[index] = paddedValue;
      setNumberList(updatedList);
    }
  };

  const handleClick = (item: string, index: React.SetStateAction<number>) => {
    if (editable) {
      setEditIndex(index);
    }

    if (isChoose) {
      const updatedSelectStates = [...selectStates];
      if (updatedSelectStates[index] === "circle red-ball") {
        if (chooseNumber.length < 6) {
          updatedSelectStates[index] = "circle red-ball choose";
          let newChooseNumber = [...chooseNumber, item];
          setChooseNumbersNumber(newChooseNumber);
        } else {
          // Optionally, you can alert the user or handle the excess item case here
          console.log("Cannot select more than 6 balls.");
        }
      } else {
        updatedSelectStates[index] = "circle red-ball";
        let newChooseNumber = chooseNumber.filter((num) => num !== item);
        setChooseNumbersNumber(newChooseNumber);
      }
      setSelectStates(updatedSelectStates);
    }
  };

  const handleBlur = () => {
    numberList.sort(
      (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10),
    );
    setEditIndex(-1);
  };

  // @ts-ignore
  return numberList.map((item, index) => (
    <Tooltip title={tooltip(item)} key={item}>
      <span
        className={selectStates[index]}
        onClick={() => handleClick(item, index)}
      >
        {editIndex === index ? (
          <InputNumber
            value={item}
            onChange={(value) => handleInputChange(index, value)}
            onBlur={handleBlur}
            changeOnWheel
            min={"1"}
            max={"33"}
            width={30}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff !important",
            }}
            autoFocus
          />
        ) : (
          item
        )}
      </span>
    </Tooltip>
  ));
};

export default RedBall;
