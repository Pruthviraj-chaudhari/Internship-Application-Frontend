"use client"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ResponsivePie } from "@nivo/pie"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/breadcrumb";
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { ExternalLink, Eye, Loader2, Trash2Icon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const breadcrumbItems = [{ title: "Create Course", link: "/" }];

const formSchema = z.object({
  courseTitle: z.string({ message: "Enter a valid course title" }),
  code: z.string({ message: "Enter a valid course code" }),
  description: z.string({ message: "Enter a valid course description" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function Page() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const defaultValues = {
    courseTitle: "",
    code: "",
    description: "",
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      console.log(data)
      const response = await axios.post("http://localhost:8080/api/courses", data);
      toast.success("Course Added Successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response ? error.response.data.message : "Error occured, Please try again");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex-1 space-y-4 p-5">
          <BreadCrumb items={breadcrumbItems} />
          <Heading title="Create New Course" description="Add a new course" />
          <Separator />
        </div>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4">
            <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
              {/* selector */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                    <CardDescription>
                      Create a new course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                        <FormField
                          control={form.control}
                          name="courseTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Title</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Eg. Computer Network"
                                  disabled={loading}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Code</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Eg. CS 102"
                                  disabled={loading}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={`Eg. This course provides a basic introduction to the computer networds`}
                                  disabled={loading}
                                  {...field}
                                  rows={4} // Adjust the number of rows to control the initial height
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="mt-10"></div>
                        <Button disabled={loading} className="ml-auto w-full" type="submit">
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Please wait...
                            </>
                          ) : (
                            <>Create Course</>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </ScrollArea>
      </div>
    </ScrollArea>
  );
}
