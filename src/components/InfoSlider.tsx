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
  const [isPaused, setIsPaused] = useState(false);
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
        ? "Competition Format:\nWinner Takes All - Manager with highest net points (chips included) each gameweek wins the pot. In case of a tie, the prize is shared equally.\n\nPayments:\nEntry fee: 100/- per manager per gameweek. All payments must be made before the gameweek deadline. Advance payments for multiple gameweeks are allowed. Late payments attract a fine of 50/-. Dropping out requires full settlement of remaining gameweeks.\n\nPayment number: 0794539704"
        : "Competition Format:\nWinner Takes All - Manager with highest net points (chips included) each gameweek wins the pot. In case of a tie, the prize is shared equally...",
      gradient: "from-primary to-primary-glow"
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setExpanded(false);
    }, 10000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div 
      className="carousel-3d relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Card className="overflow-hidden border-muted/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="relative h-44 sm:h-48 md:h-52 flex items-center justify-center p-4">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`carousel-slide absolute inset-4 transition-all duration-800 ${
                  index === currentSlide 
                    ? 'opacity-100 transform translate-x-0 scale-100' 
                    : index < currentSlide 
                      ? 'opacity-0 transform -translate-x-full scale-95'
                      : 'opacity-0 transform translate-x-full scale-95'
                }`}
              >
                <div className={`h-full flex flex-col items-center justify-start text-center bg-gradient-to-br ${slide.gradient} rounded-lg p-4 sm:p-5 text-white overflow-y-auto`}>
                  {index !== 1 && (
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-white/20 rounded-full flex-shrink-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8">
                        {slide.icon}
                      </div>
                    </div>
                  )}
                  <h3 className="font-orbitron text-sm sm:text-base font-bold mb-2 sm:mb-3 flex-shrink-0">
                    {slide.title}
                  </h3>
                  <div className="text-xs sm:text-sm text-white/95 leading-relaxed whitespace-pre-line flex-1 overflow-y-auto w-full text-left px-2">
                    {slide.content}
                    {index === 1 && !expanded && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(true);
                        }}
                        className="block mt-2 text-white font-semibold underline hover:text-white/80 transition-colors text-center w-full"
                      >
                        see more...
                      </button>
                    )}
                    {index === 1 && expanded && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(false);
                        }}
                        className="block mt-2 text-white font-semibold underline hover:text-white/80 transition-colors text-center w-full"
                      >
                        see less
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
          <div className="flex justify-center space-x-2 p-2">
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