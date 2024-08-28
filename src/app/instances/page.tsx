"use client";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import {
    SelectValue,
    SelectTrigger,
    SelectItem,
    SelectContent,
    Select,
} from "@/components/ui/select";
import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { eachYearOfInterval, format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const breadcrumbItems = [
    { title: "Create Instance", link: "/dashboard/instances" },
];

interface ICourse {
    id: string;
    courseTitle: string;
    code: string;
    description: string;
}

interface IInstance {
    id: string;
    course: ICourse;
    year: number;
    semester: number;
}

const semester = [1, 2, 3, 4, 5, 6, 7, 8];
const Page = () => {
    const [years, setYears] = useState<number[]>([]);
    const [data, setData] = useState<ICourse[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedYear2, setSelectedYear2] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [selectedSemester2, setSelectedSemester2] = useState<string>("");
    const [instances, setInstances] = useState<IInstance[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const router = useRouter();

    const fetchMappings = async () => {
        try {
            setIsLoading(true); // Set loading state to true

            const response = await axios.get(
                "http://localhost:8080/api/courses"
            );
            setIsLoading(false);
            return response.data;
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            return [];
        }
    };

    useEffect(() => {
        const getData = async () => {
            const Icourses = await fetchMappings();
            setData(Icourses);
        };
        getData();
    }, []);

    useEffect(() => {
        // Using date-fns to generate a range of years
        const startYear = 2000; // Replace with your desired start year
        const currentYear = new Date().getFullYear();
        const yearInterval = eachYearOfInterval({
            start: new Date(startYear, 0, 1),
            end: new Date(currentYear, 0, 1),
        });

        // Map years and sort them in reverse order
        const fetchedYears = yearInterval
            .map((date) => parseInt(format(date, "yyyy")))
            .reverse();
        setYears(fetchedYears);
        setIsLoading(false);
    }, []);

    const handleCreateInstance = async () => {
        // Ensure all selections are made before submitting
        if (!selectedCourse || !selectedYear || !selectedSemester) {
            toast.error("Please select all fields before submitting.");
            return;
        }

        // Construct the payload
        const payload = {
            year: parseInt(selectedYear),
            semester: parseInt(selectedSemester),
            course: data.find((course) => course.id === selectedCourse), // Find the course object by ID
        };

        try {
            // Post the data to the API
            await axios.post("http://localhost:8080/api/instances", payload);

            // Show success toast notification
            toast.success("Instance created successfully!");

            // Clear selections after successful submission
            setSelectedCourse("");
            setSelectedYear("");
            setSelectedSemester("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create instance. Please try again.");
        }
    };

    const handleGetInstances = async () => {
        if (!selectedYear2 || !selectedSemester2) {
            toast.error("Please select both year and semester.");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:8080/api/instances/${selectedYear2}/${selectedSemester2}`);
            setInstances(data);
            toast.success("Instances fetched successfully!");
        } catch (error) {
            toast.error("Failed to fetch instances. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

      // Delete Course Handler
  const handleDeleteInstance = async (year:any, semester:any, courseId:any) => {
    try {
      await axios.delete(`http://localhost:8080/api/instances/${year}/${semester}/${courseId}`);
      toast.success("Instance deleted successfully.");
      
      setInstances(instances.filter((item) => item.id !== courseId)); // Remove the deleted course from state

      router.refresh();
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
        <ScrollArea className="h-full">
            {/* Create Instance */}
            <div className="flex-1 space-y-4 p-5">
                <BreadCrumb items={breadcrumbItems} />
                <Heading
                    title="Create Course Instance"
                    description="Add a new instance"
                />
                <Separator />
            </div>
            <ScrollArea className="h-full">
                <div className="flex-1 space-y-4">
                    <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-[22rem]">
                                    <Label
                                        className="text-base font-medium"
                                        htmlFor="course"
                                    >
                                        Select Course
                                    </Label>
                                    <Select
                                        onValueChange={setSelectedCourse}
                                        value={selectedCourse}
                                    >
                                        <SelectTrigger className="w-full mt-5">
                                            <SelectValue placeholder="Select Course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isLoading ? (
                                                <>
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                </>
                                            ) : data.length > 0 ? (
                                                data.map(
                                                    (
                                                        item: ICourse,
                                                        index: number
                                                    ) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={item.id}
                                                        >
                                                            {`${item.courseTitle} - ${item.code}`}
                                                        </SelectItem>
                                                    )
                                                )
                                            ) : (
                                                <SelectItem
                                                    value="NoCourses"
                                                    disabled
                                                >
                                                    No courses available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-[20rem]">
                                    <Label
                                        className="text-base font-medium"
                                        htmlFor="year"
                                    >
                                        Select Year
                                    </Label>
                                    <Select
                                        onValueChange={setSelectedYear}
                                        value={selectedYear}
                                    >
                                        <SelectTrigger className="w-full mt-5">
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            {isLoading ? (
                                                <>
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                </>
                                            ) : years.length > 0 ? (
                                                years.map((year) => (
                                                    <SelectItem
                                                        key={year}
                                                        value={year.toString()}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem
                                                    value="NoYears"
                                                    disabled
                                                >
                                                    No years available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-[20rem]">
                                    <Label
                                        className="text-base font-medium"
                                        htmlFor="semester"
                                    >
                                        Select Semester
                                    </Label>
                                    <Select
                                        onValueChange={setSelectedSemester}
                                        value={selectedSemester}
                                    >
                                        <SelectTrigger className="w-full mt-5">
                                            <SelectValue placeholder="Select Semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isLoading ? (
                                                <>
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                </>
                                            ) : semester.length > 0 ? (
                                                semester.map((item) => (
                                                    <SelectItem
                                                        key={item}
                                                        value={`${item}`}
                                                    >
                                                        {`Semester ${item}`}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem
                                                    value="NoSemesters"
                                                    disabled
                                                >
                                                    No semesters available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        {/* Submit button */}
                        <div className="mt-6">
                            <Button
                                className={`py-2 px-10  rounded ${!selectedCourse ||
                                    !selectedYear ||
                                    !selectedSemester
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                    }`}
                                onClick={handleCreateInstance}
                                disabled={
                                    !selectedCourse ||
                                    !selectedYear ||
                                    !selectedSemester
                                }
                            >
                                Create Instance
                            </Button>
                        </div>
                    </main>
                </div>
            </ScrollArea>

            {/* Get Instance */}
            <div className="flex-1 space-y-4 p-5 mt-8">
                {/* <BreadCrumb items={breadcrumbItems} /> */}
                <Heading
                    title="Get Course Instance"
                    description="Get all instances"
                />
                <Separator />
            </div>
            <ScrollArea className="h-full">
                <div className="flex-1 space-y-4">
                    <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-[20rem]">
                                    <Label
                                        className="text-base font-medium"
                                        htmlFor="year"
                                    >
                                        Select Year
                                    </Label>
                                    <Select
                                        onValueChange={setSelectedYear2}
                                        value={selectedYear2}
                                    >
                                        <SelectTrigger className="w-full mt-5">
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            {isLoading ? (
                                                <>
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                </>
                                            ) : years.length > 0 ? (
                                                years.map((year) => (
                                                    <SelectItem
                                                        key={year}
                                                        value={year.toString()}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem
                                                    value="NoYears"
                                                    disabled
                                                >
                                                    No years available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-[20rem]">
                                    <Label
                                        className="text-base font-medium"
                                        htmlFor="semester"
                                    >
                                        Select Semester
                                    </Label>
                                    <Select
                                        onValueChange={setSelectedSemester2}
                                        value={selectedSemester2}
                                    >
                                        <SelectTrigger className="w-full mt-5">
                                            <SelectValue placeholder="Select Semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isLoading ? (
                                                <>
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                    <Skeleton className="h-6 w-full mb-2" />
                                                </>
                                            ) : semester.length > 0 ? (
                                                semester.map((item) => (
                                                    <SelectItem
                                                        key={item}
                                                        value={`${item}`}
                                                    >
                                                        {`Semester ${item}`}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem
                                                    value="NoSemesters"
                                                    disabled
                                                >
                                                    No semesters available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        {/* Submit button */}
                        <div className="mt-6">
                            <Button
                                className={`py-2 px-10  rounded ${!selectedYear2 ||
                                        !selectedSemester2
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                onClick={handleGetInstances}
                                disabled={
                                    !selectedYear2 ||
                                    !selectedSemester2
                                }
                            >
                                Get Instances
                            </Button>
                        </div>

                        <ScrollArea className="rounded-md border">
                            <Table className="relative">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Course Title</TableHead>
                                        <TableHead>Course Code</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Semester</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {instances.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.course.courseTitle}</TableCell>
                                            <TableCell>{item.course.code}</TableCell>
                                            <TableCell>{item.year}</TableCell>
                                            <TableCell>{item.semester}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => router.push(`/instances/${item.year}/${item.semester}/${item.course.id}`)}
                                                >
                                                    <Eye className="h-4 w-4 text-green-500" />
                                                </Button>{" "}
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleDeleteInstance(item.year, item.semester, item.course.id)} // Pass the course id to the handler
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
                    </main>
                </div>
            </ScrollArea>
        </ScrollArea>
    );
};

export default Page;


