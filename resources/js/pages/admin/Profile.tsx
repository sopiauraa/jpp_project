import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";

export default function Profile() {
  return (
    <>
    <AppLayout title='Profil'>

      <div className="min-h-screen bg-gray-100 p-6">


        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">
            profile
          </p>
        </div>
      </div>
    </AppLayout>
    </>
  );
}