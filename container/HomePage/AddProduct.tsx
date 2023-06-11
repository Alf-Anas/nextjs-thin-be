import { Button, Form, Input, Modal, Upload, UploadFile, message } from "antd";
import { ReactElement, cloneElement, useEffect, useState } from "react";
import {
  createRecord,
  Product as ProductType,
  updateRecord,
} from "thin-backend";
import { useCurrentUser } from "thin-backend-react";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { errorResponse, fileToBase64 } from "@/utils";

type Product = {
  nama: string;
  harga_beli: number | undefined;
  harga_jual: number | undefined;
  stok: number;
  foto: UploadFile | undefined | string;
};

const intialProduct: Product = {
  nama: "",
  harga_beli: undefined,
  harga_jual: undefined,
  stok: 0,
  foto: undefined,
};

const TriggerButton = (
  <Button
    type="primary"
    shape="round"
    icon={<PlusCircleOutlined />}
    size="large"
  >
    Tambah Barang
  </Button>
);

type Props = {
  isEdit?: boolean;
  title?: string;
  triggerButton?: ReactElement;
  existingProduct?: ProductType;
};

export default function AddProduct({
  isEdit = false,
  existingProduct = {} as ProductType,
  title = "Tambah Barang Baru",
  triggerButton = TriggerButton,
}: Props) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const user = useCurrentUser();
  const [product, setProduct] = useState(intialProduct);

  useEffect(() => {
    if (isEdit) {
      setProduct({
        nama: existingProduct.nama,
        harga_beli: existingProduct.hargaBeli,
        harga_jual: existingProduct.hargaJual,
        stok: existingProduct.stok,
        foto: existingProduct.foto || undefined,
      });
    }
  }, [isEdit, existingProduct]);

  const handleOk = async () => {
    console.log(product);
    if (
      !product.nama ||
      product.harga_jual === undefined ||
      product.harga_beli === undefined ||
      product.stok === undefined ||
      product.foto === undefined
    ) {
      message.error("Data tidak lengkap!");
      return;
    }
    const eFoto =
      typeof product.foto === "string"
        ? product.foto
        : await fileToBase64(product.foto?.originFileObj);
    setConfirmLoading(true);

    if (isEdit) {
      updateRecord("products", existingProduct.id, {
        userId: user?.id,
        nama: product.nama,
        hargaJual: Number(product.harga_jual),
        hargaBeli: Number(product.harga_beli),
        stok: Number(product.stok),
        foto: String(eFoto),
      })
        .then(() => {
          message.success("Berhasil mengupdate barang!");
          setProduct(intialProduct);
          setOpen(false);
        })
        .catch((err) => message.error(errorResponse(err)))
        .finally(() => setConfirmLoading(false));
    } else {
      createRecord("products", {
        userId: user?.id,
        nama: product.nama,
        hargaJual: Number(product.harga_jual),
        hargaBeli: Number(product.harga_beli),
        stok: Number(product.stok),
        foto: String(eFoto),
      })
        .then(() => {
          message.success("Berhasil menambahkan barang!");
          setProduct(intialProduct);
          setOpen(false);
        })
        .catch((err) => message.error(errorResponse(err)))
        .finally(() => setConfirmLoading(false));
    }
  };

  return (
    <>
      {cloneElement(triggerButton, {
        onClick: () => setOpen(true),
      })}
      <Modal
        title={title}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form layout="vertical">
          <Form.Item label="Nama Barang" required>
            <Input
              size="large"
              placeholder="Nama Barang"
              value={product.nama}
              onChange={(e) => {
                setProduct({ ...product, nama: e.target.value });
              }}
            />
          </Form.Item>
          <Form.Item label="Harga Beli (Rp.)" required>
            <Input
              size="large"
              type="number"
              placeholder="Rp."
              value={product.harga_beli}
              onChange={(e) => {
                setProduct({ ...product, harga_beli: Number(e.target.value) });
              }}
            />
          </Form.Item>
          <Form.Item label="Harga Jual (Rp.)" required>
            <Input
              size="large"
              type="number"
              placeholder="Rp."
              value={product.harga_jual}
              onChange={(e) => {
                setProduct({ ...product, harga_jual: Number(e.target.value) });
              }}
            />
          </Form.Item>
          <Form.Item label="Stok" required>
            <Input
              size="large"
              type="number"
              placeholder="0"
              value={product.stok}
              onChange={(e) => {
                setProduct({ ...product, stok: Number(e.target.value) });
              }}
            />
          </Form.Item>
          <Form.Item
            required
            label="Foto Barang"
            extra="Ukuran file maksimal 100kb dalam format .png atau .jpg"
          >
            <Upload
              name="foto"
              listType="picture"
              accept=".png, .jpg"
              fileList={
                product.foto && typeof product.foto !== "string"
                  ? [product.foto]
                  : []
              }
              onChange={(e) => {
                if (e.file?.size && e.file?.size > 100000) {
                  message.error("Ukuran file melebihi 100kb!");
                  setProduct({ ...product, foto: undefined });
                } else {
                  setProduct({ ...product, foto: e.file });
                }
              }}
            >
              <Button size="large" icon={<UploadOutlined />}>
                Pilih Foto
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
