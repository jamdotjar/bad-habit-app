import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import supabase from '@/supabase';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

const CheckinButton: React.FC<{ habitId: number }> = ({ habitId }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

    useEffect(() => {
        const fetchCheckinStatus = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                console.log(`Today's date: ${today}`);
                console.log(`Fetching checkins for habitId: ${habitId}`);

                const { data: checkins, error } = await supabase
                    .from('checkins')
                    .select('*')
                    .eq('habit_id', habitId);

                if (error) {
                    console.error('Error fetching checkins:', error);
                    return;
                }

                console.log('Fetched checkins:', checkins);

                const hasCheckedIn = checkins.some(checkin => {
                    const checkinDate = new Date(checkin.checkin_date).toISOString().split('T')[0];
                    console.log(`Checkin date: ${checkinDate}`);
                    return checkinDate === today;
                });

                setHasCheckedInToday(hasCheckedIn);
                console.log(`Checkin status for habit ${habitId} on ${today}: ${hasCheckedIn}`);
            } catch (error) {
                console.error('Error fetching checkins:', error);
            }
        };

        fetchCheckinStatus();
    }, [habitId]);

    const handleCheckin = async (rating: number, reflection: string) => {
        const today = new Date().toISOString().split('T')[0];

        const { data: checkins, error: fetchError } = await supabase
            .from('checkins')
            .select('*')
            .eq('habit_id', habitId)
            .eq('checkin_date', today);

        if (fetchError) {
            console.error('Error fetching checkins:', fetchError);
            return;
        }

        if (checkins.length > 0) {
            alert('You have already checked in for today.');
            return;
        }

        const { error: insertError } = await supabase
            .from('checkins')
            .insert([{ habit_id: habitId, rating, reflection, checkin_date: new Date() }]);
        if (!insertError) {
            const { error: updateError } = await supabase
                .from('habits')
                .update({ score: supabase.rpc('increment', { x: 1 }) })
                .eq('id', habitId);

            if (updateError) {
                console.error('Error updating habit score:', updateError);
            }
        }

        if (insertError) {
            console.error('Error inserting checkin:', insertError);
        } else {
            setHasCheckedInToday(true); // Update state to disable button
            setIsDialogOpen(false); // Close dialog
        }
    };

    return (
        <div className="w-full">
            <Button
                onClick={() => setIsDialogOpen(true)}
                variant={hasCheckedInToday ? 'default' : 'outline'}
                disabled={hasCheckedInToday}
                className={`w-full px-4 py-2 rounded-md ${hasCheckedInToday ? 'bg-green-500 ' : ''}`}
            >
                {hasCheckedInToday ? 'All done for today!' : 'Log habit'}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="p-6 bg-white rounded-lg shadow-lg">
                    <DialogTitle className="text-xl font-semibold mb-2">Check In</DialogTitle>
                    <DialogDescription className="text-gray-600 mb-4">Rate your habit and reflect on your progress.</DialogDescription>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const rating = parseInt((e.target as any).rating.value);
                            const reflection = (e.target as any).reflection.value;
                            await handleCheckin(rating, reflection);
                        }}
                        className="space-y-4"
                    >
                        <Input name="rating" type="number" min="1" max="5" required className="w-full px-3 py-2 border rounded-md" />
                        <Textarea name="reflection" required className="w-full px-3 py-2 border rounded-md" />
                        <Button type="submit" className="w-full px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-600">Submit</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CheckinButton;