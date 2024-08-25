"use client"
import BreadCrumb from "@/components/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page({ params }: { params: { courseId: string } }) {

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState({
    courseTitle: "",
    code: "",
    description: ""
  });

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/courses/${params.courseId}`);
      console.log(response.data);
      setCourse(response.data);
    } catch (error: any) {
      toast.error(error.response ? error.response.data.message : "Error occured, Please try again");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCourse();
  }, [])

  const breadcrumbItems = [
    { title: `Course Id: ${params.courseId}`, link: "/dashboard/" },
  ];


  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex-1 space-y-4 p-5">
          <BreadCrumb items={breadcrumbItems} />
          {loading ? (
            <div>
              <Skeleton className="h-8 w-1/2 mb-2" />
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{course.courseTitle}</h2>
            </div>
          )}
          <Separator />
        </div>
        <div className="flex-1 space-y-4 p-5">
          {loading ? (
            <>
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full mb-2" />
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold tracking-tight">{`Course Code: ${course.code}`}</h2>
              <h2 className="text-justify">{`${course.description}`}</h2>
            </>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
