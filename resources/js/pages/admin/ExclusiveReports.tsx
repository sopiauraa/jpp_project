import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";

export default function ExcReport() {
  return (
    <>
    <AppLayout title='Exclusive Report'>
      <Head title="Exclusive Reports" />

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">
          Exlusive Reports
        </h1>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">
            Ini halaman exclusive report.
          </p>
        </div>
      </div>
      </AppLayout>
    </>
  );
}