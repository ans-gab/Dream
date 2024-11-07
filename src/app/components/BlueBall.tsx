"use client";
import React, { useState, useEffect } from "react";
import { InputNumber, Tooltip } from "antd"; // 引入 Ant Design 的 InputNumber
import useStore from "@/app/store/useStore";
import "./ball.css";

// @ts-ignore
interface BlueBallProps {
  numbers?: string;
  editable?: boolean;
  isChoose?: boolean;
}

const BlueBall = ({ numbers, editable, isChoose }: BlueBallProps) => {
  const { data } = useStore();
  // @ts-ignore
  const initialNumbers = numbers.split(",");
  const [numberList, setNumberList] = useState(initialNumbers);
  const [editIndex, setEditIndex] = useState(-1);

  // 定义是否被选中
  const [selectStates, setSelectStates] = useState<string[]>(
    Array(numberList.length).fill("circle blue-ball"),
  );
  const { chooseNumber, setChooseNumbersNumber } = useStore();

  // 初始加载时，默认都没有选中
  useEffect(() => {
    setSelectStates(Array(numberList.length).fill("circle blue-ball"));
  }, [initialNumbers]);

  // 根据传入的参数，统计当前红球号码出现的次数;
  function getCount(num: any) {
    let count = 0;
    data.forEach((item) => {
      if (item.blue.split(",").includes(num)) {
        count++;
      }
    });
    return count;
  }

  // 定义提示信息
  const tooltip = (num: any) => {
    let count = getCount(num);
    return `${num}在当前时间区间内出现了${count}次`;
  };

  const handleInputChange = (index: string | number, value: any) => {
    // 将输入值转换为字符串，并在前面补零
    const paddedValue = String(value).padStart(2, "0");
    const updatedList = [...numberList];
    // @ts-ignore
    updatedList[index] = paddedValue;
    setNumberList(updatedList);
  };

  const handleClick = (item: string, index: React.SetStateAction<number>) => {
    if (editable) {
      setEditIndex(index);
    }
    if (isChoose) {
      const updatedSelectStates = [...selectStates];
      // @ts-ignore
      if (updatedSelectStates[index] === "circle blue-ball") {
        updatedSelectStates[index] = "circle blue-ball choose";
        let newChooseNumber = [...chooseNumber, item];
        setChooseNumbersNumber(newChooseNumber);
      } else {
        updatedSelectStates[index] = "circle blue-ball";
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
        key={item}
        className={selectStates[index]}
        onClick={() => handleClick(item, index)}
      >
        {editIndex === index ? (
          <InputNumber
            value={item}
            onChange={(value) => handleInputChange(index, value)}
            onBlur={handleBlur}
            changeOnWheel
            min={"1"} // 设置最小值
            max={"16"} // 设置最大值
            width={30}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff !important",
            }} // 设置背景为透明和无边框
            autoFocus
          />
        ) : (
          item
        )}
      </span>
    </Tooltip>
  ));
};

export default BlueBall;
