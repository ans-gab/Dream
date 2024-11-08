"use client";
import React, { useState, useEffect } from "react";
import { InputNumber, Tooltip, notification } from "antd"; // 引入 Ant Design 的 InputNumber
import useStore from "@/app/store/useStore";
import "./ball.css";

// @ts-ignore
interface BlueBallProps {
  numbers?: string;
  editable?: boolean;
  isChoose?: boolean;
  isOpen?: boolean | undefined;
}

const BlueBall = ({ numbers, editable, isChoose, isOpen }: BlueBallProps) => {
  const { data } = useStore();
  const [numberList, setNumberList] = useState(numbers?.split(","));
  const [editIndex, setEditIndex] = useState(-1);
  // 定义是否被选中
  const [selectStates, setSelectStates] = useState<string[]>(
    Array(numberList?.length).fill("circle blue-ball"),
  );
  const { chooseBlueNumber, setChooseBlueNumber } = useStore();
  // 初始加载时，默认都没有选中
  useEffect(() => {
    if (chooseBlueNumber.length === 0) {
      setSelectStates(Array(numberList?.length).fill("circle blue-ball"));
    }
  }, [chooseBlueNumber]);

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
    // @ts-ignore
    const updatedList = [...numberList];
    // @ts-ignore
    updatedList[index] = paddedValue;
    setNumberList(updatedList);
  };

  const handleClick = (item: string, index: number) => {
    if (editable) {
      setEditIndex(index);
    }
    if (isChoose) {
      const updatedSelectStates = [...selectStates];
      // @ts-ignore
      if (updatedSelectStates[index] === "circle blue-ball") {
        console.log(chooseBlueNumber);
        if (chooseBlueNumber.length < 1) {
          updatedSelectStates[index] = "circle blue-ball choose";
          setChooseBlueNumber([item]);
        } else {
          // Optionally, you can alert the user or handle the excess item case here
          notification.warning({
            message: "数字超量",
            description: "已选择的蓝球不能超过1个",
          });
        }
      } else {
        updatedSelectStates[index] = "circle blue-ball";
        let newChooseNumber = chooseBlueNumber.filter((num) => num !== item);
        setChooseBlueNumber(newChooseNumber);
      }
      setSelectStates(updatedSelectStates);
    }
  };

  const handleBlur = () => {
    numberList?.sort(
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
