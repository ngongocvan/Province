import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import Mst_Province from "./data/Mst_Province.json";
import Mst_District from "./data/Mst_District.json";


const { Option } = Select;

const Add = () => {
  const [form] = Form.useForm();
  const [districtList, setDistrictList] = useState(Mst_District);
  const [provinceList, setProvinceList] = useState(Mst_Province);
  const [provinceName, setProvinceName] = useState("");

  const handleProvinceChange = (value) => {
    const selected = provinceList.find((item) => item.ProvinceCode === value);
    setProvinceName(selected ? selected.ProvinceName : "");
    form.setFieldsValue({ provinceName: selected?.ProvinceName || "" });
  };

  const onFinish = (values) => {
    const newDistrict = {
      DistrictCode: values.districtCode,
      ProvinceCode: values.provinceCode,
      DistrictName: values.districtName,
      FlagActive: "1",
    };

    setDistrictList([...districtList, newDistrict]);

    message.success("Đã thêm Quận/Huyện thành công!");
    form.resetFields();
    setProvinceName("");
  };

  return (
    <div className="form-container">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <table>
          <tbody>
            <tr>
              <td><label>Mã tỉnh <span className="required">(*)</span></label></td>
              <td>
                <Form.Item
                  name="provinceCode"
                  rules={[{ required: true, message: "Bắt buộc!" }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="Chọn mã tỉnh"
                    onChange={handleProvinceChange}
                  >
                    {provinceList.map((item) => (
                      <Option key={item.ProvinceCode} value={item.ProvinceCode}>
                        {item.ProvinceCode}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </td>
            </tr>

            <tr>
              <td><label>Tên tỉnh</label></td>
              <td>
                <Form.Item name="provinceName" style={{ marginBottom: 0 }}>
                  <Input value={provinceName} disabled />
                </Form.Item>
              </td>
            </tr>

            <tr>
              <td><label>Mã Quận/Huyện <span className="required">(*)</span></label></td>
              <td>
                <Form.Item
                  name="districtCode"
                  rules={[{ required: true, message: "Bắt buộc!" }]}
                  style={{ marginBottom: 0 }}
                >
                  <Input />
                </Form.Item>
              </td>
            </tr>

            <tr>
              <td><label>Tên Quận/Huyện</label></td>
              <td>
                <Form.Item
                  name="districtName"
                  rules={[{ required: true, message: "Bắt buộc!" }]}
                  style={{ marginBottom: 0 }}
                >
                  <Input />
                </Form.Item>
              </td>
            </tr>

            <tr>
              <td colSpan={2} align="center">
                <Button type="primary">
                  Lưu
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Form>
    </div>
  );
};

export default Add;
