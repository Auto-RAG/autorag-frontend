import { ViewServiceDetailButton } from "./view-service-detail-button";

import { APIClient } from "@/lib/api-client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export async function ServiceList() {
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');
  const { data } = await apiClient.getProjects(1, 50, 'active');
  const services = data;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.name}>
            <TableCell>{service.name}</TableCell>
            <TableCell>{service.status}</TableCell>
            <TableCell className="text-right">
              <ViewServiceDetailButton service_id={service.name} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
