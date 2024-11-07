"use client";
import React, { useState } from "react";
import { notification } from "antd";
import GenerateButtonGroup from "@/app/components/GenerateButtonGroup";
import NumberList from "@/app/components/NumberList";
import FilterForm from "@/app/components/FilterForm";
import useStore from "@/app/store/useStore";
import "./index.css";

// 定义参数接口
interface Params {
  redOddEven: string | number;
  redBigSmall: string | number;
  redSumMin: number;
  redSumMax: number;
  isConsecutive: number;
  redDefinite1: number;
  redDefinite2: number;
  redKill1: number;
  redKill2: number;
  bluePosition: number;
  blueOddEven: string | number;
  blueBigSmall: string | number;
}

// SsqNumberGenerator 组件
const SsqNumberGenerator = (totalSum: number) => {
  const { numbers, setNumbers } = useStore(); // 从状态管理中获取号码和设置号码的函数
  const [showMachine, setShowMachine] = useState(false); // 控制是否展示机选条件
  const [params, setParams] = useState({
    // 参数状态
    redOddEven: "all",
    redBigSmall: "all",
    redSumMin: 21,
    redSumMax: 183,
    isConsecutive: 0,
    redDefinite1: null,
    redDefinite2: null,
    redKill1: "",
    redKill2: "",
    bluePosition: "",
    blueOddEven: "all",
    blueBigSmall: "all",
  });

  // 定义红球和蓝球的数字数组

  const blueNumbers = Array.from({ length: 16 }, (_, i) => i + 1); // 蓝球

  // 生成蓝色号码
  const getBlueRandom = () => {
    let blueNumber: string = "";
    // 根据参数判断生成蓝球号码
    if (params.bluePosition) {
      blueNumber = params.bluePosition;
    } else {
      let oddBlueNumbers = blueNumbers.filter((num) => num % 2 !== 0); // 奇数蓝球
      let evenBlueNumbers = blueNumbers.filter((num) => num % 2 === 0); // 偶数蓝球
      let validBlueNumbers = blueNumbers; // 初始有效号码列表

      // 根据奇偶参数过滤
      if (params.blueOddEven === "0") {
        validBlueNumbers = oddBlueNumbers;
      } else if (params.blueOddEven === "1") {
        validBlueNumbers = evenBlueNumbers;
      }

      // 根据大小参数进一步过滤
      if (params.blueBigSmall === "0") {
        validBlueNumbers = validBlueNumbers.filter((num) => num > 8); // 大数蓝球
      } else if (params.blueBigSmall === "1") {
        validBlueNumbers = validBlueNumbers.filter((num) => num <= 8); // 小数蓝球
      }

      // 从有效号码中随机选择一个
      blueNumber =
        validBlueNumbers[
          Math.floor(Math.random() * validBlueNumbers.length)
        ].toString();
    }
    return blueNumber;
  };

  // 红球生成函数
  function generateRedBalls(
    oddEvenRatio: string | number,
    sizeRatio: string | number,
    sumMin: number,
    sumMax: number,
    isConsecutive: number,
    redDefinite1: null,
    redDefinite2: null,
    redKill1: string,
    redKill2: string,
  ) {
    const maxAttempts = 1000; // 最大尝试次数
    let selectedNumbers: number[] = [];
    const redDefiniteNumbers = [redDefinite1, redDefinite2].filter(Boolean);
    const uniqueDefiniteNumbers = [...new Set(redDefiniteNumbers)];
    const redKillNumbers = [redKill1, redKill2].filter(Boolean).map(Number);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      selectedNumbers = getRandomUniqueNumbers(
        Array.from({ length: 33 }, (_, i) => i + 1),
        6,
      ); // 随机选择6个数字
      let oddCount = selectedNumbers.filter((num) => num % 2 !== 0).length; // 奇数个数
      let smallCount = selectedNumbers.filter((num) => num <= 16).length; // 小数个数
      let totalSum = selectedNumbers.reduce((acc, num) => acc + num, 0); // 和

      // 检查是否包含定胆
      const hasDefiniteNumbers = uniqueDefiniteNumbers.every((num) =>
        // @ts-ignore
        selectedNumbers.includes(num),
      );
      // 检查是否包含杀号
      const hasKillingNumbers = redKillNumbers.every(
        (num) => !selectedNumbers.includes(num),
      );
      // 检查是否符合奇偶比
      const checkOddEvenRatio = checkOddEvenCondition(oddCount);
      // 检查是否符合大小比
      const checkSizeRatio = checkSizeCondition(smallCount);
      // 检查是否符合和值范围
      const checkSum = checkSumRange(totalSum);
      // 检查是否符合连号
      const hasConsecutiveNumbers =
        isConsecutive === 1
          ? checkConsecutive(selectedNumbers)
          : isConsecutive === 2
            ? !checkConsecutive(selectedNumbers)
            : true;
      if (
        hasDefiniteNumbers &&
        hasKillingNumbers &&
        checkOddEvenRatio &&
        checkSizeRatio &&
        checkSum &&
        hasConsecutiveNumbers
      ) {
        return selectedNumbers.sort((a, b) => a - b); // 返回排序后的号码
      }
    }
    notification.success({
      message: "生成失败",
      description: "无法生成符合条件的号码。",
    }); // 超过最大尝试次数返回空数组
  }

  // 检查是否有连续数字
  function checkConsecutive(numbers: number[]): boolean {
    const sortedNumbers = numbers.sort((a, b) => a - b);
    return sortedNumbers.some((num, i) => num === sortedNumbers[i - 1] + 1); // 使用some方法简化检查逻辑
  }

  // 检查是否符合大小比
  function checkSizeCondition(count: string | number) {
    if (params.redBigSmall !== "all") {
      return Number(count) === Number(params.redBigSmall);
    } else {
      return true;
    }
  }

  // 检查是否符合奇偶比
  function checkOddEvenCondition(count: string | number) {
    if (params.redOddEven !== "all") {
      return Number(count) === Number(params.redOddEven);
    } else {
      return true;
    }
  }

  // 检查是否符合和值范围
  function checkSumRange(totalSum: number) {
    return totalSum >= params.redSumMin && totalSum <= params.redSumMax;
  }

  // 随机选择不重复的数字
  function getRandomUniqueNumbers(pool: number[], count: number) {
    const result: number[] = [];
    while (result.length < count) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const number = pool[randomIndex];
      if (!result.includes(number)) {
        result.push(number);
      }
    }
    return result;
  }

  // 生成组合号码
  const generateNumbers = (count: number) => {
    const newNumbers = [];
    for (let i = 0; i < count; i++) {
      // @ts-ignore
      const redBalls = generateRedBalls(
        params.redOddEven,
        params.redBigSmall,
        params.redSumMin,
        params.redSumMax,
        params.isConsecutive,
        params.redDefinite1,
        params.redDefinite2,
        params.redKill1,
        params.redKill2,
      ).map((num) => num.toString().padStart(2, "0"));
      const blueBall = getBlueRandom().toString().padStart(2, "0");
      const newNumber = `${redBalls.join(",")} + ${blueBall}`;
      newNumbers.push(newNumber);
    }

    setNumbers([...numbers, ...newNumbers]); // 更新状态
    notification.success({
      message: "生成成功",
      description: (
        <div
          dangerouslySetInnerHTML={{
            __html: `生成的号码为:<br/> ${newNumbers.join("; <br/>")}`,
          }}
        />
      ),
    });
  };

  return (
    <div className="main-random">
      <NumberList numbers={numbers} setNumbers={setNumbers} />
      <GenerateButtonGroup
        generateNumbers={generateNumbers}
        setShowMachine={setShowMachine}
        showMachine={showMachine}
        // @ts-ignore
        params={params}
        setParams={setParams}
      />
      {showMachine && <FilterForm params={params} setParams={setParams} />}
    </div>
  );
};

export default SsqNumberGenerator;
