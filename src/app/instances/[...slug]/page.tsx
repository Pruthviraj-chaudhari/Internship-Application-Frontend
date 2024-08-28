"use client";
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

interface Course {
  id: number;
  code: string;
  courseTitle: string;
  description: string;
}

interface ApiResponse {
  id: number;
  semester: number;
  year: number;
  course: Course;
}

export default function Page({ params }: any) {
  const parameterData = params.slug;

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<ApiResponse>();

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/instances/${parameterData[0]}/${parameterData[1]}/${parameterData[2]}`
      );
      console.log("Response: ", response.data);
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

  const breadcrumbItems = [{ title: `Instance Id:`, link: "/dashboard/" }];

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex-1 space-y-4 p-5">
          <BreadCrumb items={breadcrumbItems} />
          {loading ? (
            <div>
              <Skeleton className="h-8 w-1/2 mb-2" />
            </div>
          ) : course ? ( // Check if course data exists
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {course.course.courseTitle}
              </h2>
            </div>
          ) : (
            // Display message if no course data is received
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                No course instance data available
              </h2>
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
          ) : course ? ( // Check if course data exists
            <>
              <h2 className="text-lg font-bold tracking-tight">
                {`Course Code: ${course.course.code}`}
              </h2>
              <h2 className="text-justify">{`${course.course.description}`}</h2>
            </>
          ) : (
            // Display message if no course data is received
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                No description available for this course
              </h2>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
