"use client";

import { useEffect, useState, useRef } from "react";
import api from "../lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [salesByMonth, setSalesByMonth] = useState([]);
  const [recent, setRecent] = useState([]);

  const reportRef = useRef(null); // reference for export

  useEffect(() => {
    const fetchData = async () => {
      const s = await api.get("/dashboard/stats");
      setStats(s.data);

      const sbm = await api.get("/dashboard/sales-by-month");
      setSalesByMonth(
        Object.entries(sbm.data).map(([month, total]) => ({ month, total }))
      );

      const r = await api.get("/dashboard/recent-sales");
      setRecent(r.data);
    };
    fetchData();
  }, []);

  return (
    // Scrollable container
    <div className="max-h-screen overflow-y-auto hide-scrollbar p-4 space-y-8">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard</h1>
      </div>

      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col items-center">
            <span className="text-2xl">💰</span>
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-lg font-semibold text-gray-800">
              ${stats.totalSales || 0}
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col items-center">
            <span className="text-2xl">📦</span>
            <p className="text-sm text-gray-500">Total Purchases</p>
            <p className="text-lg font-semibold text-gray-800">
              ${stats.totalPurchases || 0}
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col items-center">
            <span className="text-2xl">👥</span>
            <p className="text-sm text-gray-500">Customers</p>
            <p className="text-lg font-semibold text-gray-800">
              {stats.customers || 0}
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col items-center">
            <span className="text-2xl">🛍️</span>
            <p className="text-sm text-gray-500">Products</p>
            <p className="text-lg font-semibold text-gray-800">
              {stats.products || 0}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div id="salesChart" className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Sales by Month
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Sales */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Sales
          </h2>
          {recent.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recent.map((s) => (
                <div
                  key={s.sale_id}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50 break-inside-avoid"
                >
                  <p className="text-sm text-gray-500">
                    {new Date(s.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {s.customer?.name || "Unknown Customer"}
                  </p>
                  <p className="text-sm text-gray-600">Sale ID: {s.sale_id}</p>
                  <p className="text-blue-600 font-bold">${s.total_amount}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent sales found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
