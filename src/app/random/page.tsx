"use client";
import React, { useState } from "react";
import { notification } from "antd";
import GenerateButtonGroup from "@/app/components/GenerateButtonGroup";
import NumberList from "@/app/components/NumberList";
import FilterForm from "@/app/components/FilterForm";
import useStore from "@/app/store/useStore";
import "./index.css";
interface Params {
  redOddEven: string;
  redBigSmall: string;
  redSumMin: number;
  redSumMax: number;
  isConsecutive: number;
  redDefinite1: number;
  redDefinite2: number;
  redKill1: number;
  redKill2: number;
  bluePosition: number;
  blueOddEven: string;
  blueBigSmall: string;
}
const SsqNumberGenerator = () => {
  // 定义生成的号码
  const { numbers, setNumbers } = useStore();
  // 定义是否展示机选条件
  const [showMachine, setShowMachine] = useState(false);
  // 定义条件参数对象，并限制params的对象属性，例如ts的type那种
  const [params, setParams] = useState({
    //   红球奇偶比
    redOddEven: "all",
    //   红球大小比
    redBigSmall: "all",
    //   红球和值最小值
    redSumMin: 21,
    //   红球和值最大值
    redSumMax: 183,
    //   是否产生连号
    isConsecutive: 0,
    //   红球定胆
    redDefinite1: "",
    redDefinite2: "",
    redDefinite3: "",
    redDefinite4: "",

    //   红球杀号
    redKill1: "",
    redKill2: "",
    redKill3: "",
    redKill4: "",
    //   蓝球定胆
    bluePosition: "",
    //   蓝球奇偶比
    blueOddEven: "all",
    //   蓝球大小比
    blueBigSmall: "all",
  });

  const oddRedNumbers = [
    1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33,
  ]; // 奇数
  const evenRedNumbers = [
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
  ]; // 偶数
  const smallRedNumbers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]; // 小数
  const largeRedNumbers = [
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
  ]; // 大数

  const smallBlueNumbers = [1, 2, 3, 4, 5, 6, 7, 8]; // 蓝球小数
  const largeBlueNumbers = [9, 10, 11, 12, 13, 14, 15, 16]; //蓝球大数
  const oddBlueNumbers = [1, 3, 5, 7, 9, 11, 13, 15]; // 蓝球奇数
  const evenBlueNumbers = [2, 4, 6, 8, 10, 12, 14, 16]; // 蓝球偶数
  const smallOddBlueNumbers = [1, 3, 5, 7]; // 蓝球小奇数
  const smallEvenBlueNumbers = [2, 4, 6, 8]; // 蓝球小偶数
  const largeOddBlueNumbers = [9, 11, 13, 15]; // 蓝球大奇数
  const largeEvenBlueNumbers = [10, 12, 14, 16]; // 蓝球大偶数

  // 生成蓝色号码
  const getBlueRandom = () => {
    let blueNumber = "";
    // 判断生成蓝球号码的条件
    console.log(params.bluePosition);
    if (params.bluePosition !== "") {
      blueNumber = params.bluePosition;
    } else if (params.blueOddEven === "all" && params.blueBigSmall === "all") {
      blueNumber = (Math.floor(Math.random() * 16) + 1).toString();
    } else if (params.blueOddEven === "0" && params.blueBigSmall === "all") {
      blueNumber = oddBlueNumbers[Math.floor(Math.random() * 8)].toString();
    } else if (params.blueOddEven === "1" && params.blueBigSmall === "all") {
      blueNumber = evenBlueNumbers[Math.floor(Math.random() * 8)].toString();
    } else if (params.blueOddEven === "all" && params.blueBigSmall === "0") {
      blueNumber = largeBlueNumbers[Math.floor(Math.random() * 8)].toString();
    } else if (params.blueOddEven === "all" && params.blueBigSmall === "1") {
      blueNumber = smallBlueNumbers[Math.floor(Math.random() * 8)].toString();
    } else if (params.blueOddEven === "0" && params.blueBigSmall === "0") {
      blueNumber =
        largeOddBlueNumbers[Math.floor(Math.random() * 4)].toString();
    } else if (params.blueOddEven === "1" && params.blueBigSmall === "1") {
      blueNumber =
        smallEvenBlueNumbers[Math.floor(Math.random() * 4)].toString();
    } else if (params.blueOddEven === "0" && params.blueBigSmall === "1") {
      blueNumber =
        smallOddBlueNumbers[Math.floor(Math.random() * 4)].toString();
    } else if (params.blueOddEven === "1" && params.blueBigSmall === "0") {
      blueNumber =
        largeEvenBlueNumbers[Math.floor(Math.random() * 4)].toString();
    } else if (params.bluePosition === "") {
      blueNumber = (Math.floor(Math.random() * 16) + 1).toString();
    }
    return blueNumber;
  };

  // 红球奇偶如果是0:6就是全是偶数，大小比是以16为分界线，小于16为小，大于16为大，红球是否连号代表着是否出现有连续的数字。请根据上面的条件，红球号码的和值范围，根据不同的选项返回不同的和值范围,帮我返回正确的最小值和最大值
  function generateRedBalls(
    oddEvenRatio: string | number,
    sizeRatio: string | number,
    sumMin: number,
    sumMax: number,
    isConsecutive: number,
    redDefinite1: number,
    redDefinite2: number,
    redKill1: string,
    redKill2: string,
  ) {
    const allNumbers = Array.from({ length: 33 }, (_, i) => i + 1); // 1 到 33 的所有红球号码
    const maxAttempts = 1000; // 最大尝试次数
    let selectedNumbers = [];
    let attempts = 0;
    let sumFlag = false; // 用于标记和值是否符合条件
    let consecutiveFlag = false; // 用于标记是否有连号

    // 判断红球定胆如果存在，从对应的数组中选择数字
    let redDefiniteNumbers = [redDefinite1, redDefinite2].filter(Boolean); // 过滤掉空值
    let uniqueDefiniteNumbers = [...new Set(redDefiniteNumbers)]; // 去重
    // 判断定胆数字中的小奇数、小偶数、大奇数、大偶数的个数
    let smallOddNumbersCount = uniqueDefiniteNumbers.filter(
      (num) => smallRedNumbers.includes(num) && oddRedNumbers.includes(num),
    ).length;
    let smallEvenNumbersCount = uniqueDefiniteNumbers.filter(
      (num) => smallRedNumbers.includes(num) && evenRedNumbers.includes(num),
    ).length;
    let largeOddNumbersCount = uniqueDefiniteNumbers.filter(
      (num) => largeRedNumbers.includes(num) && oddRedNumbers.includes(num),
    ).length;
    let largeEvenNumbersCount = uniqueDefiniteNumbers.filter(
      (num) => largeRedNumbers.includes(num) && evenRedNumbers.includes(num),
    ).length;

    // 判断定胆的数字是否符合奇偶比和大小比的条件

    if (
      // @ts-ignore
      smallOddNumbersCount + smallEvenNumbersCount > sizeRatio ||
      // @ts-ignore
      smallOddNumbersCount + largeOddNumbersCount > oddEvenRatio
    ) {
      //   提示定胆数字不符合奇偶比和大小比的条件
      notification.error({
        message: "定胆数字不符合奇偶比和大小比的条件",
      });
      return;
    } else if (
      (oddEvenRatio === "0" || oddEvenRatio === "6") &&
      isConsecutive === 1
    ) {
      //   提示定胆数字不符合奇偶比和大小比的条件
      notification.error({
        message: "定胆数字不符合奇偶比和连号的条件",
      });
      return;
    }

    // 判断红球杀号如果存在，从要选择的数组中去掉对应的数字
    let redKillNumbers = [redKill1, redKill2].filter(Boolean); // 过滤掉空值
    let uniqueKillNumbers = [...new Set(redKillNumbers)]; // 去重
    // 随机生成符合条件的变量值
    while (attempts < maxAttempts) {
      // 如果奇偶比和大小比都为 "all"，直接随机选择 6 个号码
      if (
        oddEvenRatio === "all" &&
        sizeRatio === "all" &&
        sumMin === 21 &&
        sumMax === 183 &&
        isConsecutive === 0 &&
        redDefinite1 === null &&
        redDefinite2 === null
      ) {
        selectedNumbers = getRandomUniqueNumbers(allNumbers, 6);
      } else {
        let oddCount: number, evenCount, smallCount: number, largeCount;
        // 处理奇偶比
        if (oddEvenRatio === "all") {
          // 设置奇数数量的最小值和最大值
          const minOddCount = smallOddNumbersCount + largeOddNumbersCount; // 奇数数量的最小值
          const maxOddCount =
            6 - (smallEvenNumbersCount + largeEvenNumbersCount); // 奇数数量的最大值
          oddCount = Math.floor(
            Math.random() * (maxOddCount - minOddCount + 1) + minOddCount,
          );
        } else {
          oddCount = Number(oddEvenRatio);
        }

        evenCount = 6 - oddCount; // 剩余为偶数

        // 处理大小比
        if (sizeRatio === "all") {
          // 设置小数数量的最小值和最大值
          const minSmallCount = smallOddNumbersCount + smallEvenNumbersCount; // 小数数量的最小值
          const maxSmallCount =
            6 - (largeOddNumbersCount + largeEvenNumbersCount); // 小数数量的最大值
          smallCount = Math.floor(
            Math.random() * (maxSmallCount - minSmallCount + 1) + minSmallCount,
          );
        } else {
          smallCount = Number(sizeRatio);
        }
        largeCount = 6 - smallCount; // 剩余为大数
        let smallOddCount;
        let largeEvenCount;
        // 设置小奇数的数量最小值为smallOddNumbersCount, 最大值为smallCount和oddCount的最小值
        if (smallCount === 6 && oddCount === 6) {
          smallOddCount = 6;
        } else if (smallCount === 0 && oddCount === 0) {
          smallOddCount = 0;
        } else {
          smallOddCount =
            Math.max(smallOddNumbersCount, 0) +
            Math.floor(
              Math.random() *
                (Math.min(smallCount, oddCount) - smallOddNumbersCount + 1),
            );
        }
        if (largeCount === 6 && evenCount === 6) {
          largeEvenCount = 6;
        } else if (largeCount === 0 && evenCount === 0) {
          largeEvenCount = 0;
        } else {
          largeEvenCount =
            Math.max(largeEvenNumbersCount, 0) +
            Math.floor(
              Math.random() *
                (Math.min(largeCount, evenCount) - largeEvenNumbersCount + 1),
            );
        }

        const largeOddCount = Math.min(
          largeCount - largeEvenCount,
          oddCount - smallOddCount,
        );
        const smallEvenCount = Math.min(
          smallCount - smallOddCount,
          evenCount - largeEvenCount,
        );

        // 确保总数不超过 6
        if (
          smallOddCount + smallEvenCount + largeOddCount + largeEvenCount ===
          6
        ) {
          // 从对应的数组中选择数字
          let smallOddNumbers = oddRedNumbers.filter(
            (num) =>
              smallRedNumbers.includes(num) &&
              !uniqueDefiniteNumbers.includes(num),
          );
          let smallEvenNumbers = evenRedNumbers.filter(
            (num) =>
              smallRedNumbers.includes(num) &&
              !uniqueDefiniteNumbers.includes(num),
          );
          let largeOddNumbers = oddRedNumbers.filter(
            (num) =>
              largeRedNumbers.includes(num) &&
              !uniqueDefiniteNumbers.includes(num),
          );
          let largeEvenNumbers = evenRedNumbers.filter(
            (num) =>
              largeRedNumbers.includes(num) &&
              !uniqueDefiniteNumbers.includes(num),
          );

          if (uniqueDefiniteNumbers.length > 0) {
            selectedNumbers = uniqueDefiniteNumbers;
          }

          if (uniqueKillNumbers.length > 0) {
            const filterKillNumbers = (numbers: any[]) =>
              numbers.filter((num: string) => !uniqueKillNumbers.includes(num));
            smallOddNumbers = filterKillNumbers(smallOddNumbers);
            smallEvenNumbers = filterKillNumbers(smallEvenNumbers);
            largeOddNumbers = filterKillNumbers(largeOddNumbers);
            largeEvenNumbers = filterKillNumbers(largeEvenNumbers);
          }

          selectedNumbers.push(
            ...getRandomUniqueNumbers(
              smallOddNumbers,
              smallOddCount - smallOddNumbersCount,
            ),
          );
          selectedNumbers.push(
            ...getRandomUniqueNumbers(
              smallEvenNumbers,
              smallEvenCount - smallEvenNumbersCount,
            ),
          );
          selectedNumbers.push(
            ...getRandomUniqueNumbers(
              largeOddNumbers,
              largeOddCount - largeOddNumbersCount,
            ),
          );
          selectedNumbers.push(
            ...getRandomUniqueNumbers(
              largeEvenNumbers,
              largeEvenCount - largeEvenNumbersCount,
            ),
          );
        }
      }
      // 判断和值是否符合条件
      const sum = selectedNumbers.reduce((acc, num) => acc + num, 0);
      if (sum >= sumMin && sum <= sumMax) {
        // 对最终选中的号码进行排序
        selectedNumbers.sort((a, b) => a - b);
        sumFlag = true;
      } else {
        // 如果和值条件不满足，重新生成
        sumFlag = false;
      }
      // 判断数组中是否符合条件，如果参数值为0则代表不限制是否有连号直接返回true,如果isConsecutive为1,则代表需要有连号，为2则代表不需要有连号
      if (isConsecutive === 0) {
        consecutiveFlag = true;
      } else if (isConsecutive === 1) {
        consecutiveFlag = checkConsecutive(selectedNumbers);
      } else if (isConsecutive === 2) {
        consecutiveFlag = !checkConsecutive(selectedNumbers);
      }

      if (sumFlag && consecutiveFlag) {
        return selectedNumbers;
      } else {
        selectedNumbers = [];
      }

      // 如果达到最大尝试次数，则跳出循环
      attempts++;
    }
    notification.error({
      message: "生成失败",
      description: `无法生成符合条件的红球号码，请调整条件并重试。`,
    });
  }

  // 检验数组中是否存在任意相邻的数字，只要存在相邻的数字就返回true，否则返回false
  function checkConsecutive(numbers: string | any[]) {
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] + 1 === numbers[i + 1]) {
        return true;
      }
    }
    return false;
  }

  // 随机选择不重复的红球数字
  function getRandomUniqueNumbers(pool: string | any[], count: number) {
    const result: any[] = [];
    while (result.length < count) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const number = pool[randomIndex];
      if (!result.includes(number)) {
        result.push(number);
      }
    }
    result.sort((a, b) => a - b);
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
        // @ts-ignore
        params.redDefinite1,
        params.redDefinite2,
        params.redKill1,
        params.redKill2,
      ).map((num) => num.toString().padStart(2, "0"));
      const blueBall = getBlueRandom().toString().padStart(2, "0");
      const newNumber = `${redBalls.join(",")} + ${blueBall}`;
      newNumbers.push(newNumber);
    }
    // 修改之前的代码使用 template literal, 直接用换行符替代并且避免 JSX 语法
    setNumbers([...numbers, ...newNumbers]);
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

  //
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