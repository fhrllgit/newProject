import React from "react";

const AddressList = ({ addresses, onAddNew, onDelete, selectedAddressId, onSelectAddress }) => {
  if (!addresses.length)
    return (
      <div className="bg-gray-100 p-4 rounded-xl">
        <p>Belum ada alamat pengiriman.</p>
        <button
          onClick={onAddNew}
          className="mt-3 bg-black text-white px-4 py-2 rounded-lg"
        >
          Tambah Alamat
        </button>
      </div>
    );

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          onClick={() => onSelectAddress(addr.id)}
          className={`border rounded-xl p-4 flex justify-between items-start cursor-pointer shadow-sm ${
            selectedAddressId === addr.id ? "border-black bg-gray-100" : "bg-white"
          }`}
        >
          <div>
            <p className="font-semibold">{addr.nama_penerima}</p>
            <p className="text-sm">{addr.telepon}</p>
            <p className="text-sm text-gray-600">{addr.alamat_lengkap}</p>
            <p className="text-sm text-gray-500">
              {addr.kecamatan}, {addr.kota}, {addr.provinsi} - {addr.kode_pos}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation(); t
                onDelete(addr.id);
              }}
              className="text-red-500 text-sm"
            >
              Hapus
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={onAddNew}
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        Tambah Alamat Baru
      </button>
    </div>
  );
};

export default AddressList;
