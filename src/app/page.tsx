"use client";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Eye, Trash2Icon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const breadcrumbItems = [{ title: "Employee", link: "/dashboard/employee" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

interface ICourse {
  id: number;
  courseTitle: string;
  code: string;
  description: string;
}

export default function Page({ searchParams }: paramsProps) {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<ICourse[]>([]);

  const router = useRouter();

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/courses`);
      console.log(response.data);
      setCourse(response.data);
    } catch (error: any) {
      toast.error(
        error.response
          ? error.response.data.message
          : "Error occurred, Please try again"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  // Delete Course Handler
  const handleDeleteCourse = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/courses/${id}`);
      toast.success("Course deleted successfully.");
      setCourse(course.filter((item) => item.id !== id)); // Remove the deleted course from state
    } catch (error: any) {
      toast.error(
        error.response
          ? error.response.data.message
          : "Error occurred while deleting, Please try again"
      );
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-start justify-between">
          <Heading
            title="All Courses"
            description="List of all the available courses"
          />

          <Link
            href={"/courses"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <ScrollArea className="rounded-md border">
            <Table className="relative">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.courseTitle}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/courses/${item.id}`) }
                      >
                        <Eye className="h-4 w-4 text-green-500" />
                      </Button>{" "}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteCourse(item.id)} // Pass the course id to the handler
                      >
                        <Trash2Icon className="h-4 w-4 text-red-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
