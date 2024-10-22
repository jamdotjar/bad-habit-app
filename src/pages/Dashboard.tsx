import supabase from '@/supabase';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';

const Dashboard = () => {
    const [username, setUsername] = useState<string | undefined>();
    useEffect(() => {
        const fetchUserData = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user data:', error);
                return;
            }
            if (data) {
                setUsername(data.user?.user_metadata?.full_name || 'User');
            }
        };

        fetchUserData();
    }, []);

    type Habit = {
        id: number;
        name: string;
        description: string;
        totalDays: number;
        completedDays: number;
        score: number;
        streak: number;
        record: number;
        average: number;
        weeklyTrend: string;
        progress: number;
    };

    const [habits, setHabits] = useState<Habit[]>([]);

    const formatHabits = (habits: any[]) => {
        return habits.map(habit => {
            if (habit.checkin_dates) {
                // Proceed with the existing logic
                return {
                    ...habit,
                    checkin_dates_length: habit.checkin_dates.length,
                };
            } else {
                // Handle the case where checkin_dates is null
                return {
                    ...habit,
                    checkin_dates_length: 0, // or any default value
                };
            }
        });
    };

    const fetchHabitData = async () => {
        const { data, error } = await supabase.from('habits').select('*');
        if (error) {
            console.error('Error fetching habit data:', error);
            return;
        }
        if (data) {
            const formattedHabits = formatHabits(data);
            console.log(formattedHabits);
        }
    };

    useEffect(() => {
        const fetchHabits = async () => {
            const { data, error } = await supabase.from('habits').select('*');
            if (error) {
                console.error('Error fetching habits:', error);
                return;
            }
            if (data) {
                const formattedHabits = data.map((habit: any) => {
                    const totalDays = Math.ceil((new Date(habit.end_date).getTime() - new Date(habit.start_date).getTime()) / (1000 * 60 * 60 * 24));
                    const daysPassed = Math.ceil((new Date().getTime() - new Date(habit.start_date).getTime()) / (1000 * 60 * 60 * 24));
                    const progress = Math.min((daysPassed / totalDays) * 100, 100); // Ensure progress doesn't exceed 100%

                    return {
                        id: habit.id,
                        name: habit.name,
                        description: habit.description || '',
                        totalDays: totalDays,
                        completedDays: habit.checkin_dates ? habit.checkin_dates.length : 0,
                        score: habit.score,
                        streak: 0, // You can calculate streak based on checkin_dates if needed
                        record: 0, // You can calculate record based on checkin_dates if needed
                        average: habit.score, // Assuming score is the average
                        weeklyTrend: '', // You can calculate weekly trend based on checkin_dates if needed
                        progress: progress,
                    };
                });

                setHabits(formattedHabits);
            }
        };

        fetchHabits();
        fetchHabitData();
    }, []);

    const [expandedHabit, setExpandedHabit] = useState<number | null>(null);

    const toggleHabit = (id: number) => {
        setExpandedHabit(expandedHabit === id ? null : id);
    };

    return (
        <div className="container mx-auto p-5 space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold">{username}'s habits</h1>
                <Button variant="link" onClick={() => window.location.href = '/'}>
                    Home
                </Button>
            </div>
            <div className="flex flex-wrap -mx-2">
                {habits.map((habit) => (
                    <div key={habit.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                        <Collapsible
                            open={expandedHabit === habit.id}
                            onOpenChange={() => toggleHabit(habit.id)}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>{habit.name}</CardTitle>
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                {expandedHabit === habit.id ? <ChevronUp /> : <ChevronDown />}
                                            </Button>
                                        </CollapsibleTrigger>
                                    </div>
                                    <CardDescription>
                                        {Math.round(habit.progress)}% done
                                    </CardDescription>
                                    <Progress value={habit.progress} className="w-full mt-2" />
                                </CardHeader>
                                <CollapsibleContent>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">{habit.description}</p>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-secondary p-2 rounded-md">
                                                <p className="text-sm font-medium">Score</p>
                                                <p className="text-2xl font-bold">{habit.score}</p>
                                            </div>
                                            <div className="bg-secondary p-2 rounded-md">
                                                <p className="text-sm font-medium">Streak</p>
                                                <p className="text-2xl font-bold">{habit.streak}</p>
                                            </div>
                                            <div className="bg-secondary p-2 rounded-md">
                                                <p className="text-sm font-medium">Record</p>
                                                <p className="text-2xl font-bold">{habit.record}</p>
                                            </div>
                                            <div className="bg-secondary p-2 rounded-md">
                                                <p className="text-sm font-medium">Avg.</p>
                                                <p className="text-2xl font-bold">{habit.average}%</p>
                                            </div>
                                        </div>
                                        <div className="bg-secondary p-2 rounded-md mb-4">
                                            <p className="text-sm font-medium">Weekly Trends:</p>
                                            <p className="text-sm whitespace-pre-line">{habit.weeklyTrend}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium mb-2">Reflections:</p>
                                            <Input placeholder="What's on your mind?" />
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                                <CardFooter>
                                    <Button className="w-full">
                                        <Check className="mr-2 h-4 w-4" /> Check off for today
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Collapsible>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;