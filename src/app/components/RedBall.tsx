"use client";
import React, { useState } from "react";
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

  const handleClick = (index: React.SetStateAction<number>) => {
    if (editable) {
      setEditIndex(index);
    }
    if (isChoose) {
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
      <span className="circle red-ball" onClick={() => handleClick(index)}>
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
