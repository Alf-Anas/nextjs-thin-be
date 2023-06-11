import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Image, Popconfirm, Space, Tag, message } from "antd";
import moment from "moment";
import { deleteRecord, query } from "thin-backend";
import { useQuery } from "thin-backend-react";
import AddProduct from "./AddProduct";

export default function ListProduct() {
  const products = useQuery(query("products").orderBy("createdAt"));

  function deleteProduct(pId: string) {
    deleteRecord("products", pId);
    message.success("Berhasil menghapus barang!");
  }

  return (
    <>
      <Space wrap style={{ justifyContent: "space-between" }}>
        {products?.map((item, idx) => (
          <Card
            key={idx}
            hoverable
            style={{ width: 300 }}
            cover={<Image alt={item.nama} src={item.foto || ""} />}
          >
            <Card.Meta title={item.nama} />
            <span>
              Stok : <strong>{item.stok}</strong>
            </span>
            <br />
            <span>
              Harga beli : <strong>{item.hargaBeli}</strong>
            </span>
            <br />
            <span>
              Harga Jual : <strong>{item.hargaJual}</strong>
            </span>
            <br />
            <Tag>{moment(item.createdAt).format("DD MMM YYYY HH:mm:ss")}</Tag>
            <Space
              style={{ marginTop: "0.5rem", justifyContent: "space-between" }}
            >
              <AddProduct
                triggerButton={
                  <Button
                    type="primary"
                    shape="round"
                    icon={<EditOutlined />}
                    size="small"
                  >
                    Edit
                  </Button>
                }
                isEdit
                existingProduct={item}
              />

              <Popconfirm
                title="Hapus Barang"
                description="Anda yakin untuk menghapus barang ini?"
                onConfirm={() => deleteProduct(item.id)}
                okText="Ya"
                cancelText="Tidak"
              >
                <Button
                  danger
                  shape="round"
                  icon={<DeleteOutlined />}
                  size="small"
                >
                  Hapus
                </Button>
              </Popconfirm>
            </Space>
          </Card>
        ))}
      </Space>
    </>
  );
}
