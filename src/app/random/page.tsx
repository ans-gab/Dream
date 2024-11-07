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
    const redDefiniteNumbers = [redDefinite1, redDefinite2].filter(Boolean);
    const uniqueDefiniteNumbers = [...new Set(redDefiniteNumbers)];
    const redKillNumbers = [redKill1, redKill2].filter(Boolean).map(Number);

    // 将数字按照大小和奇偶分类
    const smallOddNumbers = Array.from({ length: 8 }, (_, i) => i * 2 + 1);
    const smallEvenNumbers = Array.from({ length: 8 }, (_, i) => (i + 1) * 2);
    const bigOddNumbers = Array.from({ length: 8 }, (_, i) => i * 2 + 17);
    const bigEvenNumbers = Array.from({ length: 9 }, (_, i) => (i + 9) * 2);

    const generateValidNumbers = () => {
      let numbers: number[] = [];
      const targetOddCount = oddEvenRatio !== "all" ? Number(oddEvenRatio) : -1;
      const targetSmallCount = sizeRatio !== "all" ? Number(sizeRatio) : -1;

      if (targetOddCount !== -1 && targetSmallCount !== -1) {
        // 计算每种类型需要的数量
        const smallOddCount = Math.min(targetOddCount, targetSmallCount);
        const smallEvenCount = targetSmallCount - smallOddCount;
        const bigOddCount = targetOddCount - smallOddCount;
        const bigEvenCount = 6 - smallOddCount - smallEvenCount - bigOddCount;

        // 从各个类别中选择对应数量的数字
        numbers = [
          ...getRandomUniqueNumbers(smallOddNumbers, smallOddCount),
          ...getRandomUniqueNumbers(smallEvenNumbers, smallEvenCount),
          ...getRandomUniqueNumbers(bigOddNumbers, bigOddCount),
          ...getRandomUniqueNumbers(bigEvenNumbers, bigEvenCount),
        ];
      } else {
        numbers = getRandomUniqueNumbers(
          Array.from({ length: 33 }, (_, i) => i + 1),
          6,
        );
      }

      // 检查和值范围
      const sum = numbers.reduce((acc, num) => acc + num, 0);
      if (sum < sumMin || sum > sumMax) return null;

      // 检查定胆和杀号
      if (!uniqueDefiniteNumbers.every((num) => numbers.includes(Number(num))))
        return null;
      if (redKillNumbers.some((num) => numbers.includes(num))) return null;

      // 检查连号要求
      const hasConsecutive = checkConsecutive(numbers);
      if (isConsecutive === 1 && !hasConsecutive) return null;
      if (isConsecutive === 2 && hasConsecutive) return null;

      return numbers;
    };

    for (let attempt = 0; attempt < 1000; attempt++) {
      const result = generateValidNumbers();
      if (result) {
        return result.sort((a, b) => a - b);
      }
    }

    notification.success({
      message: "生成失败",
      description: "无法生成符合条件的号码。",
    });
  }

  // 检查是否有连续数字
  function checkConsecutive(numbers: number[]): boolean {
    const sortedNumbers = numbers.sort((a, b) => a - b);
    return sortedNumbers.some((num, i) => num === sortedNumbers[i - 1] + 1); // 使用some方法简化检查逻辑
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
