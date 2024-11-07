import React, { useEffect } from "react";
import RedBall from "@/app/components/RedBall";
import BlueBall from "@/app/components/BlueBall";
import { Row, Button } from "antd";
import { nanoid } from "nanoid";
import "./numberlist.css";

interface NumberListProps {
  numbers?: string[];
  setNumbers?: (newNumbers: string[]) => void;
}

const NumberList = ({ numbers, setNumbers }: NumberListProps) => {
  const clearNumbers = () => {
    setNumbers?.([]);
  };

  const deleteNumber = (index: number) => {
    // @ts-ignore
    const newNumbers = numbers.filter((_, i) => i !== index);
    // 保持原数组的排序不变
    setNumbers?.(newNumbers);
  };

  console.log(numbers, "list");
  return (
    <div style={{ marginTop: 16 }}>
      <Row
        justify={"start"}
        style={{ alignItems: "center", marginBottom: "10px" }}
      >
        <h3 style={{ marginRight: "20px" }}>生成的号码列表</h3>
        <Button type="primary" onClick={clearNumbers}>
          清空号码
        </Button>
      </Row>
      <ul className="select-number-list">
        {/* @ts-ignore */}
        {numbers.map((num, index) => {
          const redNumbers = num.split(" + ")[0];
          const blueNumber = num.split(" + ")[1];
          return (
            <li key={nanoid()}>
              <RedBall numbers={redNumbers} editable={true} />
              <BlueBall numbers={blueNumber} editable={true} />
              <Button onClick={() => deleteNumber(index)}>删除</Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NumberList;
