import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";

export default function Managementpt2() {
  return (
    <>
    <AppLayout title='Manajemen PT 3'>

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">
          pt2
        </h1>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">
            Ini halaman manajement pt2.
          </p>
        </div>
      </div>
      </AppLayout>
    </>
  );
}