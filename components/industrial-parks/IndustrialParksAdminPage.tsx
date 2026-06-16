"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  createIndustrialPark,
  deleteIndustrialPark,
  getIndustrialParks,
  updateIndustrialPark,
  type IndustrialPark,
} from "@/services/industrial-parks";

type IndustrialParkForm = {
  name: string;
  description: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  area: string;
  occupancyRate: string;
  investor: string;
  phone: string;
  email: string;
  website: string;
  imageUrl: string;
  logoUrl: string;
  status: string;
};

const initialForm: IndustrialParkForm = {
  name: "",
  description: "",
  address: "",
  province: "",
  district: "",
  ward: "",
  area: "",
  occupancyRate: "",
  investor: "",
  phone: "",
  email: "",
  website: "",
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

function parseOptionalNumber(value: string) {
  const text = value.trim();

  if (!text) {
    return undefined;
  }

  const number = Number(text);

  return Number.isNaN(number) ? undefined : number;
}

function getAreaText(park: IndustrialPark) {
  return getText(park.area) || "-";
}

function getOccupancyRateText(park: IndustrialPark) {
  const value = getText(park.occupancyRate);

  if (!value) {
    return "-";
  }

  return value.includes("%") ? value : `${value}%`;
}

function getLocationText(park: IndustrialPark) {
  const parts = [park.address, park.ward, park.district, park.province]
    .map(getText)
    .filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "-";
}

export default function IndustrialParksAdminPage() {
  const [industrialParks, setIndustrialParks] = useState<IndustrialPark[]>([]);
  const [form, setForm] = useState<IndustrialParkForm>(initialForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredIndustrialParks = useMemo(() => {
    const searchText = keyword.trim().toLowerCase();

    if (!searchText) {
      return industrialParks;
    }

    return industrialParks.filter((park) => {
      const content = [
        park.id,
        park.name,
        park.description,
        park.address,
        park.province,
        park.district,
        park.ward,
        park.investor,
        park.phone,
        park.email,
        park.website,
        park.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return content.includes(searchText);
    });
  }, [industrialParks, keyword]);

  const activeCount = useMemo(() => {
    return industrialParks.filter((park) => {
      const status = getText(park.status).toLowerCase();

      return ["active", "published", "1", "hoạt động"].includes(status);
    }).length;
  }, [industrialParks]);

  const parksWithImageCount = useMemo(() => {
    return industrialParks.filter((park) =>
      Boolean(getText(park.imageUrl) || getText(park.logoUrl)),
    ).length;
  }, [industrialParks]);

  const averageOccupancyRate = useMemo(() => {
    const rates = industrialParks
      .map((park) => Number(getText(park.occupancyRate).replace("%", "")))
      .filter((rate) => !Number.isNaN(rate) && rate >= 0);

    if (rates.length === 0) {
      return "-";
    }

    const total = rates.reduce((sum, rate) => sum + rate, 0);

    return `${(total / rates.length).toFixed(1)}%`;
  }, [industrialParks]);

  const loadIndustrialParks = async () => {
    setLoading(true);

    try {
      const data = await getIndustrialParks({
        page: 0,
        size: 100,
      });

      setIndustrialParks(data);
    } catch (error) {
      console.error("Lỗi tải khu công nghiệp:", error);
      alert("Không thể tải danh sách khu công nghiệp.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadIndustrialParks();
  }, []);

  const handleChange = (field: keyof IndustrialParkForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (park: IndustrialPark) => {
    setEditingId(park.id);

    setForm({
      name: getText(park.name),
      description: getText(park.description),
      address: getText(park.address),
      province: getText(park.province),
      district: getText(park.district),
      ward: getText(park.ward),
      area: getText(park.area),
      occupancyRate: getText(park.occupancyRate).replace("%", ""),
      investor: getText(park.investor),
      phone: getText(park.phone),
      email: getText(park.email),
      website: getText(park.website),
      imageUrl: getText(park.imageUrl),
      logoUrl: getText(park.logoUrl),
      status: getText(park.status),
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập tên khu công nghiệp.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      address: form.address.trim() || undefined,
      province: form.province.trim() || undefined,
      district: form.district.trim() || undefined,
      ward: form.ward.trim() || undefined,
      area: parseOptionalNumber(form.area),
      occupancyRate: parseOptionalNumber(form.occupancyRate),
      investor: form.investor.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      website: form.website.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      logoUrl: form.logoUrl.trim() || undefined,
      status: form.status.trim() || undefined,
    };

    try {
      if (editingId) {
        await updateIndustrialPark(editingId, payload);
      } else {
        await createIndustrialPark(payload);
      }

      resetForm();
      await loadIndustrialParks();
    } catch (error) {
      console.error("Lỗi lưu khu công nghiệp:", error);
      alert("Không thể lưu khu công nghiệp.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa khu công nghiệp này không?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteIndustrialPark(id);
      await loadIndustrialParks();
    } catch (error) {
      console.error("Lỗi xóa khu công nghiệp:", error);
      alert("Không thể xóa khu công nghiệp.");
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
                  Khu công nghiệp
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
                  Quản lý khu công nghiệp
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
                  Quản lý thông tin khu công nghiệp, địa chỉ, diện tích, tỷ lệ
                  lấp đầy, nhà đầu tư, thông tin liên hệ và hình ảnh hiển thị
                  trên cổng công dân số.
                </p>
              </div>

              <button
                type="button"
                onClick={loadIndustrialParks}
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
              Tổng khu
            </p>
            <p className="mt-3 text-3xl font-extrabold text-blue-950">
              {industrialParks.length}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Khu công nghiệp đang quản lý
            </p>
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
              Lấp đầy TB
            </p>
            <p className="mt-3 text-3xl font-extrabold text-blue-950">
              {averageOccupancyRate}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Tỷ lệ lấp đầy trung bình
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
              Có hình ảnh
            </p>
            <p className="mt-3 text-3xl font-extrabold text-blue-950">
              {parksWithImageCount}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Khu đã có ảnh hoặc logo
            </p>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              Thông tin khu công nghiệp
            </p>

            <h2 className="mt-2 text-xl font-extrabold text-blue-950">
              {editingId ? "Cập nhật khu công nghiệp" : "Thêm khu công nghiệp"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Nhập thông tin khu công nghiệp để hiển thị trên cổng thông tin địa
              phương.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 p-6 lg:grid-cols-2"
          >
            <div>
              <label className="text-sm font-bold text-slate-700">
                Tên khu công nghiệp <span className="text-red-600">*</span>
              </label>

              <input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="Nhập tên khu công nghiệp"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Nhà đầu tư
              </label>

              <input
                value={form.investor}
                onChange={(event) =>
                  handleChange("investor", event.target.value)
                }
                placeholder="Nhập tên nhà đầu tư"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Diện tích
              </label>

              <input
                type="number"
                min={0}
                value={form.area}
                onChange={(event) => handleChange("area", event.target.value)}
                placeholder="VD: 250"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Tỷ lệ lấp đầy (%)
              </label>

              <input
                type="number"
                min={0}
                max={100}
                value={form.occupancyRate}
                onChange={(event) =>
                  handleChange("occupancyRate", event.target.value)
                }
                placeholder="VD: 75"
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
                placeholder="Nhập email liên hệ"
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
                placeholder="Nhập địa chỉ"
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

            <div className="lg:col-span-2">
              <label className="text-sm font-bold text-slate-700">Mô tả</label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                placeholder="Nhập mô tả khu công nghiệp"
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
                    ? "Cập nhật khu công nghiệp"
                    : "Thêm mới khu công nghiệp"}
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
                Danh sách khu công nghiệp
              </p>

              <h2 className="mt-2 text-xl font-extrabold text-blue-950">
                Danh sách khu công nghiệp
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Đang hiển thị {filteredIndustrialParks.length} /{" "}
                {industrialParks.length} khu công nghiệp.
              </p>
            </div>

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm tên khu, địa chỉ, nhà đầu tư..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100 lg:w-96"
            />
          </div>

          <div className="overflow-x-auto p-6">
            <table className="w-full min-w-[1300px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="bg-blue-950 text-white">
                  <th className="rounded-l-xl px-4 py-4 font-bold">ID</th>
                  <th className="px-4 py-4 font-bold">Ảnh</th>
                  <th className="px-4 py-4 font-bold">Tên khu</th>
                  <th className="px-4 py-4 font-bold">Địa chỉ</th>
                  <th className="px-4 py-4 font-bold">Diện tích</th>
                  <th className="px-4 py-4 font-bold">Lấp đầy</th>
                  <th className="px-4 py-4 font-bold">Nhà đầu tư</th>
                  <th className="px-4 py-4 font-bold">Trạng thái</th>
                  <th className="px-4 py-4 font-bold">Ngày tạo</th>
                  <th className="rounded-r-xl px-4 py-4 font-bold">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      Đang tải dữ liệu khu công nghiệp...
                    </td>
                  </tr>
                ) : null}

                {!loading && filteredIndustrialParks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      Chưa có khu công nghiệp nào.
                    </td>
                  </tr>
                ) : null}

                {!loading
                  ? filteredIndustrialParks.map((park) => (
                      <tr
                        key={park.id}
                        className="text-slate-700 transition hover:bg-blue-50/60"
                      >
                        <td className="max-w-[170px] border-b border-slate-100 px-4 py-4 text-xs text-slate-500">
                          <span className="block truncate">{park.id}</span>
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4">
                          {park.imageUrl || park.logoUrl ? (
                            <img
                              src={park.imageUrl || park.logoUrl}
                              alt={getText(park.name)}
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
                            {getText(park.name) || "-"}
                          </div>

                          <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {getText(park.description)}
                          </div>
                        </td>

                        <td className="min-w-[260px] border-b border-slate-100 px-4 py-4 text-slate-600">
                          {getLocationText(park)}
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4 font-bold text-blue-950">
                          {getAreaText(park)}
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4">
                          <span className="inline-flex rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                            {getOccupancyRateText(park)}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4 text-slate-700">
                          {getText(park.investor) || "-"}
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4">
                          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                            {getText(park.status) || "-"}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4 text-slate-500">
                          {formatDateTime(park.createdAt)}
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(park)}
                              className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-800 transition hover:bg-blue-50"
                            >
                              Sửa
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(park.id)}
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
