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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  userId?: string;
  onCardAction?: (cardId: string, action: 'accept' | 'reject' | 'delete') => void;
  showOnlyIfCards?: boolean;
  lazyLoad?: boolean; // New prop for lazy loading
}

export const BasecampCardsDisplay = React.forwardRef<
  { refreshCards: () => void },
  BasecampCardsDisplayProps
>(({ testId, userId, onCardAction, showOnlyIfCards = false, lazyLoad = true }, ref) => {
  const [cards, setCards] = useState<BasecampCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Function to extract notes from card content
  const extractNotes = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    
    // Look for the notes section
    const text = tmp.textContent || tmp.innerText || '';
    
    // Find the "Notes:" section
    const notesIndex = text.indexOf('Notes:');
    if (notesIndex === -1) {
      return 'No notes found';
    }
    
    // Extract everything after "Notes:" until the next section or end
    let notesText = text.substring(notesIndex + 6); // Skip "Notes:"
    
    // Look for the next section (Created at:)
    const createdIndex = notesText.indexOf('Created at:');
    if (createdIndex !== -1) {
      notesText = notesText.substring(0, createdIndex);
    }
    
    // Clean up whitespace
    notesText = notesText.trim();
    
    return notesText || 'No notes found';
  };

  // Function to get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('to do') || statusLower.includes('todo')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    } else if (statusLower.includes('in progress') || statusLower.includes('progress')) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    } else if (statusLower.includes('qa dev') || statusLower.includes('qadev')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (statusLower.includes('ut') || statusLower.includes('user testing')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (statusLower.includes('done') || statusLower.includes('complete')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    
    // Default styling
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

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

  useEffect(() => {
    // Only fetch if visible and we haven't checked before
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
  }, [testId, hasChecked, isVisible]);

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
  if (showOnlyIfCards && !hasChecked) {
    return null;
  }

  // Don't render anything if showOnlyIfCards is true and there are no cards
  if (showOnlyIfCards && cards.length === 0) {
    return null;
  }

  // Show loading state
  if (loading) {
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
  if (cards.length === 0) {
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
        {cards.map((card) => (
          <Card key={card.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-medium">{card.title}</h5>
                    <Badge 
                      variant="outline" 
                      className={`text-xs border ${getStatusBadgeStyle(card.column_name)}`}
                    >
                      {card.column_name}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {extractNotes(card.content)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Created: {new Date(card.created_at).toLocaleDateString()}</span>
                    {card.updated_at !== card.created_at && (
                      <span>• Updated: {new Date(card.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader className="pb-4 border-b">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                              {card.title}
                            </DialogTitle>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <Badge 
                                variant="outline" 
                                className={`border ${getStatusBadgeStyle(card.column_name)}`}
                              >
                                {card.column_name}
                              </Badge>
                              <span>•</span>
                              <span>Created: {new Date(card.created_at).toLocaleString()}</span>
                              {card.updated_at !== card.created_at && (
                                <>
                                  <span>•</span>
                                  <span>Updated: {new Date(card.updated_at).toLocaleString()}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="mt-6">
                        <div className="bg-gray-50 rounded-lg p-4 border">
                          <div 
                            className="prose prose-sm max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: card.content }}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Accept"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Accept Basecamp Card</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to accept this Basecamp card? This will mark the issue as resolved.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleAccept(card.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Reject"
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Basecamp Card</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject this Basecamp card? This will mark the issue as not valid.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleReject(card.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="View in Basecamp"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Open in Basecamp</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will open the Basecamp card in a new tab. Do you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => window.open(card.url, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Open in Basecamp
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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