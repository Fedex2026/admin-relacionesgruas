'use client';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type Entrega = {
  id: string;
  fecha: string;
  taller: string;
  recibe: string;
  marca: string;
  placas: string;
  foto: string;
};

export default function EntregasPage() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'entregas'));
      const data: Entrega[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          fecha: d.fecha || '',
          taller: d.taller || '',
          recibe: d.recibe || '',
          marca: d.marca || '',
          placas: d.placas || '',
          foto: d.foto || '',
        };
      });
      setEntregas(data);
    };

    fetchData();
  }, []);

  const filtered = entregas.filter((e) => {
    const matchText =
      e.taller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.recibe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.placas.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDate = searchDate ? e.fecha.startsWith(searchDate) : true;

    return matchText && matchDate;
  });

  const exportToExcel = () => {
    const data = filtered.map((e) => ({
      Fecha: e.fecha,
      Taller: e.taller,
      Recibe: e.recibe,
      Marca: e.marca,
      Placas: e.placas,
      Foto: e.foto,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Entregas');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'entregas.xlsx');
  };

  return (
    <div className="min-h-screen bg-white text-black px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Entregas Registradas</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por taller, recibe o placas"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded-md text-black"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border px-3 py-1 rounded-md text-black"
        />
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-1 rounded-md"
        >
          Exportar a Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm text-center">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Taller</th>
              <th className="px-4 py-2 border">Recibe</th>
              <th className="px-4 py-2 border">Marca</th>
              <th className="px-4 py-2 border">Placas</th>
              <th className="px-4 py-2 border">Foto</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-2 py-1 border">{item.fecha}</td>
                <td className="px-2 py-1 border">{item.taller}</td>
                <td className="px-2 py-1 border">{item.recibe}</td>
                <td className="px-2 py-1 border">{item.marca}</td>
                <td className="px-2 py-1 border">{item.placas}</td>
                <td className="px-2 py-1 border">
                  {item.foto ? (
                    <img
                      src={item.foto}
                      alt="Foto"
                      className="w-20 h-20 object-cover mx-auto cursor-pointer"
                      onClick={() => window.open(item.foto, '_blank')}
                    />
                  ) : (
                    'Sin foto'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}