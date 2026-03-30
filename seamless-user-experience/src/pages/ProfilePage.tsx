import { motion } from "framer-motion";
import { Star, Flame, Coins, Github, Linkedin, MapPin, Calendar, BookOpen, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { SkillCard } from "@/components/SkillCard";
import { mockUser, mockSkills } from "@/lib/mock-data";
import { format } from "date-fns";

export default function ProfilePage() {
  const userSkills = mockSkills.slice(0, 2); // Mock: skills this user teaches

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated />
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Header */}
          <Card className="mb-8 overflow-hidden">
            <div className="h-32 bg-gradient-primary relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,hsl(0_0%_100%/0.1),transparent_60%)]" />
            </div>
            <CardContent className="relative pb-6">
              <div className="flex flex-col sm:flex-row items-start gap-4 -mt-12">
                <img src={mockUser.avatar} alt={mockUser.name} className="w-24 h-24 rounded-2xl border-4 border-card shadow-lg" />
                <div className="flex-1 pt-2 sm:pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-display text-2xl font-bold">{mockUser.name}</h1>
                    {mockUser.isVerified && <Shield className="w-5 h-5 text-primary fill-primary/20" />}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Joined {format(new Date(mockUser.createdAt), "MMM yyyy")}</span>
                    {mockUser.githubId && <span className="flex items-center gap-1"><Github className="w-3.5 h-3.5" />@{mockUser.githubId}</span>}
                    {mockUser.linkedinId && <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5" />Connected</span>}
                  </div>
                </div>
                <Button variant="outline" className="mt-2 sm:mt-6">Edit Profile</Button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-coin mb-1">
                    <Coins className="w-4 h-4" />
                    <span className="text-xl font-display font-bold">{mockUser.tokenBalance}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">SkillCoins</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-coin fill-coin" />
                    <span className="text-xl font-display font-bold">{mockUser.reputationScore}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Reputation</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-destructive mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-xl font-display font-bold">{mockUser.teachingStreak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Teaching Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xl font-display font-bold">3</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <h2 className="font-display text-xl font-bold mb-4">Skills I Teach</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {userSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
