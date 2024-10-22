"use client"

import supabase from '@/supabase';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const formSchema = z.object({
    habitName: z.string().min(2, {
        message: "Habit name must be at least 2 characters.",
    }),
    endDate: z.string().nonempty({
        message: "End date is required.",
    }),
});

const NewHabitPage = () => {

    const navigate = useNavigate();



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            habitName: '',
            endDate: '',
        },
    });

    const onSubmit = async (values: { habitName: string; endDate: string }) => {
        const { error } = await supabase
            .from('habits')
            .insert([
                {
                    user_id: (await supabase.auth.getUser()).data.user?.id,
                    name: values.habitName,
                    start_date: new Date().toISOString(),
                    end_date: values.endDate,
                    score: 0,
                    checkin_dates: [],
                },
            ]);

        if (error) {
            console.error('Error creating habit:', error.message);
        } else {
            navigate('/dashboard');
        }
    };



    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6">
                <CardTitle className="text-2xl font-bold mb-4 text-center">Add New Habit</CardTitle>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="habitName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Habit Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="what willl your habit be?" {...field} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white shadow-md rounded-md" side="top">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full py-2">Add Habit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewHabitPage;