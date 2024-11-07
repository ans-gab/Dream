import React, { useState } from "react";
import { Modal, Button, InputNumber } from "antd";
import RedBall from "@/app/components/RedBall";
import BlueBall from "@/app/components/BlueBall";

const ChooseNumbers = () => {
  const [open, setOpen] = useState(false);
  const [numbers, setNumbers] = useState([]);
  // 定义1到33的红球以逗号分隔的字符串
  const redNumbers =
    "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33";
  // 定义1到16的篮球数组
  const blueNumbers = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16";

  const handleOk = () => {
    setOpen(false);
    // 处理选择的号码
    console.log("选中的号码:", numbers);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleNumberChange = (value) => {
    setNumbers([...numbers, value]);
  };

  return (
    <Modal title="选择号码" open={open} onOk={handleOk} onCancel={handleCancel}>
      <div className="choose-mian">
        <div className="choose-red">
          <RedBall numbers={redNumbers} editable={false} />
        </div>
        <div className="choose-blue">
          <BlueBall numbers={blueNumbers} editable={false} />
        </div>
      </div>
      <div>选中的号码: {numbers.join(", ")}</div>
    </Modal>
  );
};

export default ChooseNumbers;
