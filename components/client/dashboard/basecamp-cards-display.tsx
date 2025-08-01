"use client";

import React, { useState, useEffect, useImperativeHandle } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ExternalLink, MessageSquare } from "lucide-react";
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

interface BasecampCardsDisplayProps {
  testId: string;
  onCardAction?: (cardId: string, action: 'accept' | 'reject') => void;
  showOnlyIfCards?: boolean; // Only show component if cards exist
}

export const BasecampCardsDisplay = React.forwardRef<
  { refreshCards: () => void },
  BasecampCardsDisplayProps
>(({ testId, onCardAction, showOnlyIfCards = false }, ref) => {
  const [cards, setCards] = useState<BasecampCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only fetch if we haven't checked before
    if (!hasChecked) {
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
  }, [testId, hasChecked]);

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
          userId: 'default_user' // You might want to get this from auth context
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Card accepted successfully');
        // Refresh the cards to show updated column
        refreshCards();
        // Call the onCardAction callback if provided
        if (onCardAction) {
          onCardAction(cardId, 'accept');
        }
      } else {
        console.error('Failed to accept card:', result.error);
        // You might want to show a toast notification here
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
          userId: 'default_user' // You might want to get this from auth context
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Card rejected successfully');
        // Refresh the cards to show updated column
        refreshCards();
        // Call the onCardAction callback if provided
        if (onCardAction) {
          onCardAction(cardId, 'reject');
        }
      } else {
        console.error('Failed to reject card:', result.error);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Error rejecting card:', error);
    }
  };

  const refreshCards = () => {
    setHasChecked(false);
    setCards([]);
    setError(null);
  };

  // Expose refreshCards function to parent component
  useImperativeHandle(ref, () => ({
    refreshCards
  }));

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-muted-foreground">
        <MessageSquare className="h-4 w-4 inline mr-1" />
        Basecamp cards unavailable
      </div>
    );
  }

  if (cards.length === 0) {
    if (showOnlyIfCards) {
      return null; // Don't show anything if no cards and showOnlyIfCards is true
    }
    // Show a subtle indicator that no cards exist
    return (
      <div className="text-xs text-muted-foreground">
        <MessageSquare className="h-3 w-3 inline mr-1" />
        No Basecamp cards yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">
        <MessageSquare className="h-4 w-4 inline mr-1" />
        Basecamp Cards ({cards.length})
      </div>
      <div className="space-y-2">
        {cards.map((card) => (
          <Card key={card.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium line-clamp-1">
                      {card.title}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        card.column_name === "To Do" ? "bg-purple-100 text-purple-800 border-purple-200" :
                        card.column_name === "In Progress" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                        card.column_name === "QA Dev" ? "bg-red-100 text-red-800 border-red-200" :
                        card.column_name === "UT - User Testing" ? "bg-blue-100 text-blue-800 border-blue-200" :
                        card.column_name === "Done" ? "bg-green-100 text-green-800 border-green-200" :
                        "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {card.column_name}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Accept Test Card</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to accept this test card? This will:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Move the card to the "Done" column in Basecamp</li>
                            <li>Mark the test as completed</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleAccept(card.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept Card
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Test Card</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject this test card? This will:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Move the card to the "In Progress" column in Basecamp</li>
                            <li>Return the test for further work</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleReject(card.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Reject Card
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {card.url && (
                    <Button asChild variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <a href={card.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

BasecampCardsDisplay.displayName = 'BasecampCardsDisplay';