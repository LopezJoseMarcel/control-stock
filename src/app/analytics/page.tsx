"use client";

import { useState } from "react";
import useSWR from "swr";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es"; // Español
import dayjs from "dayjs";

interface Sale {
    _id: string;
    productId: string;
    quantity: number;
    tipo: string;
    salePrice: number;
    cost: number;
    date: string;
  }

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("date"); // "date" para día, "month" para mes/año

  // 📅 Estado para selección por día
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const year = selectedDate ? selectedDate.year() : "";
  const month = selectedDate ? selectedDate.month() + 1 : ""; // +1 porque los meses van de 0-11
  const day = selectedDate ? selectedDate.date() : "";

  // 📅 Estado para selección por mes/año
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(dayjs());
  const monthYear = selectedMonth ? selectedMonth.month() + 1 : "";
  const yearOnly = selectedMonth ? selectedMonth.year() : "";

  // 🔄 Carga de datos según la pestaña activa
  const apiUrl =
    activeTab === "date"
      ? `/api/reports?year=${year}&month=${month}&day=${day}`
      : `/api/reports?year=${yearOnly}&month=${monthYear}`;

  const { data, error } = useSWR(apiUrl, fetcher);
 
  if (error) return <p>Error al cargar los datos</p>;
  if (!data) return <p>Cargando...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>

      {/* 🔘 Tabs para cambiar entre filtros */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("date")}
          className={`px-4 py-2 border rounded ${activeTab === "date" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Por Fecha
        </button>
        <button
          onClick={() => setActiveTab("month")}
          className={`px-4 py-2 border rounded ${activeTab === "month" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Por Mes
        </button>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        {activeTab === "date" ? (
          // 📅 SELECCIÓN POR DÍA
          <div className="mb-4">
            <DatePicker
              label="Selecciona una fecha"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              format="DD/MM/YYYY"
            />
          </div>
        ) : (
          // 📅 SELECCIÓN POR MES/AÑO
          <div className="mb-4">
            <DatePicker
              label="Selecciona un mes y año"
              views={["year", "month"]}
              value={selectedMonth}
              onChange={(newMonth) => setSelectedMonth(newMonth)}
              format="MM/YYYY"
            />
          </div>
        )}
      </LocalizationProvider>

      {/* 📊 Gráficos (Ventas) */}
      <h2 className="text-xl font-semibold mt-4 mb-2">Ventas</h2>
      <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data.sales.map((sale: Sale) => ({ 
      ...sale, 
      totalSale: sale.salePrice * sale.quantity // Agregar totalSale
    }))}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalSale" stroke="#8884d8" name="Ventas" />
        </LineChart>
      </ResponsiveContainer>

      <h2 className="text-xl font-semibold mt-4 mb-2">Total Ventas</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={[data.totalVentas]}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="efectivo" fill="#82ca9d" name="Efectivo" />
          <Bar dataKey="transferencia" fill="#8884d8" name="Transferencia" />
        </BarChart>
      </ResponsiveContainer>

      {/* 📊 Gráficos (Total Comprado) */}
      <h2 className="text-xl font-semibold mt-4 mb-2">Total Comprado</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={[data.totalComprado]}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="efectivo" fill="#82ca9d" name="Efectivo" />
          <Bar dataKey="transferencia" fill="#8884d8" name="Transferencia" />
        </BarChart>
      </ResponsiveContainer>

      {/* 📊 Gráficos (Total Ganancia) */}
      <h2 className="text-xl font-semibold mt-4 mb-2">Total Ganancia</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={[data.totalGanancia]}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="efectivo" fill="#ff7300" name="Efectivo" />
          <Bar dataKey="transferencia" fill="#387908" name="Transferencia" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
