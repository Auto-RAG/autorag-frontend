"use client";

import { useEffect, useState } from "react";

import { ViewServiceDetailButton } from "./view-service-detail-button";

import { APIClient, Project } from "@/lib/api-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ServiceList() {
  const [services, setServices] = useState<Project[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');
      const { data } = await apiClient.getProjects(1, 50, 'active');

      setServices(data);
    };

    fetchServices();
  }, []);

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
