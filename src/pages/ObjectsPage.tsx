import { ObjectsTable } from "@/components/objects/objects-table";
import { Outlet, useLocation } from "react-router-dom";

export default function ObjectsPage() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div>
      {path === "/objects" && <ObjectsTable filter="all" />}
      {path === "/objects/standard" && <ObjectsTable filter="standard" />}
      {path === "/objects/custom" && <ObjectsTable filter="custom" />}
      {path !== "/objects" && path !== "/objects/standard" && path !== "/objects/custom" && <Outlet />}
    </div>
  );
}
