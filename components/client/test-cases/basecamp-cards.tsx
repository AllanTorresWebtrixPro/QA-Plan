"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, MessageSquare } from "lucide-react";

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

interface BasecampCardsProps {
  testId: string;
}

export function BasecampCards({ testId }: BasecampCardsProps) {
  const [cards, setCards] = useState<BasecampCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Function to extract developer comments from card content
  const extractDeveloperComments = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    
    // Look for the developer comments section
    const text = tmp.textContent || tmp.innerText || '';
    
    // Find the "Developer Comments:" section
    const commentsIndex = text.indexOf('Developer Comments:');
    if (commentsIndex === -1) {
      return null;
    }
    
    // Extract everything after "Developer Comments:" until the next section or end
    let commentsText = text.substring(commentsIndex + 20); // Skip "Developer Comments:"
    
    // Look for the next section (Created at:)
    const createdIndex = commentsText.indexOf('Created at:');
    if (createdIndex !== -1) {
      commentsText = commentsText.substring(0, createdIndex);
    }
    
    // Clean up whitespace
    commentsText = commentsText.trim();
    
    return commentsText || null;
  };

  useEffect(() => {
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
      }
    };

    fetchCards();
  }, [testId]);

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
    return (
      <div className="text-sm text-muted-foreground">
        <MessageSquare className="h-4 w-4 inline mr-1" />
        No Basecamp cards found
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
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium line-clamp-2">
                    {card.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        card.column_name === "To Do" ? "bg-purple-100 text-purple-800 border-purple-200" :
                        card.column_name === "In Progress" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                        card.column_name === "QA Dev" ? "bg-red-100 text-red-800 border-red-200" :
                        card.column_name === "UT - User Testing" ? "bg-blue-100 text-blue-800 border-blue-200" :
                        "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {card.column_name}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-lg">{card.title}</DialogTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{card.column_name}</Badge>
                          <span>Created: {new Date(card.created_at).toLocaleString()}</span>
                        </div>
                      </DialogHeader>
                      <div className="mt-4">
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: card.content }}
                        />
                        {extractDeveloperComments(card.content) && (
                          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="text-sm text-gray-700">
                              <span className="font-bold text-gray-800">Developer Comments:</span> {extractDeveloperComments(card.content)}
                            </div>
                          </div>
                        )}
                      </div>
                      {card.url && (
                        <div className="mt-4 pt-4 border-t">
                          <Button asChild variant="outline" size="sm">
                            <a href={card.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View in Basecamp
                            </a>
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  {card.url && (
                    <Button asChild variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <a href={card.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
} 