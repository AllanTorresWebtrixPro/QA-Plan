"use client";

import React, { useState, useEffect, useImperativeHandle, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ExternalLink, MessageSquare, Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BasecampCard {
  id: string;
  title: string;
  content: string;
  column_id: string;
  column_name: string;
  created_at: string;
  updated_at: string;
  url: string;
}

interface BasecampCardsDisplayOptimizedProps {
  testId: string;
  userId?: string;
  onCardAction?: (cardId: string, action: 'accept' | 'reject' | 'delete') => void;
  showOnlyIfCards?: boolean;
  lazyLoad?: boolean;
  cards?: BasecampCard[]; // Pre-loaded cards from batch
  isLoading?: boolean; // Loading state from batch
}

export const BasecampCardsDisplayOptimized = React.forwardRef<
  { refreshCards: () => void },
  BasecampCardsDisplayOptimizedProps
>(({ testId, userId, onCardAction, showOnlyIfCards = false, lazyLoad = true, cards: preloadedCards, isLoading: batchLoading }, ref) => {
  const [cards, setCards] = useState<BasecampCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use preloaded cards if available
  const displayCards = preloadedCards || cards;
  const displayLoading = batchLoading || loading;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazyLoad) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazyLoad]);

  // Only fetch individually if no preloaded cards and visible
  useEffect(() => {
    if (preloadedCards !== undefined) {
      // Use preloaded cards, no need to fetch
      return;
    }

    if (isVisible && !hasChecked) {
      const fetchCards = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/qa/test-cards/${testId}`);
          const data = await response.json();

          if (data.success) {
            setCards(data.cards || []);
          } else {
            setError(data.error || "Failed to fetch cards");
          }
        } catch (err) {
          setError("Failed to fetch cards");
          console.error("Error fetching cards:", err);
        } finally {
          setLoading(false);
          setHasChecked(true);
        }
      };

      fetchCards();
    }
  }, [testId, hasChecked, isVisible, preloadedCards]);

  const handleAccept = async (cardId: string) => {
    try {
      console.log(`Accepting card: ${cardId}`);
      
      const response = await fetch('/api/qa/card-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId,
          action: 'accept',
          testId,
          userId: userId || 'default_user'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Card accepted successfully');
        // Add a small delay to ensure Basecamp API has updated
        setTimeout(() => {
          refreshCards();
        }, 1000);
        // Call the onCardAction callback if provided
        if (onCardAction) {
          onCardAction(cardId, 'accept');
        }
      } else {
        console.error('Failed to accept card:', result.error);
      }
    } catch (error) {
      console.error('Error accepting card:', error);
    }
  };

  const handleReject = async (cardId: string) => {
    try {
      console.log(`Rejecting card: ${cardId}`);
      
      const response = await fetch('/api/qa/card-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId,
          action: 'reject',
          testId,
          userId: userId || 'default_user'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Card rejected successfully');
        // Add a small delay to ensure Basecamp API has updated
        setTimeout(() => {
          refreshCards();
        }, 1000);
        // Call the onCardAction callback if provided
        if (onCardAction) {
          onCardAction(cardId, 'reject');
        }
      } else {
        console.error('Failed to reject card:', result.error);
        alert('Failed to reject card: ' + result.error);
      }
    } catch (error) {
      console.error('Error rejecting card:', error);
      alert('Error rejecting card: ' + error);
    }
  };

  const handleDelete = async (cardId: string) => {
    try {
      console.log(`Deleting card: ${cardId}`);
      
      const response = await fetch('/api/qa/card-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId,
          action: 'delete',
          testId,
          userId: userId || 'default_user'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Card deleted successfully');
        // Add a small delay to ensure Basecamp API has updated
        setTimeout(() => {
          refreshCards();
        }, 1000);
        // Call the onCardAction callback if provided
        if (onCardAction) {
          onCardAction(cardId, 'delete');
        }
      } else {
        console.error('Failed to delete card:', result.error);
        alert('Failed to delete card: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error deleting card: ' + error);
    }
  };

  const refreshCards = () => {
    setHasChecked(false);
    setCards([]);
    setError(null);
  };

  useImperativeHandle(ref, () => ({
    refreshCards,
  }));

  // Don't render anything if showOnlyIfCards is true and we haven't loaded cards yet
  if (showOnlyIfCards && !hasChecked && preloadedCards === undefined) {
    return null;
  }

  // Don't render anything if showOnlyIfCards is true and there are no cards
  if (showOnlyIfCards && displayCards.length === 0) {
    return null;
  }

  // Show loading state
  if (displayLoading) {
    return (
      <div ref={containerRef} className="mt-3">
        <div className="text-sm text-muted-foreground">Loading Basecamp cards...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div ref={containerRef} className="mt-3">
        <div className="text-sm text-red-500">Error loading cards: {error}</div>
      </div>
    );
  }

  // Show empty state
  if (displayCards.length === 0) {
    return (
      <div ref={containerRef} className="mt-3">
        <div className="text-sm text-muted-foreground">No Basecamp cards found for this test.</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mt-3">
      <h4 className="text-sm font-medium mb-2">Basecamp Cards:</h4>
      <div className="space-y-2">
        {displayCards.map((card) => (
          <Card key={card.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-medium">{card.title}</h5>
                    <Badge variant="outline" className="text-xs">
                      {card.column_name}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {card.content}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Created: {new Date(card.created_at).toLocaleDateString()}</span>
                    {card.updated_at !== card.created_at && (
                      <span>• Updated: {new Date(card.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAccept(card.id)}
                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    title="Accept"
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReject(card.id)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Reject"
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Basecamp Card</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this Basecamp card? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(card.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(card.url, '_blank')}
                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    title="View in Basecamp"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

BasecampCardsDisplayOptimized.displayName = 'BasecampCardsDisplayOptimized';
