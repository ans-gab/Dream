import React from "react";
import { Button, Space } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
const GenerateButtonGroup: React.FC<{
  generateNumbers: (count: number) => void;
  setShowMachine: (show: boolean) => void;
  showMachine: boolean;
  setParams: (params: any) => void;
}> = ({ generateNumbers, setShowMachine, showMachine, setParams }) => {
  // 将搜索参数重置
  const resetParams = () => {
    setParams({
      redOddEven: "all",
      redBigSmall: "all",
      redSumMin: 21,
      redSumMax: 183,
      isConsecutive: 0,
      redDefinite1: "",
      redDefinite2: "",
      redDefinite3: "",
      redDefinite4: "",
      redKill1: "",
      redKill2: "",
      redKill3: "",
      redKill4: "",
      bluePosition: "",
      blueOddEven: "all",
      blueBigSmall: "all",
    });
  };
  return (
    <Space>
      <Button type="primary" onClick={() => generateNumbers(1)}>
        机选一注
      </Button>
      <Button type="primary" onClick={() => generateNumbers(5)}>
        机选五注
      </Button>
      <Button
        icon={!showMachine ? <DownOutlined /> : <UpOutlined />}
        type="primary"
        onClick={() => {
          setShowMachine(!showMachine);
        }}
      >
        机选条件
      </Button>
      <Button type="primary" onClick={resetParams}>
        清空搜索参数
      </Button>
      <Button type="primary">自选号码</Button>
    </Space>
  );
};

export default GenerateButtonGroup;
