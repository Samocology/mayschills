import { Toaster } from "@/components/ui/sonner";
import { useLocation, Outlet } from "@tanstack/react-router";
import CustomerLayout from "@/components/customer/CustomerLayout";
import AdminLayout from "@/components/admin/AdminLayout";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdmin ? <AdminLayout /> : <CustomerLayout />}
      <Toaster position="top-center" richColors />
    </>
  );
}
