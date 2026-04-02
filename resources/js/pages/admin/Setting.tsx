import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";

export default function Setting() {
  return (
    <>
    <AppLayout title='Pengaturan'>

      <div className="min-h-screen bg-gray-100 p-6">


        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">
            setting
          </p>
        </div>
      </div>
    </AppLayout>
    </>
  );
}