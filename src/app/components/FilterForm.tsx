import React, { useState } from "react";
import { Form, InputNumber, Row, Radio, Select } from "antd";
// @ts-ignore
const FilterForm = ({ params, setParams }) => {
  // 红球最小和值
  const [redSumMin, setRedSumMin] = useState(21);
  // 红球最大和值
  const [redSumMax, setRedSumMax] = useState(183);
  return (
    <Form>
      <Row>
        <h3 style={{ color: "red" }}>红球过滤条件</h3>
      </Row>
      <Row>
        <Form.Item
          label="奇偶比"
          style={{ width: "200px", marginRight: "20px" }}
        >
          <Select
            value={params.redOddEven}
            onChange={(e) => setParams({ ...params, redOddEven: e })}
          >
            <Select.Option value="all">随机</Select.Option>
            <Select.Option value="0">全偶</Select.Option>
            <Select.Option value="1">1奇:5偶</Select.Option>
            <Select.Option value="2">2奇:4偶</Select.Option>
            <Select.Option value="3">3奇:3偶</Select.Option>
            <Select.Option value="4">4奇:2偶</Select.Option>
            <Select.Option value="5">5奇:1偶</Select.Option>
            <Select.Option value="6">6奇:0偶</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="大小比"
          style={{ width: "200px", marginRight: "20px" }}
        >
          <Select
            value={params.redBigSmall}
            onChange={(e) => {
              setParams({ ...params, redBigSmall: e });
            }}
          >
            <Select.Option value="all">随机</Select.Option>
            <Select.Option value="0">0小:6大</Select.Option>
            <Select.Option value="1">1小:5大</Select.Option>
            <Select.Option value="2">2小:4大</Select.Option>
            <Select.Option value="3">3小:3大</Select.Option>
            <Select.Option value="4">4小:2大</Select.Option>
            <Select.Option value="5">5小:1大</Select.Option>
            <Select.Option value="6">6小:0大</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="和值范围"
          style={{ width: "280px", marginRight: "20px" }}
        >
          <InputNumber
            value={params.redSumMin}
            min={redSumMin}
            max={redSumMax}
            defaultValue={redSumMin}
            changeOnWheel
            style={{ width: 40 }}
            onChange={(e) => setParams({ ...params, redSumMin: e })}
          />
          到
          <InputNumber
            value={params.redSumMax}
            min={redSumMin}
            max={redSumMax}
            defaultValue={redSumMax}
            changeOnWheel
            style={{ width: 40 }}
            onChange={(e) => setParams({ ...params, redSumMax: e })}
          />
        </Form.Item>
        <Form.Item
          label="产生连号"
          style={{ width: "250px", marginRight: "20px" }}
        >
          <Radio.Group
            value={params.isConsecutive}
            onChange={(e) => {
              setParams({ ...params, isConsecutive: e.target.value });
            }}
          >
            <Radio value={0}>随机</Radio>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Row>
      <Row>
        <Form.Item label="红球定胆" style={{ marginRight: "20px" }}>
          <InputNumber
            value={params.redDefinite1}
            min={1}
            max={33}
            changeOnWheel
            style={{ width: 40 }}
            onChange={(e) =>
              setParams({
                ...params,
                redDefinite1: e,
              })
            }
          />
          <InputNumber
            value={params.redDefinite2}
            min={1}
            max={33}
            changeOnWheel
            style={{ width: 40 }}
            onChange={(e) =>
              setParams({
                ...params,
                redDefinite2: e,
              })
            }
          />
        </Form.Item>
        <Form.Item label="红球杀号">
          <InputNumber
            value={params.redKill1}
            min={1}
            max={33}
            style={{ width: 40 }}
            changeOnWheel
            onChange={(e) =>
              setParams({
                ...params,
                redKill1: e,
              })
            }
          />
          <InputNumber
            value={params.redKill2}
            min={1}
            max={33}
            style={{ width: 40 }}
            changeOnWheel
            onChange={(e) =>
              setParams({
                ...params,
                redKill2: e,
              })
            }
          />
        </Form.Item>
      </Row>
      <Row>
        <h3 style={{ color: "blue" }}>蓝球过滤条件</h3>
      </Row>
      <Row>
        <Form.Item label="蓝球定位" style={{ marginRight: "20px" }}>
          <InputNumber
            value={params.bluePosition}
            onChange={(e) => {
              setParams({ ...params, bluePosition: e || "" });
            }}
            min={1}
            max={16}
            style={{ width: 40 }}
            changeOnWheel
          />
        </Form.Item>
        <Form.Item label="蓝球大小" style={{ marginRight: "20px" }}>
          <Select
            value={params.blueBigSmall}
            onChange={(e) => {
              setParams({ ...params, blueBigSmall: e });
            }}
            style={{ width: 100 }}
          >
            <Select.Option value="all">随机</Select.Option>
            <Select.Option value="0">大</Select.Option>
            <Select.Option value="1">小</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="蓝球奇偶" style={{ marginRight: "40px" }}>
          <Select
            value={params.blueOddEven}
            style={{ width: 100 }}
            onChange={(e) => {
              setParams({ ...params, blueOddEven: e });
            }}
          >
            <Select.Option value="all">随机</Select.Option>
            <Select.Option value="0">奇</Select.Option>
            <Select.Option value="1">偶</Select.Option>
          </Select>
        </Form.Item>
      </Row>
    </Form>
  );
};

export default FilterForm;
