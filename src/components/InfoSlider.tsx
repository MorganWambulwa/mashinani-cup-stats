import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info, TrendingUp, Users, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SlideContent {
  icon: React.ReactNode;
  title: string;
  content: string;
  gradient: string;
}

export const InfoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideContent[] = [
    {
      icon: <Info className="w-8 h-8" />,
      title: "League Rules",
      content: "Every gameweek, each of the 11 participants contributes 100. The manager with the highest net points (total points minus transfer points) wins the entire prize pool of 1,100!",
      gradient: "from-primary to-primary-glow"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Scoring System",
      content: "Your net points are calculated by subtracting your transfer points from your total gameweek points. Strategy matters - too many transfers can cost you the win!",
      gradient: "from-accent to-purple-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "11 Participants",
      content: "Welcome to the most competitive mini-league in Fantasy Premier League! Track your performance against 10 other skilled managers throughout the season.",
      gradient: "from-performance-excellent to-performance-good"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Season Goal",
      content: "Consistency is key! While winning individual gameweeks is great, aim for the overall championship by maintaining high net points throughout all 38 gameweeks.",
      gradient: "from-winner to-winner-glow"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="carousel-3d relative">
      <Card className="overflow-hidden bg-gradient-to-br from-card to-muted">
        <CardContent className="p-0">
          <div className="relative h-48 sm:h-56 md:h-64 flex items-center justify-center">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`carousel-slide absolute inset-0 p-8 transition-all duration-800 ${
                  index === currentSlide 
                    ? 'opacity-100 transform translate-x-0 scale-100' 
                    : index < currentSlide 
                      ? 'opacity-0 transform -translate-x-full scale-95'
                      : 'opacity-0 transform translate-x-full scale-95'
                }`}
              >
                <div className={`h-full flex flex-col items-center justify-center text-center bg-gradient-to-br ${slide.gradient} rounded-lg p-4 sm:p-6 text-white`}>
                  <div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-white/20 rounded-full">
                    <div className="w-5 h-5 sm:w-8 sm:h-8">
                      {slide.icon}
                    </div>
                  </div>
                  <h3 className="font-orbitron text-base sm:text-xl font-bold mb-2 sm:mb-4">
                    {slide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-4 sm:line-clamp-none">
                    {slide.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white z-10"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white z-10"
              onClick={nextSlide}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 p-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};