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

  const [expanded, setExpanded] = useState(false);

  const slides: SlideContent[] = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "11 Participants",
      content: "Welcome to FPL. Track your performance against 10 other skilled managers throughout the season.",
      gradient: "from-performance-excellent to-performance-good"
    },
    {
      icon: <Info className="w-8 h-8" />,
      title: "MASHINANI LEAGUE CUP RULES",
      content: expanded 
        ? "Competition Format: Winner Takes All - Manager with highest net points (chips included) each gameweek wins the pot. In case of a tie, the prize is shared equally.\n\nPayments: Entry fee: 100/- per manager per gameweek. All payments must be made before the gameweek deadline. Advance payments for multiple gameweeks are allowed. Late payments attract a fine of 50/-. Dropping out requires full settlement of remaining gameweeks.\n\nPayment number: 0794539704"
        : "Competition Format: Winner Takes All - Manager with highest net points (chips included) each gameweek wins the pot...",
      gradient: "from-primary to-primary-glow"
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
          <div className="relative h-36 sm:h-40 flex items-center justify-center">
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
                <div className={`h-full flex flex-col items-center justify-center text-center bg-gradient-to-br ${slide.gradient} rounded-lg p-3 sm:p-4 text-white`}>
                  <div className="mb-1 sm:mb-2 p-1 sm:p-2 bg-white/20 rounded-full">
                    <div className="w-4 h-4 sm:w-6 sm:h-6">
                      {slide.icon}
                    </div>
                  </div>
                  <h3 className="font-orbitron text-sm sm:text-lg font-bold mb-1 sm:mb-2">
                    {slide.title}
                  </h3>
                  <div className="text-xs sm:text-sm text-white/90 leading-relaxed whitespace-pre-line">
                    {slide.content}
                    {index === 1 && !expanded && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(true);
                        }}
                        className="ml-1 text-white underline hover:text-white/80"
                      >
                        see more...
                      </button>
                    )}
                  </div>
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