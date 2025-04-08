import React, { useState } from "react";
import {
  Row,
  Col,
  AutoComplete,
  Input,
  Button,
  Card,
  Space,
  Checkbox,
  Form,
  Select,
  Modal,
} from "antd";
import Mst_District from "./data/Mst_District.json";
import Mst_Province from "./data/Mst_Province.json";
import Add from "./Add";
const { Option } = Select;

const CardView = () => {
  const [form] = Form.useForm();
  const [resultData, setResultData] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
// /sdasdad
  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalVisible(false);
  };
  const handleProvinceSearch = (value) => {
    const filtered = Mst_Province.filter((p) =>
      p.ProvinceName.toLowerCase().includes(value.toLowerCase())
    ).map((p) => ({
      value: p.ProvinceName,
      code: p.ProvinceCode,
    }));
    setProvinceOptions(filtered);
  };

  const handleDistrictSearch = (value) => {
    const provinceName = form.getFieldValue("province");
    const selectedProvince = Mst_Province.find(
      (p) => p.ProvinceName === provinceName
    );

    if (!selectedProvince) {
      setDistrictOptions([]);
      return;
    }

    const filtered = Mst_District.filter(
      (d) =>
        d.ProvinceCode === selectedProvince.ProvinceCode &&
        d.DistrictName.toLowerCase().includes(value.toLowerCase())
    ).map((d) => ({
      value: d.DistrictName,
      code: d.DistrictCode,
    }));

    setDistrictOptions(filtered);
  };

  const handleSearch = () => {
    const { province, district, status } = form.getFieldsValue();

    const provinceObj = Mst_Province.find((p) => p.ProvinceName === province);
    const districtObj = Mst_District.find((d) => d.DistrictName === district);

    const filtered = Mst_District.filter((item) => {
      const matchProvince = provinceObj
        ? item.ProvinceCode === provinceObj.ProvinceCode
        : true;
      const matchDistrict = districtObj
        ? item.DistrictCode === districtObj.DistrictCode
        : true;
      const matchStatus =
        status === "active"
          ? item.FlagActive === "1"
          : status === "inactive"
          ? item.FlagActive === "0"
          : true;

      return matchProvince && matchDistrict && matchStatus;
    });

    setResultData(filtered);
    setSelectedItems([]); 
  };

  const handleSelectCheckbox = (districtCode, checked) => {
    setSelectedItems((prev) =>
      checked
        ? [...prev, districtCode]
        : prev.filter((code) => code !== districtCode)
    );
  };

  const handleDelete = () => {
    const newData = resultData.filter(
      (item) => !selectedItems.includes(item.DistrictCode)
    );
    setResultData(newData);
    setSelectedItems([]); 
  };

  return (
    <Card style={{ padding: 16, width: "50%", margin: "0 auto" }}>
      <Form form={form}>
        <Col span={6}>
          <Space style={{ width: "100%", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <label>Tỉnh/TP</label>
              <Form.Item name="province" style={{ width: 150 }}>
                <AutoComplete
                  placeholder="Nhập tên Tỉnh/TP"
                  onSearch={handleProvinceSearch}
                  options={provinceOptions}
                  allowClear
                  filterOption={false}
                />
              </Form.Item>

              <Button type="primary" onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <label>Quận/Huyện</label>
              <Form.Item name="district" style={{ width: 150 }}>
                <AutoComplete
                  placeholder="Nhập tên Quận/Huyện"
                  onSearch={handleDistrictSearch}
                  options={districtOptions}
                  allowClear
                  disabled={!form.getFieldValue("province")}
                  filterOption={false}
                />
              </Form.Item>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <label>Trạng thái</label>
              <Form.Item name="status">
                <Select placeholder="Chọn trạng thái" allowClear>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </div>
          </Space>
        </Col>
        <Button type="primary" onClick={showAddModal}>
          Thêm
        </Button>
        <Modal
          title="Thêm mới"
          open={isAddModalVisible}
          onCancel={handleAddModalClose}
          footer={null}
          destroyOnClose
        >
          <Add onClose={handleAddModalClose} />
        </Modal>
      </Form>

      {resultData.length > 0 && (
        <>
          <Row style={{ marginTop: 24 }} justify="space-between" align="middle">
            <Button type="primary" danger onClick={handleDelete}>
              Xóa
            </Button>
            <Select defaultValue="CardView" style={{ width: 120 }}>
              <Option value="CardView">CardView</Option>
              <Option value="ListView">ListView</Option>
            </Select>
          </Row>

          <div style={{ marginTop: 24 }}>
            {resultData.map((item, index) => (
              <Card key={index} style={{ marginBottom: 16 }}>
                <Row justify="space-between">
                  <Col
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <Checkbox
                      checked={selectedItems.includes(item.DistrictCode)}
                      onChange={(e) =>
                        handleSelectCheckbox(
                          item.DistrictCode,
                          e.target.checked
                        )
                      }
                    />
                    <div>
                      <strong>{item.DistrictName}</strong>
                    </div>
                    <div>{item.DistrictCode}</div>
                  </Col>
                  <Col>
                    <div>{item.ProvinceCode}</div>
                    <div>{item.FlagActive === "1" ? "Active" : "Inactive"}</div>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default CardView;
