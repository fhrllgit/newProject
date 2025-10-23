import React from "react";

const AddressModal = ({ addresses, onSelect, onDelete, onAddNew, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] max-h-[80vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute cursor-pointer top-3 right-3">✕</button>
        <h2 className="text-lg font-semibold mb-4">Pilih Alamat</h2>
        <button onClick={onAddNew} className="mb-4 bg-black text-white px-4 py-2 rounded-lg">
          Tambah Alamat Baru
        </button>
        {addresses.map(addr => (
          <div
            key={addr.id}
            className="border rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
          >
            <div onClick={() => onSelect(addr)}>
              <p className="font-semibold">{addr.nama_penerima}</p>
              <p className="text-sm">{addr.alamat_lengkap}, {addr.kota}, {addr.kecamatan}, {addr.kode_pos}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onDelete(addr.id); }} className="text-red-500 text-sm">
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressModal;
