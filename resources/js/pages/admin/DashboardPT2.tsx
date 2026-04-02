import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";

export default function Dashboard() {
  return (
    <>
    <AppLayout title='Dashboard PT2'>

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">
          Dashboard JPP 
        </h1>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">
            Ini halaman dashboard test.
          </p>
        </div>
      </div>
    </AppLayout>
    </>
  );
}