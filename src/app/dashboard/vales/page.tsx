'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type Vale = {
  id: string;
  fecha: string;
  seguro: string;
  municipio: string;
  marca: string;
  placas: string;
  fotos: string[];
};

export default function ValesPage() {
  const [vales, setVales] = useState<Vale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const fetchVales = async () => {
      const q = query(collection(db, 'vales'));
      const querySnapshot = await getDocs(q);
      const data: Vale[] = [];

      querySnapshot.forEach((doc) => {
        const vale = doc.data();
        const fotos = vale.fotos || [];
        data.push({
          id: doc.id,
          fecha: vale.fecha || '',
          seguro: vale.seguro || '',
          municipio: vale.municipio || '',
          marca: vale.marca || '',
          placas: vale.placas || '',
          fotos,
        });
      });

      setVales(data);
    };

    fetchVales();
  }, []);

  const filteredVales = vales.filter((vale) => {
    const matchTerm =
      vale.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vale.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vale.placas.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDate = searchDate
      ? vale.fecha.startsWith(searchDate)
      : true;

    return matchTerm && matchDate;
  });

  const exportToExcel = () => {
    const data = filteredVales.map((vale) => ({
      Fecha: vale.fecha,
      Seguro: vale.seguro,
      Municipio: vale.municipio,
      Marca: vale.marca,
      Placas: vale.placas,
      Foto1: vale.fotos?.[0] || 'Sin foto',
      Foto2: vale.fotos?.[1] || 'Sin foto',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vales');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'vales.xlsx');
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-black">Vales Registrados</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por municipio, marca o placas"
          className="border px-2 py-1 rounded-md text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="border px-2 py-1 rounded-md text-black"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-1 rounded-md"
        >
          Exportar a Excel
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-400 text-sm text-center">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border px-2 py-1">Fecha</th>
              <th className="border px-2 py-1">Seguro</th>
              <th className="border px-2 py-1">Municipio</th>
              <th className="border px-2 py-1">Marca</th>
              <th className="border px-2 py-1">Placas</th>
              <th className="border px-2 py-1">Foto 1</th>
              <th className="border px-2 py-1">Foto 2</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {filteredVales.map((vale) => (
              <tr key={vale.id}>
                <td className="border px-2 py-1">{vale.fecha}</td>
                <td className="border px-2 py-1">{vale.seguro}</td>
                <td className="border px-2 py-1">{vale.municipio}</td>
                <td className="border px-2 py-1">{vale.marca}</td>
                <td className="border px-2 py-1">{vale.placas}</td>
                <td className="border px-2 py-1">
                  {vale.fotos?.[0] ? (
                    <img
                      src={vale.fotos[0]}
                      alt="foto1"
                      className="w-20 object-cover mx-auto cursor-pointer"
                      onClick={() => window.open(vale.fotos[0], '_blank')}
                    />
                  ) : (
                    'Sin foto'
                  )}
                </td>
                <td className="border px-2 py-1">
                  {vale.fotos?.[1] ? (
                    <img
                      src={vale.fotos[1]}
                      alt="foto2"
                      className="w-20 object-cover mx-auto cursor-pointer"
                      onClick={() => window.open(vale.fotos[1], '_blank')}
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