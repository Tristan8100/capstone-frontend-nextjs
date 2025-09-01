"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api2 } from "@/lib/api";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Choice {
  id?: number;
  question_id?: number;
  choice_text: string;
}

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  choices: Choice[];
}

interface Survey {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export default function AdminSurveyEditPage2() {
  const params = useParams();
  const id = params?.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("text");
  const [choices, setChoices] = useState<Choice[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    if (!id) return;
    checkResponse(params.id as string);
    api2
      .get<Survey>(`/api/surveys/${id}`)
      .then((res) => setSurvey(res.data))
      .catch((err) => console.error("Error fetching survey:", err));
  }, [id]);

  const checkResponse = async (id: string) => {
    const res = await api2.get<any>(`/api/surveys/check-response/${id}`);
    console.log("Response datasss:", res);
    setHasResponded(res.data.has_responded);
  };

  const handleAdd = () => {
    setQuestionText("");
    setQuestionType("text");
    setChoices([]);
    setSelectedQuestion(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (question: Question) => {
    setQuestionText(question.question_text);
    setQuestionType(question.question_type);
    setChoices(question.choices || []);
    setSelectedQuestion(question);
    setIsDialogOpen(true);
  };

  const handleAddChoice = () => {
    setChoices((prev) => [...prev, { choice_text: "" }]);
  };

  const handleChoiceChange = (index: number, value: string) => {
    const updated = [...choices];
    updated[index].choice_text = value;
    setChoices(updated);
  };

  const handleDeleteChoice = (index: number) => {
    setChoices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (hasResponded) {
      toast.error("Cannot modify options after responses have been submitted.");
      return;
    }
    if (!questionText.trim()) {
      toast.error("Question text is required.");
      return;
    }
    if ((questionType === "radio" || questionType === "checkbox") && choices.length === 0) {
      toast.error("Please add at least one option.");
      return;
    }

    setLoading(true);
    try {
      let questionId: number;

      if (selectedQuestion) {
        // Update question
        await api2.put(`/api/questions/${selectedQuestion.id}`, {
          question_text: questionText,
          question_type: questionType,
        });
        questionId = selectedQuestion.id;

        // Delete old choices
        await api2.delete(`/api/choices/by-question/${questionId}`);

        // Add new choices if needed
        if ((questionType === "radio" || questionType === "checkbox") && choices.length > 0) {
          console.log("Adding choices in bulk for update:", choices.map((c) => c.choice_text));
          await api2.post("/api/choices/bulk", {
            question_id: questionId,
            choices: choices.map((c) => c.choice_text),
          });
        }
      } else {
        // Add new question
        const res = await api2.post<{ id: number }>("/api/questions", {
          survey_id: id,
          question_text: questionText,
          question_type: questionType,
        });
        questionId = res.data.id;

        if ((questionType === "radio" || questionType === "checkbox") && choices.length > 0) {
          console.log("Adding choices in bulk2 for add:", choices.map((c) => c.choice_text));
          await api2.post("/api/choices/bulk", {
            question_id: questionId,
            choices: choices.map((c) => c.choice_text),
          });
        }
      }

      toast.success(selectedQuestion ? "Question updated!" : "Question added!");

      // Refresh survey
      const refresh = await api2.get<Survey>(`/api/surveys/${id}`);
      setSurvey(refresh.data);

      // Reset form
      setQuestionText("");
      setQuestionType("text");
      setChoices([]);
      setSelectedQuestion(null);
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save question.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    if (hasResponded) {
      toast.error("Cannot modify options after responses have been submitted.");
      return;
    }
    setQuestionToDelete(questionId);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!questionToDelete) return;

    try {
      await api2.delete(`/api/questions/${questionToDelete}`);
      toast.success("Question deleted!");

      // Refresh survey data
      const refresh = await api2.get<Survey>(`/api/surveys/${id}`);
      setSurvey(refresh.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question.");
    } finally {
      setIsAlertOpen(false);
      setQuestionToDelete(null);
    }
  };

  if (!survey) return <div className="text-center py-20 text-muted-foreground">Loading survey...</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 font-sans text-foreground bg-background min-h-screen">
      {/* Title & Description */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">{survey.title}</h1>
        <p className="text-sm text-muted-foreground">{survey.description}</p>
        {hasResponded && (
          <div className="mt-4">
            <Badge>Survey has responses, editing is now disabled</Badge>
          </div>
        )}
      </header>

      {/* Add Question Button */}
      <div className="mb-6 flex justify-end">
        <Button onClick={handleAdd} variant="outline">
          + Add Question
        </Button>
      </div>

      {/* Questions List */}
      <section className="space-y-6">
        {survey.questions.length === 0 && (
          <p className="text-center text-muted-foreground italic">No questions added yet.</p>
        )}
        {survey.questions.map((q) => (
          <Card key={q.id} className="shadow-sm border">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-base">{q.question_text}</h3>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(q)}
                    aria-label={`Edit question ${q.id}`}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteQuestion(q.id)}
                    aria-label={`Delete question ${q.id}`}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {q.question_type === "text" && (
                <p className="mt-2 text-sm text-muted-foreground italic">Text input question</p>
              )}

              {(q.question_type === "radio" || q.question_type === "checkbox") && (
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1 max-w-md">
                  {q.choices.map((c) => (
                    <li key={c.id}>{c.choice_text}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Add/Edit Question Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold mb-4">
              {selectedQuestion ? "Edit Question" : "Add Question"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-5"
          >
            <div>
              <Label htmlFor="question_text" className="block mb-1 font-medium text-sm">
                Question Text
              </Label>
              <Input
                id="question_text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter question text"
                required
                className="text-base"
              />
            </div>

            <div>
              <Label htmlFor="question_type" className="block mb-1 font-medium text-sm">
                Question Type
              </Label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="radio">Radio</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(questionType === "radio" || questionType === "checkbox") && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="font-medium text-sm">Options</Label>
                  <Button variant="outline" size="sm" onClick={handleAddChoice}>
                    + Add Option
                  </Button>
                </div>
                <div className="space-y-3 max-h-52 overflow-auto">
                  {choices.map((choice, index) => (
                    <div key={choice.id ?? index} className="flex items-center space-x-3">
                      <Input
                        className="flex-grow text-base"
                        value={choice.choice_text}
                        onChange={(e) => handleChoiceChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteChoice(index)}
                        aria-label={`Delete option ${index + 1}`}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Saving..." : selectedQuestion ? "Update Question" : "Add Question"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the question and all
              associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}