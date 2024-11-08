import React, { useEffect } from "react";
import { Modal, notification } from "antd";
import RedBall from "@/app/components/RedBall";
import BlueBall from "@/app/components/BlueBall";
import useStore from "@/app/store/useStore";

interface ChooseNumbersProps {
  isOpen?: boolean;
  setIsOpen?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

const ChooseNumbers = ({ isOpen, setIsOpen }: ChooseNumbersProps) => {
  const {
    chooseRedNumber,
    setChooseRedNumber,
    chooseBlueNumber,
    setChooseBlueNumber,
    numbers,
    setNumbers,
  } = useStore();
  // 定义1到33的红球以逗号分隔的字符串
  const redNumbers =
    "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33";
  // 定义1到16的篮球数组
  const blueNumbers = "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16";

  const handleOk = () => {
    // 判断选择的数字数量是否满足chooseRedNumber=6  chooseBlueNumber=1
    if (chooseRedNumber.length === 6 || chooseBlueNumber.length === 1) {
      numbers?.push(
        `${chooseRedNumber.slice(0, 6).join(",")} + ${chooseBlueNumber[0]}`,
      );
      setNumbers?.(numbers);
      setChooseRedNumber([]);
      setChooseBlueNumber([]);
    } else {
      notification.warning({
        message: "数量不够",
        description: "已选择的号码数量不够，请继续添加",
      });
      return;
    }
    setIsOpen?.(false);
  };

  const handleCancel = () => {
    setChooseRedNumber([]);
    setChooseBlueNumber([]);
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
          <RedBall
            isOpen={isOpen}
            numbers={redNumbers}
            editable={false}
            isChoose={true}
          />
        </div>
        <div className="choose-blue">
          <BlueBall
            isOpen={isOpen}
            numbers={blueNumbers}
            editable={false}
            isChoose={true}
          />
        </div>
      </div>
      <div>
        选中的号码:{" "}
        {chooseRedNumber.join(",") + "+" + chooseBlueNumber?.join(",")}
      </div>
    </Modal>
  );
};

export default ChooseNumbers;
