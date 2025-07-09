'use client';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type Corralon = {
  id: string;
  fecha: string;
  municipio: string;
  marca: string;
  submarca: string;
  placas: string;
  foto: string;
};

export default function CorralonPage() {
  const [corralones, setCorralones] = useState<Corralon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'corralon'));
      const data: Corralon[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          fecha: d.fecha || '',
          municipio: d.municipio || '',
          marca: d.marca || '',
          submarca: d.submarca || '',
          placas: d.placas || '',
          foto: d.foto || '',
        };
      });
      setCorralones(data);
    };

    fetchData();
  }, []);

  const filtered = corralones.filter((c) => {
    const matchText =
      c.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.placas.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDate = searchDate ? c.fecha.startsWith(searchDate) : true;

    return matchText && matchDate;
  });

  const exportToExcel = () => {
    const data = filtered.map((c) => ({
      Fecha: c.fecha,
      Municipio: c.municipio,
      Marca: c.marca,
      Submarca: c.submarca,
      Placas: c.placas,
      Foto: c.foto,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Corralón');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'corralon.xlsx');
  };

  return (
    <div className="min-h-screen bg-white text-black px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Corralón Registrado</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por municipio, marca o placas"
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
              <th className="px-4 py-2 border">Municipio</th>
              <th className="px-4 py-2 border">Marca</th>
              <th className="px-4 py-2 border">Submarca</th>
              <th className="px-4 py-2 border">Placas</th>
              <th className="px-4 py-2 border">Foto</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-2 py-1 border">{item.fecha}</td>
                <td className="px-2 py-1 border">{item.municipio}</td>
                <td className="px-2 py-1 border">{item.marca}</td>
                <td className="px-2 py-1 border">{item.submarca}</td>
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