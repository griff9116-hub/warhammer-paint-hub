"use client";

import { useState } from "react";
import Link from "next/link";

const FACTIONS = [
  "space-marines", "necrons", "orks", "chaos-space-marines",
  "imperial-guard", "tyranids", "universal",
];

const FACTION_LABELS: Record<string, string> = {
  "space-marines": "Space Marines",
  "necrons": "Necrons",
  "orks": "Orks",
  "chaos-space-marines": "Chaos Space Marines",
  "imperial-guard": "Imperial Guard",
  "tyranids": "Tyranids",
  "universal": "Universal Technique",
};

export default function SubmitRecipePage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    factionSlug: "",
    difficulty: "",
    technique: "",
    description: "",
    authorName: "",
    steps: [{ title: "", description: "", technique: "", duration: "" }],
  });

  const updateStep = (i: number, field: string, value: string) => {
    setForm((f) => ({
      ...f,
      steps: f.steps.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    }));
  };

  const addStep = () =>
    setForm((f) => ({
      ...f,
      steps: [...f.steps, { title: "", description: "", technique: "", duration: "" }],
    }));

  const removeStep = (i: number) =>
    setForm((f) => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Submission failed");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-bone-200 font-display text-3xl mb-3">Recipe Submitted</h1>
        <p className="text-iron-400">Thank you! Your recipe is under review and will be published shortly.</p>
        <Link href="/recipes" className="mt-6 inline-block text-blood-400 hover:underline text-sm">
          Back to recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-bone-200 font-display text-3xl mb-2">Submit a Recipe</h1>
      <p className="text-iron-400 text-sm mb-8">Share your painting guide with the community. All submissions are reviewed before publishing.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Metadata */}
        <div className="bg-iron-800 border border-iron-700 rounded-xl p-5 space-y-4">
          <h2 className="text-bone-200 font-medium">Recipe Details</h2>

          <div>
            <label className="block text-iron-300 text-sm mb-1">Title <span className="text-blood-400">*</span></label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full bg-iron-700 border border-iron-600 rounded-lg px-3 py-2 text-iron-100 text-sm focus:outline-none focus:border-iron-400"
              placeholder="e.g. Ultramarines Blue Armour"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-iron-300 text-sm mb-1">Faction <span className="text-blood-400">*</span></label>
              <select
                required
                value={form.factionSlug}
                onChange={(e) => setForm((f) => ({ ...f, factionSlug: e.target.value }))}
                className="w-full bg-iron-700 border border-iron-600 rounded-lg px-3 py-2 text-iron-100 text-sm focus:outline-none focus:border-iron-400"
              >
                <option value="">Select faction</option>
                {FACTIONS.map((f) => (
                  <option key={f} value={f}>{FACTION_LABELS[f]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-iron-300 text-sm mb-1">Difficulty <span className="text-blood-400">*</span></label>
              <select
                required
                value={form.difficulty}
                onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                className="w-full bg-iron-700 border border-iron-600 rounded-lg px-3 py-2 text-iron-100 text-sm focus:outline-none focus:border-iron-400"
              >
                <option value="">Select difficulty</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-iron-300 text-sm mb-1">Technique</label>
            <input
              value={form.technique}
              onChange={(e) => setForm((f) => ({ ...f, technique: e.target.value }))}
              className="w-full bg-iron-700 border border-iron-600 rounded-lg px-3 py-2 text-iron-100 text-sm focus:outline-none focus:border-iron-400"
              placeholder="e.g. Base-Shade-Highlight"
            />
          </div>

          <div>
            <label className="block text-iron-300 text-sm mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full bg-iron-700 border border-iron-600 rounded-lg px-3 py-2 text-iron-100 text-sm focus:outline-none focus:border-iron-400 resize-none"
              placeholder="Brief overview of the recipe and what makes it distinctive"
            />
          </div>

          <div>
            <label className="block text-iron-300 text-sm mb-1">Your name (optional)</label>
            <input
              value={form.authorName}
              onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              className="w-full bg-iron-700 border border-iron-600 rounded-lg px-3 py-2 text-iron-100 text-sm focus:outline-none focus:border-iron-400"
              placeholder="Display name"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="bg-iron-800 border border-iron-700 rounded-xl p-5 space-y-4">
          <h2 className="text-bone-200 font-medium">Steps</h2>

          {form.steps.map((step, i) => (
            <div key={i} className="bg-iron-700/50 border border-iron-600 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-iron-300 text-sm font-mono">Step {i + 1}</span>
                {form.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="text-iron-500 hover:text-red-400 text-xs transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                required
                value={step.title}
                onChange={(e) => updateStep(i, "title", e.target.value)}
                placeholder="Step title"
                className="w-full bg-iron-800 border border-iron-600 rounded px-3 py-2 text-iron-100 text-sm focus:outline-none focus:border-iron-400"
              />
              <textarea
                required
                value={step.description}
                onChange={(e) => updateStep(i, "description", e.target.value)}
                placeholder="Step instructions"
                rows={2}
                className="w-full bg-iron-800 border border-iron-600 rounded px-3 py-2 text-iron-100 text-sm focus:outline-none focus:border-iron-400 resize-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={step.technique}
                  onChange={(e) => updateStep(i, "technique", e.target.value)}
                  placeholder="Technique (optional)"
                  className="bg-iron-800 border border-iron-600 rounded px-3 py-2 text-iron-100 text-sm focus:outline-none focus:border-iron-400"
                />
                <input
                  value={step.duration}
                  onChange={(e) => updateStep(i, "duration", e.target.value)}
                  placeholder="Duration (optional)"
                  className="bg-iron-800 border border-iron-600 rounded px-3 py-2 text-iron-100 text-sm focus:outline-none focus:border-iron-400"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addStep}
            className="w-full border border-dashed border-iron-600 text-iron-400 hover:border-iron-400 hover:text-iron-200 rounded-lg py-2 text-sm transition-colors"
          >
            + Add step
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blood-600 hover:bg-blood-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 font-medium transition-colors"
        >
          {submitting ? "Submitting…" : "Submit Recipe"}
        </button>
      </form>
    </div>
  );
}
