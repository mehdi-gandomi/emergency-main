import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Phone, MessageSquare, Clock, MessageCircle, Star } from 'lucide-react';

const getRankLabel = (rank) => ({ 
  rescue_assistant: 'امدادیار', 
  rescuer_level_1: 'نجاتگر یک', 
  rescuer_level_2: 'نجاتگر دو', 
  sacrifice: 'ایثار' 
}[rank] || rank);

const calculateETA = (volunteerLocation, incidentLocation) => {
    if (!volunteerLocation || !incidentLocation) return 0;
    const distance = Math.sqrt(
      Math.pow(volunteerLocation.latitude - incidentLocation.latitude, 2) +
      Math.pow(volunteerLocation.longitude - incidentLocation.longitude, 2)
    ) * 111;
    return Math.round(distance * 2);
};

export default function VolunteersTab({ volunteers, selectedVolunteers, onSelectVolunteer, incidentLocation }) {
  const [rankFilter, setRankFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');

  const handleVolunteerSelect = (volunteerId) => {
    const newSelection = selectedVolunteers.includes(volunteerId)
      ? selectedVolunteers.filter(id => id !== volunteerId)
      : [...selectedVolunteers, volunteerId];
    onSelectVolunteer(newSelection);
  };
  
  const teams = [...new Set(volunteers.map(v => v.team).filter(Boolean))];

  const filteredVolunteers = volunteers.filter(v => {
    const rankMatch = rankFilter === 'all' || v.rank === rankFilter;
    const teamMatch = teamFilter === 'all' || v.team === teamFilter;
    return rankMatch && teamMatch && v.status === 'available';
  });

  return (
    <div className="h-full flex flex-col p-4 space-y-4" dir="rtl">
        <div className="grid grid-cols-2 gap-2">
            <Select value={rankFilter} onValueChange={setRankFilter}>
                <SelectTrigger className="bg-gray-100 border-0">
                    <SelectValue placeholder="فیلتر بر اساس رتبه" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">همه رتبه‌ها</SelectItem>
                    <SelectItem value="rescue_assistant">امدادیار</SelectItem>
                    <SelectItem value="rescuer_level_1">نجاتگر یک</SelectItem>
                    <SelectItem value="rescuer_level_2">نجاتگر دو</SelectItem>
                    <SelectItem value="sacrifice">ایثار</SelectItem>
                </SelectContent>
            </Select>
            <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="bg-gray-100 border-0">
                    <SelectValue placeholder="فیلتر بر اساس تیم" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">همه تیم‌ها</SelectItem>
                    {teams.map(team => <SelectItem key={team} value={team}>{team}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>

        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white"/>
            </div>
            <div>
                <h3 className="font-bold text-green-800">داوطلبان آماده</h3>
                <p className="text-sm text-green-600">امدادگران هلال احمر</p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
            {filteredVolunteers.map(volunteer => {
                const isSelected = selectedVolunteers.includes(volunteer.id);
                return (
                    <Card 
                      key={volunteer.id} 
                      className="p-3 bg-white border border-gray-200 hover:shadow-sm transition-all"
                    >
                        <div className="space-y-2">
                            {/* Header with checkbox, avatar, name and status */}
                            <div className="flex items-center gap-3">
                                <Checkbox 
                                    checked={isSelected}
                                    onCheckedChange={() => handleVolunteerSelect(volunteer.id)}
                                    className="w-5 h-5"
                                />
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={volunteer.photo_url} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                        {volunteer.full_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h4 className="font-bold text-base">{volunteer.full_name}</h4>
                                    <Badge className="bg-green-100 text-green-700 border-green-300 text-xs px-2 py-0.5">
                                        {getRankLabel(volunteer.rank)}
                                    </Badge>
                                </div>
                                <Badge className="text-xs px-2 py-0.5 bg-green-100 text-green-700">
                                    آماده
                                </Badge>
                            </div>

                            {/* Team and ETA info */}
                            <div className="mr-14 space-y-1 text-sm text-gray-600">
                                <p>تیم: {volunteer.team}</p>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>ETA: {calculateETA(volunteer.location, incidentLocation)} دقیقه</span>
                                </div>
                            </div>
                            
                            {/* Specializations */}
                            <div className="mr-14 flex flex-wrap gap-1 items-center">
                               {volunteer.specializations && volunteer.specializations.map((spec, index) => (
                                   <Badge key={index} variant="outline" className="text-xs">{spec}</Badge>
                               ))}
                            </div>

                            {/* Communication buttons */}
                            <div className="flex justify-between items-center mr-14 pt-2 border-t mt-2">
                                <div className="flex gap-2">
                                    <Button size="icon" className="w-7 h-7 bg-green-500 hover:bg-green-600"><Phone className="w-4 h-4" /></Button>
                                    <Button size="icon" className="w-7 h-7 bg-blue-500 hover:bg-blue-600"><MessageSquare className="w-4 h-4" /></Button>
                                    <Button size="icon" className="w-7 h-7 bg-purple-500 hover:bg-purple-600"><MessageCircle className="w-4 h-4" /></Button>
                                </div>
                                {volunteer.rating && (
                                    <div className="flex items-center gap-1 text-xs text-amber-500">
                                        <span>{volunteer.rating.toFixed(1)}</span>
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                    </div>
                                )}
                            </div>

                            {/* Mission button - only show for selected volunteers */}
                            {isSelected && (
                                <Button 
                                    className="w-full bg-green-600 hover:bg-green-700 h-9 text-sm"
                                    onClick={() => document.querySelector('header button[class*="bg-red"]').click()}
                                >
                                    ارسال مأموریت
                                </Button>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    </div>
  );
}