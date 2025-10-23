import React, { useState } from "react";

const AddressForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    nama_penerima: "",
    telepon: "",
    alamat_lengkap: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    kode_pos: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-xl p-4 space-y-3"
    >
      <h2 className="text-lg font-semibold">Tambah Alamat Baru</h2>
      {Object.keys(form).map((key) => (
        <input
          key={key}
          type="text"
          name={key}
          value={form[key]}
          onChange={handleChange}
          placeholder={key.replace("_", " ").toUpperCase()}
          className="w-full border rounded-md px-3 py-2 text-sm"
          required
        />
      ))}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="border px-3 py-2 rounded-md"
        >
          Batal
        </button>
        <button
          type="submit"
          className="bg-black text-white px-3 py-2 rounded-md"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
