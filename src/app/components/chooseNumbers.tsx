import React, { useEffect } from "react";
import { Modal, Button, InputNumber } from "antd";
import RedBall from "@/app/components/RedBall";
import BlueBall from "@/app/components/BlueBall";
import useStore from "@/app/store/useStore";

interface ChooseNumbersProps {
  isOpen?: boolean;
  setIsOpen?: (value: ((prevState: boolean) => boolean) | boolean) => void;
  numbers?: string[];
  setNumbers?: (newNumbers: string[]) => void;
}

const ChooseNumbers = ({
  isOpen,
  setIsOpen,
  numbers,
  setNumbers,
}: ChooseNumbersProps) => {
  const { chooseNumber, setChooseNumbersNumber } = useStore();
  useEffect(() => {
    // 当值变更时重新渲染页面，选中的号码更新
    console.log("新的选择数更新:", chooseNumber);
  }, [chooseNumber]);
  // 定义1到33的红球以逗号分隔的字符串
  const redNumbers =
    "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33";
  // 定义1到16的篮球数组
  const blueNumbers = "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16";

  const handleOk = () => {
    setNumbers?.([
      `${chooseNumber.slice(0, 6).join(",")} + ${chooseNumber[6]}`,
    ]);
    setChooseNumbersNumber([]);
    setIsOpen?.(false);
  };

  const handleCancel = () => {
    setChooseNumbersNumber([]);
    setIsOpen?.(false);
  };

  return (
    <Modal
      title="选择号码"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="choose-mian">
        <div className="choose-red">
          <RedBall numbers={redNumbers} editable={false} isChoose={true} />
        </div>
        <div className="choose-blue">
          <BlueBall numbers={blueNumbers} editable={false} isChoose={true} />
        </div>
      </div>
      <div>选中的号码: {chooseNumber.join(",")}</div>
    </Modal>
  );
};

export default ChooseNumbers;
