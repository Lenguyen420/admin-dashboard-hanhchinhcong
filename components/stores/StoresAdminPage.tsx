"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  createStore,
  deleteStore,
  getStores,
  updateStore,
  type Store,
} from "@/services/stores";

type StoreForm = {
  name: string;
  description: string;
  ownerName: string;
  representative: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  imageUrl: string;
  logoUrl: string;
  status: string;
};

const initialForm: StoreForm = {
  name: "",
  description: "",
  ownerName: "",
  representative: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  province: "",
  district: "",
  ward: "",
  imageUrl: "",
  logoUrl: "",
  status: "",
};

function formatDateTime(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN");
}

function getText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  return "";
}

function getStoreName(store: Store) {
  return getText(store.name) || getText(store.title) || "-";
}

function getOwnerName(store: Store) {
  return (
    getText(store.ownerName) ||
    getText(store.representative) ||
    getText(store.producer) ||
    "-"
  );
}

function getLocationText(store: Store) {
  const parts = [store.address, store.ward, store.district, store.province]
    .map(getText)
    .filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "-";
}

export default function StoresAdminPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [form, setForm] = useState<StoreForm>(initialForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredStores = useMemo(() => {
    const searchText = keyword.trim().toLowerCase();

    if (!searchText) {
      return stores;
    }

    return stores.filter((store) => {
      const content = [
        store.id,
        store.name,
        store.title,
        store.description,
        store.ownerName,
        store.representative,
        store.phone,
        store.email,
        store.website,
        store.address,
        store.province,
        store.district,
        store.ward,
        store.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return content.includes(searchText);
    });
  }, [stores, keyword]);

  const activeCount = useMemo(() => {
    return stores.filter((store) => {
      const status = getText(store.status).toLowerCase();

      return ["active", "published", "1", "hoạt động"].includes(status);
    }).length;
  }, [stores]);

  const storeWithImageCount = useMemo(() => {
    return stores.filter((store) =>
      Boolean(getText(store.imageUrl) || getText(store.logoUrl)),
    ).length;
  }, [stores]);

  const storeWithContactCount = useMemo(() => {
    return stores.filter((store) =>
      Boolean(getText(store.phone) || getText(store.email)),
    ).length;
  }, [stores]);

  const loadStores = async () => {
    setLoading(true);

    try {
      const data = await getStores({
        page: 0,
        size: 100,
      });

      setStores(data);
    } catch (error) {
      console.error("Lỗi tải cửa hàng:", error);
      alert("Không thể tải danh sách cửa hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStores();
  }, []);

  const handleChange = (field: keyof StoreForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (store: Store) => {
    setEditingId(store.id);

    setForm({
      name: getText(store.name) || getText(store.title),
      description: getText(store.description),
      ownerName: getText(store.ownerName),
      representative: getText(store.representative),
      phone: getText(store.phone),
      email: getText(store.email),
      website: getText(store.website),
      address: getText(store.address),
      province: getText(store.province),
      district: getText(store.district),
      ward: getText(store.ward),
      imageUrl: getText(store.imageUrl),
      logoUrl: getText(store.logoUrl),
      status: getText(store.status),
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập tên cửa hàng.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      ownerName: form.ownerName.trim() || undefined,
      representative: form.representative.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      website: form.website.trim() || undefined,
      address: form.address.trim() || undefined,
      province: form.province.trim() || undefined,
      district: form.district.trim() || undefined,
      ward: form.ward.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      logoUrl: form.logoUrl.trim() || undefined,
      status: form.status.trim() || undefined,
    };

    try {
      if (editingId) {
        await updateStore(editingId, payload);
      } else {
        await createStore(payload);
      }

      resetForm();
      await loadStores();
    } catch (error) {
      console.error("Lỗi lưu cửa hàng:", error);
      alert("Không thể lưu cửa hàng.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa cửa hàng này không?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteStore(id);
      await loadStores();
    } catch (error) {
      console.error("Lỗi xóa cửa hàng:", error);
      alert("Không thể xóa cửa hàng.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-blue-900/10 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-red-700 via-yellow-400 to-blue-900" />

          <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-6 text-white">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-yellow-200">
                  Cửa hàng địa phương
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
                  Quản lý cửa hàng
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
                  Quản lý thông tin cửa hàng, chủ cơ sở, địa chỉ, thông tin liên
                  hệ, hình ảnh và trạng thái hiển thị trên cổng công dân số.
                </p>
              </div>

              <button
                type="button"
                onClick={loadStores}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl border border-yellow-300 bg-yellow-400 px-5 py-3 text-sm font-bold text-blue-950 shadow-sm transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang tải dữ liệu..." : "Làm mới dữ liệu"}
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              Tổng cửa hàng
            </p>
            <p className="mt-3 text-3xl font-extrabold text-blue-950">
              {stores.length}
            </p>
            <p className="mt-1 text-sm text-slate-500">Cửa hàng đang quản lý</p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Đang hoạt động
            </p>
            <p className="mt-3 text-3xl font-extrabold text-blue-950">
              {activeCount}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Theo trạng thái dữ liệu
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700">
              Có liên hệ
            </p>
            <p className="mt-3 text-3xl font-extrabold text-blue-950">
              {storeWithContactCount}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Có số điện thoại hoặc email
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
              Có hình ảnh
            </p>
            <p className="mt-3 text-3xl font-extrabold text-blue-950">
              {storeWithImageCount}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Cửa hàng đã có ảnh hoặc logo
            </p>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              Thông tin cửa hàng
            </p>

            <h2 className="mt-2 text-xl font-extrabold text-blue-950">
              {editingId ? "Cập nhật cửa hàng" : "Thêm cửa hàng"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Nhập thông tin cửa hàng để hiển thị trên hệ thống.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 p-6 lg:grid-cols-2"
          >
            <div>
              <label className="text-sm font-bold text-slate-700">
                Tên cửa hàng <span className="text-red-600">*</span>
              </label>

              <input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="Nhập tên cửa hàng"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Chủ cửa hàng
              </label>

              <input
                value={form.ownerName}
                onChange={(event) =>
                  handleChange("ownerName", event.target.value)
                }
                placeholder="Nhập tên chủ cửa hàng"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Người đại diện
              </label>

              <input
                value={form.representative}
                onChange={(event) =>
                  handleChange("representative", event.target.value)
                }
                placeholder="Nhập người đại diện"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Số điện thoại
              </label>

              <input
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                placeholder="Nhập số điện thoại"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">Email</label>

              <input
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="Nhập email"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Website
              </label>

              <input
                value={form.website}
                onChange={(event) =>
                  handleChange("website", event.target.value)
                }
                placeholder="Nhập website"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Tỉnh/Thành
              </label>

              <input
                value={form.province}
                onChange={(event) =>
                  handleChange("province", event.target.value)
                }
                placeholder="Nhập tỉnh/thành"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Quận/Huyện
              </label>

              <input
                value={form.district}
                onChange={(event) =>
                  handleChange("district", event.target.value)
                }
                placeholder="Nhập quận/huyện"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Xã/Phường
              </label>

              <input
                value={form.ward}
                onChange={(event) => handleChange("ward", event.target.value)}
                placeholder="Nhập xã/phường"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Trạng thái
              </label>

              <input
                value={form.status}
                onChange={(event) => handleChange("status", event.target.value)}
                placeholder="VD: active"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm font-bold text-slate-700">
                Địa chỉ
              </label>

              <input
                value={form.address}
                onChange={(event) =>
                  handleChange("address", event.target.value)
                }
                placeholder="Nhập địa chỉ cửa hàng"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                URL hình ảnh
              </label>

              <input
                value={form.imageUrl}
                onChange={(event) =>
                  handleChange("imageUrl", event.target.value)
                }
                placeholder="Nhập URL hình ảnh"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                URL logo
              </label>

              <input
                value={form.logoUrl}
                onChange={(event) =>
                  handleChange("logoUrl", event.target.value)
                }
                placeholder="Nhập URL logo"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm font-bold text-slate-700">Mô tả</label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                placeholder="Nhập mô tả cửa hàng"
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5 lg:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Đang lưu..."
                  : editingId
                    ? "Cập nhật cửa hàng"
                    : "Thêm mới cửa hàng"}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                Danh sách cửa hàng
              </p>

              <h2 className="mt-2 text-xl font-extrabold text-blue-950">
                Danh sách cửa hàng
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Đang hiển thị {filteredStores.length} / {stores.length} cửa
                hàng.
              </p>
            </div>

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm tên cửa hàng, chủ cửa hàng, địa chỉ..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100 lg:w-96"
            />
          </div>

          <div className="overflow-x-auto p-6">
            <table className="w-full min-w-[1300px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="bg-blue-950 text-white">
                  <th className="rounded-l-xl px-4 py-4 font-bold">ID</th>
                  <th className="px-4 py-4 font-bold">Ảnh</th>
                  <th className="px-4 py-4 font-bold">Tên cửa hàng</th>
                  <th className="px-4 py-4 font-bold">Chủ cửa hàng</th>
                  <th className="px-4 py-4 font-bold">Liên hệ</th>
                  <th className="px-4 py-4 font-bold">Địa chỉ</th>
                  <th className="px-4 py-4 font-bold">Trạng thái</th>
                  <th className="px-4 py-4 font-bold">Ngày tạo</th>
                  <th className="rounded-r-xl px-4 py-4 font-bold">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      Đang tải dữ liệu cửa hàng...
                    </td>
                  </tr>
                ) : null}

                {!loading && filteredStores.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      Chưa có cửa hàng nào.
                    </td>
                  </tr>
                ) : null}

                {!loading
                  ? filteredStores.map((store) => (
                      <tr
                        key={store.id}
                        className="text-slate-700 transition hover:bg-blue-50/60"
                      >
                        <td className="max-w-[170px] border-b border-slate-100 px-4 py-4 text-xs text-slate-500">
                          <span className="block truncate">{store.id}</span>
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4">
                          {store.imageUrl || store.logoUrl ? (
                            <img
                              src={store.imageUrl || store.logoUrl}
                              alt={getStoreName(store)}
                              className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xs text-slate-400">
                              No img
                            </div>
                          )}
                        </td>

                        <td className="min-w-[260px] border-b border-slate-100 px-4 py-4">
                          <div className="font-bold text-blue-950">
                            {getStoreName(store)}
                          </div>

                          <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {getText(store.description)}
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                          {getOwnerName(store)}
                        </td>

                        <td className="min-w-[180px] border-b border-slate-100 px-4 py-4 text-slate-600">
                          <div>{getText(store.phone) || "-"}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {getText(store.email)}
                          </div>
                        </td>

                        <td className="min-w-[260px] border-b border-slate-100 px-4 py-4 text-slate-600">
                          {getLocationText(store)}
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4">
                          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                            {getText(store.status) || "-"}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4 text-slate-500">
                          {formatDateTime(store.createdAt)}
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(store)}
                              className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-800 transition hover:bg-blue-50"
                            >
                              Sửa
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(store.id)}
                              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
