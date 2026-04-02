import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";

export default function EvalSubcon() {
  return (
    <>
    <AppLayout title='Evaluasi Subcon PT3'>
      <Head title="Exclusive Reports" />

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">
          evaluasi subcon pt3
        </h1>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">
            Ini halamanEvaluasi subcon
          </p>
        </div>
      </div>
    </AppLayout>
    </>
  );
}